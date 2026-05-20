import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, BarChart3, Percent, TrendingUp } from 'lucide-react'
import { Card } from '@/components/Card'
import { JobStatusChart } from '@/components/JobStatusChart'
import { StatCard } from '@/components/StatCard'
import { Loader } from '@/components/Loader'
import { EmptyState } from '@/components/EmptyState'
import { APPLICATION_STATUSES } from '@/constants/status'
import { useApplications } from '@/context/ApplicationsContext'
import { usePageMeta } from '@/hooks/usePageMeta'

export function StatisticsPage() {
  usePageMeta('Statistiques', 'Analysez votre pipeline de candidatures')
  const { stats, statusCounts, loading, error, refresh } = useApplications()

  const total = stats?.total ?? 0
  const safeTotal = total || 1

  const responseRate = useMemo(
    () => Math.round((((stats?.interviews ?? 0) + (stats?.accepted ?? 0)) / safeTotal) * 100),
    [stats, safeTotal],
  )

  const successRate = useMemo(
    () => Math.round(((stats?.accepted ?? 0) / safeTotal) * 100),
    [stats, safeTotal],
  )

  const pipelineActive = useMemo(
    () =>
      (statusCounts['À envoyer'] ?? 0) +
      (statusCounts['Envoyée'] ?? 0) +
      (statusCounts['Entretien'] ?? 0),
    [statusCounts],
  )

  if (loading && !stats) return <Loader label="Chargement des statistiques…" />

  if (error && !stats) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Statistiques indisponibles"
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
      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Taux de réponse"
          value={`${responseRate}%`}
          icon={TrendingUp}
          hint="Entretiens + acceptées"
        />
        <StatCard
          label="Taux d’acceptation"
          value={`${successRate}%`}
          icon={Percent}
          hint="Sur l’ensemble du pipeline"
        />
        <StatCard
          label="Pipeline actif"
          value={pipelineActive}
          icon={BarChart3}
          hint="À envoyer, envoyées, entretiens"
        />
      </section>

      <JobStatusChart counts={statusCounts} />

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
              {APPLICATION_STATUSES.map((key) => (
                <tr key={key} className="border-t border-zinc-100 dark:border-zinc-800">
                  <td className="px-4 py-3 text-zinc-800 dark:text-zinc-200">{key}</td>
                  <td className="px-4 py-3 font-medium tabular-nums">{statusCounts[key] ?? 0}</td>
                  <td className="px-4 py-3 text-zinc-500 tabular-nums">
                    {Math.round(((statusCounts[key] ?? 0) / safeTotal) * 100)}%
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
