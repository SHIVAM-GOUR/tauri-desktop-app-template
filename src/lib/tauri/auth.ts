// FRONTEND WRAPPER OF TAURI RUST COMMANDS
import { invoke } from '@tauri-apps/api/core'

// ── Access Token ──────────────────────────────────────────────

export async function storeAccessToken(token: string): Promise<void> {
    await invoke<void>('store_access_token', { token });
}

export async function getAccessToken(): Promise<string | null> {
    return invoke<string | null>('get_access_token');
}

export async function clearAccessToken(): Promise<void> {
    await invoke<void>('clear_access_token');
}

// ── Refresh Token ─────────────────────────────────────────────

export async function storeRefreshToken(token: string): Promise<void> {
    await invoke<void>('store_refresh_token', { token });
}

export async function getRefreshToken(): Promise<string | null> {
    return invoke<string | null>('get_refresh_token');
}

export async function clearRefreshToken(): Promise<void> {
    await invoke<void>('clear_refresh_token');
}