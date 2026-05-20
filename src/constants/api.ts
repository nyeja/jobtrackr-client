export const STORAGE_KEYS = {
  accessToken: 'jobtrackr_access_token',
} as const

export const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:5000/api'
