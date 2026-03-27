use keyring::Entry;

// use identifier here, identifier is the canonical app ID used by the OS
const SERVICE: &str = "com.yourapp.auth";

// ── Access Token ──────────────────────────────────────────────

#[tauri::command]
pub fn store_access_token(token: String) -> Result<(), String> {
    Entry::new(SERVICE, "access_token")
        .map_err(|e| e.to_string())?
        .set_password(&token)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_access_token() -> Result<Option<String>, String> {
    match Entry::new(SERVICE, "access_token")
        .map_err(|e| e.to_string())?
        .get_password()
    {
        Ok(token) => Ok(Some(token)),
        Err(keyring::Error::NoEntry) => Ok(None),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub fn clear_access_token() -> Result<(), String> {
    Entry::new(SERVICE, "access_token")
        .map_err(|e| e.to_string())?
        .delete_credential()
        .map_err(|e| e.to_string())
}

// ── Refresh Token ─────────────────────────────────────────────

#[tauri::command]
pub fn store_refresh_token(token: String) -> Result<(), String> {
    Entry::new(SERVICE, "refresh_token")
        .map_err(|e| e.to_string())?
        .set_password(&token)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_refresh_token() -> Result<Option<String>, String> {
    match Entry::new(SERVICE, "refresh_token")
        .map_err(|e| e.to_string())?
        .get_password()
    {
        Ok(token) => Ok(Some(token)),
        Err(keyring::Error::NoEntry) => Ok(None),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub fn clear_refresh_token() -> Result<(), String> {
    Entry::new(SERVICE, "refresh_token")
        .map_err(|e| e.to_string())?
        .delete_credential()
        .map_err(|e| e.to_string())
}
