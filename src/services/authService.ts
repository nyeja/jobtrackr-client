import { setAccessToken } from '@/lib/tokenStorage'
import * as authApi from '@/services/authApi'

export async function loginRequest(email: string, password: string, rememberMe = false) {
  const { user, accessToken } = await authApi.login(email.trim(), password)
  setAccessToken(accessToken, rememberMe)
  return { user: authApi.mapUserFromApi(user) }
}

export async function registerRequest(
  name: string,
  email: string,
  password: string,
  rememberMe = false,
) {
  const { user, accessToken } = await authApi.register(name.trim(), email.trim(), password)
  setAccessToken(accessToken, rememberMe)
  return { user: authApi.mapUserFromApi(user) }
}

export async function fetchMe() {
  return authApi.fetchMe()
}

export async function logoutRequest() {
  await authApi.logoutApi()
}
