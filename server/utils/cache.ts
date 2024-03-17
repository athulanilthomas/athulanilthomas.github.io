// Essentials
import { isEmptyAccessToken , safeStringify} from './helpers';

// Types
import type { ICachingStrategy, ICachable } from '@spotify/web-api-ts-sdk';

export interface ICacheStoreAsync {
    get(key: string): Promise<string | null>;
    set(key: string, value: string): Promise<void>;
    remove(key: string): Promise<void>;
}

class AsyncStore implements ICacheStoreAsync {
    private cache = useStorage('db')

    public async get(key: string): Promise<string | null> {
        return await this.cache.getItem<string>(key);

    }

    public async set(key: string, value: string): Promise<void> {
        return await this.cache.setItem(key, value);
    }

    public async remove(key: string): Promise<void> {
        return await this.cache.removeItem(key)
    }
}

class AsyncCache implements ICachingStrategy {
    constructor(
        private storage: ICacheStoreAsync,
        private updateFunctions: Map<string, (item: any) => Promise<ICachable>> = new Map(),
        private autoRenewInterval: number = 0,
        private autoRenewWindow: number = 2 * 60 * 1000 // Two minutes
    ) {
        if (this.autoRenewInterval > 0) {
            setInterval(() => this.autoRenewRenewableItems(), this.autoRenewInterval);
        }
    }

    public async getOrCreate<T>(
        cacheKey: string,
        createFunction: () => Promise<T & ICachable & object>,
        updateFunction?: (item: T) => Promise<T & ICachable & object>
    ): Promise<T & ICachable> {
        if (updateFunction) {
            this.updateFunctions.set(cacheKey, updateFunction);
        }

        const item = await this.get<T>(cacheKey);
        if (item) {
            return item;
        }

        const newCacheItem = await createFunction();

        if (!newCacheItem) {
            throw new Error("Could not create cache item");
        }

        if (!isEmptyAccessToken(newCacheItem)) {
            await this.setCacheItem(cacheKey, newCacheItem);
        }

        return newCacheItem;
    }

    public async get<T>(cacheKey: string): Promise<T & ICachable | null> {
        let asString = await this.storage.get(cacheKey);
        let cachedItem: T & ICachable  = (asString ?? null) as any;

        if (this.itemDueToExpire(cachedItem) && this.updateFunctions.has(cacheKey)) {
            const updateFunction = this.updateFunctions.get(cacheKey);
            await this.tryUpdateItem(cacheKey, cachedItem, updateFunction!);

            // Ensure updated item is returned
            asString = await this.storage.get(cacheKey);
            cachedItem = (asString ?? null) as any;
        }

        if (!cachedItem) {
            return null;
        }

        if (cachedItem.expires && (cachedItem.expires === -1 || cachedItem.expires <= Date.now())) {
            await this.remove(cacheKey);
            return null;
        }

        if (cachedItem.expiresOnAccess && cachedItem.expiresOnAccess === true) {
            await this.remove(cacheKey);
            return cachedItem;
        }

        return cachedItem;
    }

    public async set(cacheKey: string, value: object, expiresIn: number): Promise<void> {
        const expires = Date.now() + expiresIn;
        const cacheItem: ICachable = { ...value, expires };

        await this.setCacheItem(cacheKey, cacheItem);
    }

    public async setCacheItem(cacheKey: string, cacheItem: ICachable): Promise<void> {
        const asString = safeStringify(cacheItem)
        await this.storage.set(cacheKey, asString);
    }

    public async remove(cacheKey: string): Promise<void> {
        await this.storage.remove(cacheKey);
    }

    private itemDueToExpire(item: ICachable): boolean {
        if (!item) {
            return false;
        }

        if (!item.expires) {
            return false;
        }

        return item.expires - Date.now() < (this.autoRenewWindow);
    }

    private async autoRenewRenewableItems() {
        this.updateFunctions.forEach(async (updateFunction, key) => {
            const cachedItem = await this.get(key);
            if (!cachedItem) {
                return;
            }

            if (updateFunction && this.itemDueToExpire(cachedItem)) {
                await this.tryUpdateItem(key, cachedItem, updateFunction);
            }
        });
    }

    private async tryUpdateItem(key: string, cachedItem: ICachable, updateFunction: (item: ICachable) => Promise<ICachable>) {
        try {
            const updated = await updateFunction(cachedItem);
            if (updated) {
                await this.setCacheItem(key, updated);
            }
        } catch (e) {
            console.error(e);
        }
    }

}

export class VercelKVCachingStrategy extends AsyncCache implements ICachingStrategy {
    constructor() {
        super(new AsyncStore());
    }
}

