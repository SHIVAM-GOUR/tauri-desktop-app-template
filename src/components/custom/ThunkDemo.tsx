// ThunkDemo - This is demo component of how to use thunk
import { Button } from '@/components/ui/button';
import {
    loadAccessToken,
    loadRefreshToken,
    persistAccessToken,
    persistRefreshToken,
    revokeAccessToken,
    revokeRefreshToken,
} from '@/store/authSlice';
import type { AppDispatch, RootState } from '@/store/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ThunkDemo = () => {
    const dispatch = useDispatch<AppDispatch>();

    const {
        accessToken,
        refreshToken,
        loading,
        error,
    } = useSelector((state: RootState) => state.auth);
    // On mount — hydrate tokens from keychain into Redux state
    useEffect(() => {
        dispatch(loadAccessToken());
        dispatch(loadRefreshToken());
    }, [dispatch]);

    // Simulates what you'd call after a real login API response
    async function handleSetTokens() {
        const fakeAccessToken = 'fake-access-token';
        const fakeRefreshToken = 'fake-refresh-token';

        // Stores in OS keychain AND updates Redux state
        await dispatch(persistAccessToken(fakeAccessToken));
        await dispatch(persistRefreshToken(fakeRefreshToken));
    }

    async function handleGetTokens() {
        // Stores in OS keychain AND updates Redux state
        await dispatch(loadAccessToken());
        await dispatch(loadRefreshToken());
    }

    // Example of using the access token for an authenticated request
    async function handleRevokeTokens() {
        await dispatch(revokeAccessToken())
        await dispatch(revokeRefreshToken())
    }

    return (
        <div className="flex flex-col gap-4 p-6">
            {/* Error */}
            {error && (
                <div className="rounded-md border border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            {/* Token status */}
            <div className="rounded-md border border-border bg-muted px-4 py-3 text-sm">
                <p className="text-muted-foreground">
                    Access Token:{' '}
                    <span className="font-mono text-foreground">
                        {accessToken ? `${accessToken.slice(0, 20)}...` : 'None'}
                    </span>
                </p>
                <p className="text-muted-foreground">
                    Refresh Token:{' '}
                    <span className="font-mono text-foreground">
                        {refreshToken ? `${refreshToken.slice(0, 20)}...` : 'None'}
                    </span>
                </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <Button onClick={handleSetTokens} disabled={loading}>Set Tokens</Button>
                <Button onClick={handleGetTokens} disabled={loading}>Get Tokens</Button>
                <Button variant="outline" onClick={handleRevokeTokens}>Revoke Tokens</Button>
            </div>
        </div>
    );
}

export default ThunkDemo;

// ```

// ---

// ## What's happening step by step

// **On mount (`useEffect`):**
// - `loadAccessToken` → calls `get_access_token` Tauri command → reads from OS keychain → sets `state.auth.accessToken` in Redux
// - Same for refresh token
// - This means on app restart, tokens are automatically restored from the keychain — no re-login needed

// **On login (`handleLogin`):**
// - After your real auth API returns tokens, dispatch `persistAccessToken(token)`
// - This calls `store_access_token` Tauri command → writes to OS keychain → also sets `state.auth.accessToken` in Redux simultaneously
// - Your component reactively updates because it reads from Redux via `useSelector`

// **Using the token (`handleFetchProfile`):**
// - Just read `accessToken` from Redux state — it's already in memory
// - No need to call the keychain again on every request; the keychain is only for persistence across app restarts

// ---

// ## The mental model
// ```
// App Start → loadAccessToken() → Keychain → Redux state(in -memory)
//                                                     ↓
// useSelector in components

// Login → API response → persistAccessToken() → Keychain(persisted)
//                                             → Redux state(in -memory)