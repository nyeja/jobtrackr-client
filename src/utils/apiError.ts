import axios from 'axios'

export function getApiErrorMessage(error: unknown, fallback = 'Une erreur est survenue'): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Impossible de joindre le serveur. Vérifiez votre connexion.'
    }
    const data = error.response.data as { message?: string }
    if (typeof data?.message === 'string') return data.message
    if (error.response.status === 401) return 'Session expirée — reconnectez-vous.'
    if (error.response.status === 403) return 'Accès refusé.'
    if (error.response.status >= 500) return 'Erreur serveur — réessayez plus tard.'
  }
  if (error instanceof Error) return error.message
  return fallback
}
