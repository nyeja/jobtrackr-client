const TOKEN_KEY = 'jobtrackr_access_token'
const REMEMBER_KEY = 'jobtrackr_remember'

export function getRememberMe(): boolean {
  return localStorage.getItem(REMEMBER_KEY) === 'true'
}

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY)
}

export function setAccessToken(token: string, rememberMe: boolean): void {
  clearAccessToken()
  localStorage.setItem(REMEMBER_KEY, String(rememberMe))
  const storage = rememberMe ? localStorage : sessionStorage
  storage.setItem(TOKEN_KEY, token)
}

export function clearAccessToken(): void {
  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REMEMBER_KEY)
}

export function clearLegacyStorage(): void {
  localStorage.removeItem('jobtrackr_user')
}
