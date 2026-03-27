import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    storeAccessToken, getAccessToken, clearAccessToken,
    storeRefreshToken, getRefreshToken, clearRefreshToken,
} from '@/lib/tauri/auth';

// THUNKS -----------------------
export const persistAccessToken = createAsyncThunk(
    'auth/persistAccessToken',
    async (token: string) => {
        await storeAccessToken(token);
        return token;
    }
);

export const loadAccessToken = createAsyncThunk(
    'auth/loadAccessToken',
    async () => getAccessToken()
);

export const revokeAccessToken = createAsyncThunk(
    'auth/revokeAccessToken',
    async () => {
        await clearAccessToken();
    }
);

export const persistRefreshToken = createAsyncThunk(
    'auth/persistRefreshToken',
    async (token: string) => {
        await storeRefreshToken(token);
        return token;
    }
);

export const loadRefreshToken = createAsyncThunk(
    'auth/loadRefreshToken',
    async () => getRefreshToken()
);

export const revokeRefreshToken = createAsyncThunk(
    'auth/revokeRefreshToken',
    async () => {
        await clearRefreshToken();
    }
);

// --- SLICE------------
interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    accessToken: null,
    refreshToken: null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Persist Access Token
            .addCase(persistAccessToken.pending, (state) => {
                state.loading = true; state.error = null;
            })
            .addCase(persistAccessToken.fulfilled, (state, action) => {
                state.loading = false; state.accessToken = action.payload;
            })
            .addCase(persistAccessToken.rejected, (state, action) => {
                state.loading = false; state.error = action.error.message ?? 'Failed to store access token';
            })
            // Load Access Token
            .addCase(loadAccessToken.pending, (state) => {
                state.loading = true; state.error = null;
            })
            .addCase(loadAccessToken.fulfilled, (state, action) => {
                state.loading = false; state.accessToken = action.payload;
            })
            .addCase(loadAccessToken.rejected, (state, action) => {
                state.loading = false; state.error = action.error.message ?? 'Failed to load access token';
            })
            // Revoke Access Token
            .addCase(revokeAccessToken.pending, (state) => {
                state.loading = true; state.error = null;
            })
            .addCase(revokeAccessToken.fulfilled, (state) => {
                state.loading = false; state.accessToken = null;
            })
            .addCase(revokeAccessToken.rejected, (state) => {
                state.loading = false; state.accessToken = null;
            })
            // Persist Refresh Token
            .addCase(persistRefreshToken.pending, (state) => {
                state.loading = true; state.error = null;
            })
            .addCase(persistRefreshToken.fulfilled, (state, action) => {
                state.loading = false; state.refreshToken = action.payload;
            })
            .addCase(persistRefreshToken.rejected, (state, action) => {
                state.loading = false; state.error = action.error.message ?? 'Failed to store refresh token';
            })
            // Load Refresh Token
            .addCase(loadRefreshToken.pending, (state) => {
                state.loading = true; state.error = null;
            })
            .addCase(loadRefreshToken.fulfilled, (state, action) => {
                state.loading = false; state.refreshToken = action.payload;
            })
            .addCase(loadRefreshToken.rejected, (state, action) => {
                state.loading = false; state.error = action.error.message ?? 'Failed to load refresh token';
            })
            // Revoke Refresh Token
            .addCase(revokeRefreshToken.pending, (state) => {
                state.loading = true; state.error = null;
            })
            .addCase(revokeRefreshToken.fulfilled, (state) => {
                state.loading = false; state.refreshToken = null;
            })
            .addCase(revokeRefreshToken.rejected, (state) => {
                state.loading = false; state.refreshToken = null;
            });
    }
})

export default authSlice.reducer;