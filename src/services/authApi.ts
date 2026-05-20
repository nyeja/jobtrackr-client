import { api, type ApiSuccess } from '@/lib/api'
import type { User } from '@/types/user'

interface ApiUser {
  _id: string
  name: string
  email: string
  role?: string
  createdAt?: string
}

interface AuthPayload {
  user: ApiUser
  accessToken: string
}

export function mapUserFromApi(u: ApiUser): User {
  return { id: u._id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt }
}

export async function register(name: string, email: string, password: string) {
  const { data } = await api.post<ApiSuccess<AuthPayload>>('/auth/register', {
    name,
    email,
    password,
  })
  return data.data!
}

export async function login(email: string, password: string) {
  const { data } = await api.post<ApiSuccess<AuthPayload>>('/auth/login', { email, password })
  return data.data!
}

export async function fetchMe() {
  const { data } = await api.get<ApiSuccess<{ user: ApiUser }>>('/auth/me')
  return mapUserFromApi(data.data!.user)
}

export async function logoutApi() {
  await api.post('/auth/logout')
}
