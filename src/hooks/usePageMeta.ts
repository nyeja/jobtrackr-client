import { useEffect } from 'react'
import { useDashboardHeader } from '@/layouts/DashboardHeaderContext'

export function usePageMeta(title: string, subtitle?: string) {
  const { setHeader } = useDashboardHeader()

  useEffect(() => {
    setHeader({ title, subtitle })
    return () => setHeader({ title: 'Dashboard', subtitle: 'Vue d’ensemble' })
  }, [title, subtitle, setHeader])
}
