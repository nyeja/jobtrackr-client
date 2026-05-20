import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { STATUS_LABELS } from '@/constants/status'
import type { Application } from '@/types/application'
import { MOCK_APPLICATIONS } from '@/services/mockApplications'

interface ApplicationsContextValue {
  applications: Application[]
  addApplication: (app: Omit<Application, 'id' | 'history'>) => void
  updateApplication: (id: string, patch: Partial<Application>) => void
  deleteApplication: (id: string) => void
  getById: (id: string | undefined) => Application | undefined
}

const ApplicationsContext = createContext<ApplicationsContextValue | null>(null)

function createId() {
  return crypto.randomUUID()
}

export function ApplicationsProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS)

  const addApplication = useCallback((app: Omit<Application, 'id' | 'history'>) => {
    const id = createId()
    const entry: Application = {
      ...app,
      id,
      history: [
        {
          id: createId(),
          date: new Date().toISOString(),
          message: 'Candidature ajoutée',
        },
      ],
    }
    setApplications((prev) => [entry, ...prev])
  }, [])

  const updateApplication = useCallback((id: string, patch: Partial<Application>) => {
    setApplications((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a
        const statusChanged =
          patch.status !== undefined && patch.status !== a.status
        const next: Application = {
          ...a,
          ...patch,
          history: statusChanged
            ? [
                {
                  id: createId(),
                  date: new Date().toISOString(),
                  message: `Statut : ${STATUS_LABELS[patch.status!]}`,
                },
                ...a.history,
              ]
            : a.history,
        }
        return next
      }),
    )
  }, [])

  const deleteApplication = useCallback((id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const getById = useCallback(
    (id: string | undefined) => applications.find((a) => a.id === id),
    [applications],
  )

  const value = useMemo(
    () => ({
      applications,
      addApplication,
      updateApplication,
      deleteApplication,
      getById,
    }),
    [applications, addApplication, updateApplication, deleteApplication, getById],
  )

  return <ApplicationsContext.Provider value={value}>{children}</ApplicationsContext.Provider>
}

export function useApplications() {
  const ctx = useContext(ApplicationsContext)
  if (!ctx) throw new Error('useApplications must be used within ApplicationsProvider')
  return ctx
}
