import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Briefcase, CalendarCheck, CheckCircle2, XCircle } from 'lucide-react'
import { Card } from '@/components/Card'
import { DashboardSkeleton } from '@/components/Skeleton'
import { JobStatusChart } from '@/components/JobStatusChart'
import { StatCard } from '@/components/StatCard'
import { StatusBadge } from '@/components/Badge'
import { useApplications } from '@/context/ApplicationsContext'
import { usePageMeta } from '@/hooks/usePageMeta'
import type { ApplicationStatus } from '@/types/application'
import { formatDate } from '@/utils/format'

function countByStatus(apps: ReturnType<typeof useApplications>['applications']) {
  const base: Record<ApplicationStatus, number> = {
    to_send: 0,
    sent: 0,
    interview: 0,
    rejected: 0,
    accepted: 0,
  }
  for (const a of apps) base[a.status]++
  return base
}

export function DashboardPage() {
  usePageMeta('Dashboard', 'Vue d’ensemble de vos candidatures')
  const { applications } = useApplications()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  const counts = useMemo(() => countByStatus(applications), [applications])
  const total = applications.length
  const interviews = counts.interview
  const accepted = counts.accepted
  const rejected = counts.rejected

  const recent = useMemo(
    () =>
      [...applications]
        .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
        .slice(0, 5),
    [applications],
  )

  if (loading) return <DashboardSkeleton />

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="space-y-8"
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total candidatures"
          value={total}
          icon={Briefcase}
          hint="+2 cette semaine"
          trend={[3, 5, 4, 6, 5, 7, total || 1]}
        />
        <StatCard
          label="Entretiens"
          value={interviews}
          icon={CalendarCheck}
          hint="En cours de process"
          trend={[1, 2, 1, 3, 2, interviews || 1, interviews]}
        />
        <StatCard
          label="Acceptées"
          value={accepted}
          icon={CheckCircle2}
          hint="Objectif du trimestre"
          trend={[0, 1, 0, 1, 1, accepted || 1, accepted]}
        />
        <StatCard
          label="Refusées"
          value={rejected}
          icon={XCircle}
          hint="Apprentissage continu"
          trend={[1, 0, 1, 2, 1, rejected || 1, rejected]}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <JobStatusChart counts={counts} className="lg:col-span-2" />
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                Activité récente
              </h3>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Dernières candidatures ajoutées
              </p>
            </div>
            <Link
              to="/applications"
              className="text-sm font-medium text-violet-700 hover:text-violet-900 dark:text-violet-300"
            >
              Voir tout
            </Link>
          </div>
          <ul className="space-y-3">
            {recent.map((app) => (
              <li key={app.id}>
                <Link
                  to={`/applications/${app.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-zinc-100 bg-zinc-50/50 px-3 py-3 transition-colors hover:border-zinc-200 hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/40 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      {app.company}
                    </p>
                    <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{app.role}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <StatusBadge status={app.status} />
                    <span className="text-[11px] text-zinc-400">{formatDate(app.appliedAt)}</span>
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
