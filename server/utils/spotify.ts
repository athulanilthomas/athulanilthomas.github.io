// Essentials

import { emptyAccessToken } from '@spotify/web-api-ts-sdk'
import { AccessTokenHelpers } from './helpers'

// Types
import type { IAuthStrategy, ICachable, SdkConfiguration, AccessToken, ICachingStrategy } from '@spotify/web-api-ts-sdk'

interface CachedVerifier extends ICachable {
    verifier: string;
    expiresOnAccess: boolean;
}

export class AuthorizationCodeWithPKCEStrategyOnNode implements IAuthStrategy {
    private static readonly cacheKey = "spotify-sdk:AuthorizationCodeWithPKCEStrategyOnNode:token";
    private configuration: SdkConfiguration | null = null;
    protected get cache(): ICachingStrategy { return this.configuration!.cachingStrategy; }

    constructor(
        protected clientId: string,
        protected redirectUri: string,
        protected scopes: string[],
    ) {}

    public setConfiguration(configuration: SdkConfiguration): void {
        this.configuration = configuration;
    }

    public async getOrCreateAccessToken(): Promise<AccessToken> {
        const token = await this.cache.getOrCreate<AccessToken>(
            AuthorizationCodeWithPKCEStrategyOnNode.cacheKey,
            async () => {
                const token = await this.verifyToken();
                return AccessTokenHelpers.toCachable(token);
            }, async (expiring) => {
                return  AccessTokenHelpers.refreshCachedAccessToken(this.clientId, expiring)
            },
        );

        return token;
    }

    public async getAccessToken(): Promise<AccessToken | null> {
        const token = await this.cache.get<AccessToken>(AuthorizationCodeWithPKCEStrategyOnNode.cacheKey);
        return token;
    }

    public removeAccessToken(): void {
        this.cache.remove(AuthorizationCodeWithPKCEStrategyOnNode.cacheKey);
    }

    private async verifyToken(): Promise<AccessToken> {
        const code = await this.cache.get<string>('spotify-sdk:AuthorizationCodeWithPKCEStrategyOnNode:code') // This will be set while calling the redirect URL 

        if (code) {
            const token = await this.verifyAndExchangeCode(code);
            return token;
        }

        const wait = await this.waitForRedirection(); // No use of this response

        if (wait.redirected && wait.url) {
            console.info(`\n\nPaste this URL in browser: ${wait.url}\n\n`);
        }

        return emptyAccessToken;
    }

    private async waitForRedirection() {
        const verifier = AccessTokenHelpers.generateCodeVerifier(128);
        const challenge = await AccessTokenHelpers.generateCodeChallenge(verifier);

        const singleUseVerifier: CachedVerifier = { verifier, expiresOnAccess: true };
        await this.cache.setCacheItem("spotify-sdk:verifier", singleUseVerifier);

        const redirectTarget = await this.generateAuthorizationUrlForUser(this.scopes, challenge);
        return fetch(redirectTarget)
    }

    private async verifyAndExchangeCode(code: string) {
        const cachedItem = await this.cache.get<CachedVerifier>("spotify-sdk:verifier");
        const verifier = cachedItem?.verifier;
        
        if (!verifier) {
            throw new Error("No verifier found in cache - can't validate query string callback parameters.");
        }

        return await this.exchangeCodeForToken(code, verifier!);
    }

    protected async generateAuthorizationUrlForUser(scopes: string[], challenge: string) {
        const scope = scopes.join(' ');

        const params = new URLSearchParams();
        params.append("client_id", this.clientId);
        params.append("response_type", "code");
        params.append("redirect_uri", this.redirectUri);
        params.append("scope", scope);
        params.append("code_challenge_method", "S256");
        params.append("code_challenge", challenge);

        return `https://accounts.spotify.com/authorize?${params.toString()}`;
    }

    protected async exchangeCodeForToken(code: string, verifier: string): Promise<AccessToken> {
        const params = new URLSearchParams();
        params.append("client_id", this.clientId);
        params.append("grant_type", "authorization_code");
        params.append("code", code);
        params.append("redirect_uri", this.redirectUri);
        params.append("code_verifier", verifier!);

        const result = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params
        });

        const text = await result.text();

        if (!result.ok) {
            throw new Error(`Failed to exchange code for token: ${result.statusText}, ${text}`);
        }

        const json: AccessToken = JSON.parse(text);
        return json;
    }
}