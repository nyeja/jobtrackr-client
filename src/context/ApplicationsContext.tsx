import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import toast from 'react-hot-toast'
import type { ApplicationFormValues } from '@/components/ApplicationFormModal'
import { useAuth } from '@/context/AuthContext'
import { getApiErrorMessage } from '@/lib/api'
import * as applicationsApi from '@/services/applicationsApi'
import type { PaginationMeta } from '@/types/api'
import type { Application, ApplicationStats } from '@/types/application'
import type { ApplicationStatus } from '@/types/application'
import { APPLICATION_STATUSES } from '@/constants/status'

interface ListFilters {
  page?: number
  limit?: number
  search?: string
  status?: ApplicationStatus | 'all'
  sort?: 'asc' | 'desc'
}

interface ApplicationsContextValue {
  applications: Application[]
  pagination: PaginationMeta | null
  stats: ApplicationStats | null
  statusCounts: Record<ApplicationStatus, number>
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  fetchList: (params?: ListFilters) => Promise<void>
  addApplication: (values: ApplicationFormValues) => Promise<Application>
  updateApplication: (id: string, values: ApplicationFormValues) => Promise<Application>
  deleteApplication: (id: string) => Promise<void>
  getById: (id: string | undefined) => Application | undefined
  fetchById: (id: string) => Promise<Application>
}

const ApplicationsContext = createContext<ApplicationsContextValue | null>(null)

const emptyCounts = APPLICATION_STATUSES.reduce(
  (acc, s) => {
    acc[s] = 0
    return acc
  },
  {} as Record<ApplicationStatus, number>,
)

export function ApplicationsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [pagination, setPagination] = useState<PaginationMeta | null>(null)
  const [stats, setStats] = useState<ApplicationStats | null>(null)
  const [statusCounts, setStatusCounts] = useState(emptyCounts)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [detailCache, setDetailCache] = useState<Record<string, Application>>({})
  const lastFiltersRef = useRef<ListFilters>({ page: 1, limit: 10, sort: 'desc', status: 'all' })

  const fetchList = useCallback(async (params: ListFilters = {}) => {
    const merged = { ...lastFiltersRef.current, ...params }
    lastFiltersRef.current = merged
    setLoading(true)
    setError(null)
    try {
      const [listResult, statsResult] = await Promise.all([
        applicationsApi.fetchApplications({
          page: merged.page,
          limit: merged.limit,
          search: merged.search,
          status: merged.status,
          sort: merged.sort,
        }),
        applicationsApi.fetchStats(),
      ])
      setApplications(listResult.applications)
      setPagination(listResult.pagination)
      setStats(statsResult.stats)
      setStatusCounts(statsResult.statusCounts)
      setDetailCache((prev) => {
        const next = { ...prev }
        for (const a of listResult.applications) next[a.id] = a
        return next
      })
    } catch (err) {
      const message = getApiErrorMessage(err, 'Impossible de charger les candidatures')
      setError(message)
      toast.error(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const refresh = useCallback(async () => {
    await fetchList(lastFiltersRef.current)
  }, [fetchList])

  useEffect(() => {
    if (isAuthenticated) {
      void fetchList({ page: 1, limit: 10, status: 'all' })
    } else {
      setApplications([])
      setStats(null)
      setStatusCounts(emptyCounts)
      setPagination(null)
      setError(null)
      setDetailCache({})
    }
  }, [isAuthenticated, fetchList])

  const fetchById = useCallback(async (id: string) => {
    const app = await applicationsApi.fetchApplicationById(id)
    setDetailCache((prev) => ({ ...prev, [id]: app }))
    return app
  }, [])

  const getById = useCallback(
    (id: string | undefined) => {
      if (!id) return undefined
      return detailCache[id] ?? applications.find((a) => a.id === id)
    },
    [detailCache, applications],
  )

  const addApplication = useCallback(
    async (values: ApplicationFormValues) => {
      const created = await applicationsApi.createApplication(values)
      await refresh()
      return created
    },
    [refresh],
  )

  const updateApplication = useCallback(
    async (id: string, values: ApplicationFormValues) => {
      const updated = await applicationsApi.updateApplication(id, values)
      setDetailCache((prev) => ({ ...prev, [id]: updated }))
      await refresh()
      return updated
    },
    [refresh],
  )

  const deleteApplication = useCallback(
    async (id: string) => {
      await applicationsApi.deleteApplication(id)
      setDetailCache((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
      await refresh()
    },
    [refresh],
  )

  const value = useMemo(
    () => ({
      applications,
      pagination,
      stats,
      statusCounts,
      loading,
      error,
      refresh,
      fetchList,
      addApplication,
      updateApplication,
      deleteApplication,
      getById,
      fetchById,
    }),
    [
      applications,
      pagination,
      stats,
      statusCounts,
      loading,
      error,
      refresh,
      fetchList,
      addApplication,
      updateApplication,
      deleteApplication,
      getById,
      fetchById,
    ],
  )

  return <ApplicationsContext.Provider value={value}>{children}</ApplicationsContext.Provider>
}

export function useApplications() {
  const ctx = useContext(ApplicationsContext)
  if (!ctx) throw new Error('useApplications must be used within ApplicationsProvider')
  return ctx
}
