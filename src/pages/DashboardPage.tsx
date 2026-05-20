import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Briefcase, CalendarCheck, CheckCircle2, XCircle } from 'lucide-react'
import { Card } from '@/components/Card'
import { DashboardSkeleton } from '@/components/Skeleton'
import { JobStatusChart } from '@/components/JobStatusChart'
import { StatCard } from '@/components/StatCard'
import { StatusBadge } from '@/components/Badge'
import { EmptyState } from '@/components/EmptyState'
import { useApplications } from '@/context/ApplicationsContext'
import { usePageMeta } from '@/hooks/usePageMeta'
import { formatDate } from '@/utils/format'

export function DashboardPage() {
  usePageMeta('Dashboard', 'Vue d’ensemble')
  const { applications, stats, statusCounts, loading, error, refresh } = useApplications()

  const recent = useMemo(
    () =>
      [...applications]
        .sort(
          (a, b) =>
            new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime(),
        )
        .slice(0, 5),
    [applications],
  )

  if (loading && applications.length === 0) return <DashboardSkeleton />

  if (error && applications.length === 0) {
    return (
      <EmptyState
        title="Impossible de charger le dashboard"
        description={error}
        action={
          <button
            type="button"
            onClick={() => void refresh()}
            className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white"
          >
            Réessayer
          </button>
        }
      />
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total" value={stats?.total ?? 0} icon={Briefcase} />
        <StatCard label="Entretiens" value={stats?.interviews ?? 0} icon={CalendarCheck} />
        <StatCard label="Acceptées" value={stats?.accepted ?? 0} icon={CheckCircle2} />
        <StatCard label="Refusées" value={stats?.rejected ?? 0} icon={XCircle} />
      </section>
      <section className="grid gap-6 lg:grid-cols-3">
        <JobStatusChart counts={statusCounts} className="lg:col-span-2" />
        <Card>
          <div className="mb-4 flex justify-between">
            <h3 className="font-semibold">Activité récente</h3>
            <Link to="/applications" className="text-sm text-violet-700">
              Voir tout
            </Link>
          </div>
          <ul className="space-y-3">
            {recent.map((app) => (
              <li key={app.id}>
                <Link
                  to={`/applications/${app.id}`}
                  className="flex justify-between rounded-xl border px-3 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  <div>
                    <p className="text-sm font-medium">{app.company}</p>
                    <p className="text-xs text-zinc-500">{app.position}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={app.status} />
                    <p className="mt-1 text-[11px] text-zinc-400">
                      {formatDate(app.applicationDate)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </motion.div>
  )
}
