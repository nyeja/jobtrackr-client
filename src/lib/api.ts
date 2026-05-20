import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'
import { getAccessToken, getRememberMe, setAccessToken } from '@/lib/tokenStorage'
import { clearAccessToken, clearLegacyStorage } from '@/lib/tokenStorage'
import { isTokenExpired } from '@/lib/jwt'

export interface ApiSuccess<T = unknown> {
  success: true
  message: string
  data?: T
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

let onUnauthorized: (() => void) | null = null

export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler
}

function forceLogout(message?: string) {
  clearAccessToken()
  clearLegacyStorage()
  if (message) console.warn(message)
  onUnauthorized?.()
  window.dispatchEvent(new CustomEvent('jobtrackr:logout'))
}

export function getApiErrorMessage(error: unknown, fallback = 'Une erreur est survenue'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string }
    if (data?.message) return data.message
    if (!error.response) return 'Impossible de joindre le serveur.'
    if (error.response.status === 401) return 'Session expirée — reconnectez-vous.'
  }
  if (error instanceof Error) return error.message
  return fallback
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken()
  if (token) {
    if (isTokenExpired(token)) {
      forceLogout()
      return Promise.reject(new axios.Cancel('Token expiré'))
    }
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let refreshQueue: Array<{ resolve: (t: string) => void; reject: (e: unknown) => void }> = []

function processQueue(error: unknown, token: string | null = null) {
  refreshQueue.forEach((p) => {
    if (error) p.reject(error)
    else if (token) p.resolve(token)
  })
  refreshQueue = []
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    if (!original || error.response?.status !== 401) return Promise.reject(error)

    const isAuth =
      original.url?.includes('/auth/login') ||
      original.url?.includes('/auth/register') ||
      original.url?.includes('/auth/refresh')

    if (isAuth || original._retry) {
      if (!isAuth) forceLogout()
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({
          resolve: (token) => {
            original.headers.Authorization = `Bearer ${token}`
            resolve(api(original))
          },
          reject,
        })
      })
    }

    original._retry = true
    isRefreshing = true
    try {
      const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true })
      const accessToken = data?.data?.accessToken as string
      if (!accessToken) throw new Error('Token manquant')
      setAccessToken(accessToken, getRememberMe())
      processQueue(null, accessToken)
      original.headers.Authorization = `Bearer ${accessToken}`
      return api(original)
    } catch (e) {
      processQueue(e, null)
      forceLogout()
      return Promise.reject(e)
    } finally {
      isRefreshing = false
    }
  },
)

export default api
