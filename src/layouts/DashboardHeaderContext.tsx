import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

export interface DashboardHeaderState {
  title: string
  subtitle?: string
}

const DashboardHeaderContext = createContext<{
  header: DashboardHeaderState
  setHeader: (next: DashboardHeaderState) => void
} | null>(null)

export function DashboardHeaderProvider({ children }: { children: ReactNode }) {
  const [header, setHeaderState] = useState<DashboardHeaderState>({
    title: 'Dashboard',
    subtitle: 'Vue d’ensemble',
  })

  const setHeader = useCallback((next: DashboardHeaderState) => {
    setHeaderState(next)
  }, [])

  const value = useMemo(() => ({ header, setHeader }), [header, setHeader])

  return <DashboardHeaderContext.Provider value={value}>{children}</DashboardHeaderContext.Provider>
}

export function useDashboardHeader() {
  const ctx = useContext(DashboardHeaderContext)
  if (!ctx) throw new Error('useDashboardHeader must be used within DashboardHeaderProvider')
  return ctx
}
