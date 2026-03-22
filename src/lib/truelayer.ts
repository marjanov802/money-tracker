// lib/truelayer.ts
// Core TrueLayer API helpers — token exchange, refresh, accounts, transactions

const TRUELAYER_AUTH_URL = 'https://auth.truelayer-sandbox.com'
const TRUELAYER_API_URL = 'https://api.truelayer.com'   // remove -sandbox // swap to api.truelayer.com in prod

const CLIENT_ID = process.env.TRUELAYER_CLIENT_ID!
const CLIENT_SECRET = process.env.TRUELAYER_CLIENT_SECRET!
const REDIRECT_URI = process.env.TRUELAYER_REDIRECT_URI!

// ─── Auth URL ────────────────────────────────────────────────────────────────

export function buildAuthUrl(userId: string): string {
    const state = Buffer.from(JSON.stringify({ userId, ts: Date.now() })).toString('base64url')

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        scope: 'info accounts balance cards transactions direct_debits standing_orders offline_access',
        state,
        providers: 'uk-cs-mock uk-ob-all uk-oauth-all',
    })

    return `${TRUELAYER_AUTH_URL}/?${params.toString()}`
}

export function parseState(state: string): { userId: string; ts: number } {
    return JSON.parse(Buffer.from(state, 'base64url').toString())
}

// ─── Token exchange ───────────────────────────────────────────────────────────

export interface TokenResponse {
    access_token: string
    refresh_token: string
    expires_in: number // seconds
}

export async function exchangeCode(code: string): Promise<TokenResponse> {
    const res = await fetch(`${TRUELAYER_AUTH_URL}/connect/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            code,
        }),
    })

    if (!res.ok) {
        const err = await res.text()
        throw new Error(`TrueLayer token exchange failed: ${err}`)
    }

    return res.json()
}

export async function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
    const res = await fetch(`${TRUELAYER_AUTH_URL}/connect/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            refresh_token: refreshToken,
        }),
    })

    if (!res.ok) {
        const err = await res.text()
        throw new Error(`TrueLayer token refresh failed: ${err}`)
    }

    return res.json()
}

// ─── Accounts ────────────────────────────────────────────────────────────────

export interface BankAccount {
    account_id: string
    display_name: string
    currency: string
    account_type: string
    provider: {
        provider_id: string
        display_name: string
    }
}

export async function fetchAccounts(accessToken: string): Promise<BankAccount[]> {
    const res = await fetch(`${TRUELAYER_API_URL}/data/v1/accounts`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!res.ok) {
        const err = await res.text()
        throw new Error(`TrueLayer fetch accounts failed: ${err}`)
    }

    const data = await res.json()
    return data.results ?? []
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export interface TLTransaction {
    transaction_id: string
    timestamp: string
    description: string
    amount: number
    currency: string
    transaction_type: string
    merchant_name?: string
    transaction_category?: string
    running_balance?: { amount: number; currency: string }
}

export async function fetchTransactions(
    accessToken: string,
    accountId: string,
    from?: Date,
    to?: Date
): Promise<TLTransaction[]> {
    const params = new URLSearchParams()
    if (from) params.set('from', from.toISOString())
    if (to) params.set('to', to.toISOString())

    const url = `${TRUELAYER_API_URL}/data/v1/accounts/${accountId}/transactions?${params}`

    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!res.ok) {
        const err = await res.text()
        throw new Error(`TrueLayer fetch transactions failed (account ${accountId}): ${err}`)
    }

    const data = await res.json()
    return data.results ?? []
}

// ─── Token expiry helper ──────────────────────────────────────────────────────

export function expiresAt(expiresIn: number): Date {
    // Subtract 60s buffer so we refresh before actual expiry
    return new Date(Date.now() + (expiresIn - 60) * 1000)
}