interface QueryValues {
    code: string,
    state: string,
    error?: string
}

export default defineEventHandler(async (event) => {
    const { code, error } = getQuery<QueryValues>(event)

    if(!error && code) {
        const asString = JSON.stringify(code, (key, val) => `"${val}"`)
        await useStorage('db').setItem(
            'spotify-sdk:AuthorizationCodeWithPKCEStrategyOnNode:code',
            asString
        )
    }

    return sendNoContent(event)
})