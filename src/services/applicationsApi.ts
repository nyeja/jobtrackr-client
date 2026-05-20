import api, { type ApiSuccess } from '@/lib/api'
import type { ApplicationFormValues } from '@/components/ApplicationFormModal'
import { mapApplication, mapStatsByStatus } from '@/utils/applicationMapper'
import type {
  Application,
  ApplicationApi,
  ApplicationStats,
  ApplicationStatus,
} from '@/types/application'

export interface ListParams {
  page?: number
  limit?: number
  search?: string
  status?: ApplicationStatus | 'all'
  sort?: 'asc' | 'desc'
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export async function fetchApplications(params: ListParams = {}) {
  const query: Record<string, string | number> = {
    page: params.page ?? 1,
    limit: params.limit ?? 10,
    sort: params.sort ?? 'desc',
  }
  if (params.search?.trim()) query.search = params.search.trim()
  if (params.status && params.status !== 'all') query.status = params.status

  const { data } = await api.get<
    ApiSuccess<{
      applications: ApplicationApi[]
      pagination: PaginationMeta
    }>
  >('/applications', { params: query })

  const payload = data.data!
  return {
    applications: payload.applications.map(mapApplication),
    pagination: payload.pagination,
  }
}

export async function fetchApplicationById(id: string): Promise<Application> {
  const { data } = await api.get<ApiSuccess<{ application: ApplicationApi }>>(
    `/applications/${id}`,
  )
  return mapApplication(data.data!.application)
}

export async function createApplication(values: ApplicationFormValues) {
  const { data } = await api.post<ApiSuccess<{ application: ApplicationApi }>>(
    '/applications',
    values,
  )
  return mapApplication(data.data!.application)
}

export async function updateApplication(id: string, values: ApplicationFormValues) {
  const { data } = await api.put<ApiSuccess<{ application: ApplicationApi }>>(
    `/applications/${id}`,
    values,
  )
  return mapApplication(data.data!.application)
}

export async function deleteApplication(id: string) {
  await api.delete(`/applications/${id}`)
}

export async function fetchStats(): Promise<{
  stats: ApplicationStats
  statusCounts: Record<ApplicationStatus, number>
}> {
  const { data } = await api.get<ApiSuccess<{ stats: ApplicationStats }>>(
    '/applications/stats',
  )
  const stats = data.data!.stats
  return { stats, statusCounts: mapStatsByStatus(stats.byStatus) }
}
