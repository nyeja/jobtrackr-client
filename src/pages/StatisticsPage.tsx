import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Percent, TrendingUp } from 'lucide-react'
import { Card } from '@/components/Card'
import { JobStatusChart } from '@/components/JobStatusChart'
import { StatCard } from '@/components/StatCard'
import { STATUS_LABELS } from '@/constants/status'
import { useApplications } from '@/context/ApplicationsContext'
import { usePageMeta } from '@/hooks/usePageMeta'
import type { ApplicationStatus } from '@/types/application'

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

export function StatisticsPage() {
  usePageMeta('Statistiques', 'Analysez votre pipeline de candidatures')
  const { applications } = useApplications()
  const counts = useMemo(() => countByStatus(applications), [applications])
  const total = applications.length || 1
  const responseRate = Math.round(((counts.interview + counts.accepted) / total) * 100)
  const successRate = Math.round((counts.accepted / total) * 100)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Taux de réponse"
          value={`${responseRate}%`}
          icon={TrendingUp}
          hint="Entretiens + acceptées"
          trend={[20, 35, 28, 40, responseRate, 55, responseRate]}
        />
        <StatCard
          label="Taux d’acceptation"
          value={`${successRate}%`}
          icon={Percent}
          hint="Sur l’ensemble du pipeline"
          trend={[5, 8, 10, 12, successRate, 15, successRate]}
        />
        <StatCard
          label="Pipeline actif"
          value={counts.sent + counts.interview + counts.to_send}
          icon={BarChart3}
          hint="En cours de traitement"
          trend={[4, 6, 5, 7, 8, 6, counts.sent + counts.interview]}
        />
      </section>

      <JobStatusChart counts={counts} />

      <Card>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Détail par statut
        </h3>
        <div className="mt-4 overflow-hidden rounded-xl border border-zinc-100 dark:border-zinc-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50/80 text-left text-xs font-medium uppercase tracking-wide text-zinc-500 dark:bg-zinc-950/50 dark:text-zinc-400">
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Part</th>
              </tr>
            </thead>
            <tbody>
              {(Object.keys(STATUS_LABELS) as ApplicationStatus[]).map((key) => (
                <tr key={key} className="border-t border-zinc-100 dark:border-zinc-800">
                  <td className="px-4 py-3 text-zinc-800 dark:text-zinc-200">{STATUS_LABELS[key]}</td>
                  <td className="px-4 py-3 font-medium tabular-nums">{counts[key]}</td>
                  <td className="px-4 py-3 text-zinc-500 tabular-nums">
                    {Math.round((counts[key] / total) * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  )
}
