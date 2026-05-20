import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertCircle, ExternalLink, MoreHorizontal, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  ApplicationFormModal,
  type ApplicationFormValues,
} from '@/components/ApplicationFormModal'
import { Button } from '@/components/Button'
import { EmptyState } from '@/components/EmptyState'
import { Loader } from '@/components/Loader'
import { SearchBar } from '@/components/SearchBar'
import { StatusBadge } from '@/components/Badge'
import { APPLICATION_STATUSES } from '@/constants/status'
import { toApiDateInput } from '@/utils/applicationMapper'
import { Pagination } from '@/components/Pagination'
import { useApplications } from '@/context/ApplicationsContext'
import { getApiErrorMessage } from '@/lib/api'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { usePageMeta } from '@/hooks/usePageMeta'
import type { ApplicationStatus } from '@/types/application'
import { formatDate } from '@/utils/format'

export function ApplicationsPage() {
  usePageMeta('Candidatures', 'Gérez et filtrez vos opportunités')
  const {
    applications,
    pagination,
    loading,
    error,
    fetchList,
    addApplication,
    deleteApplication,
    refresh,
  } = useApplications()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [menuId, setMenuId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const debouncedSearch = useDebouncedValue(search, 300)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, statusFilter])

  useEffect(() => {
    void fetchList({ search: debouncedSearch, status: statusFilter, page, limit: 10 })
  }, [debouncedSearch, statusFilter, page, fetchList])

  const filtered = useMemo(() => applications, [applications])

  const handleCreate = async (values: ApplicationFormValues) => {
    setSubmitting(true)
    try {
      await addApplication(values)
      toast.success('Candidature ajoutée')
    } catch (err) {
      toast.error(getApiErrorMessage(err))
      throw err
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteApplication(id)
      setMenuId(null)
      toast.success('Candidature supprimée')
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-white">
            Vos candidatures
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {pagination
              ? `${pagination.total} résultat${pagination.total > 1 ? 's' : ''}`
              : 'Chargement…'}
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="shrink-0 self-start lg:self-auto">
          <Plus className="size-4" />
          Nouvelle candidature
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={search} onChange={setSearch} placeholder="Rechercher entreprise, poste…" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | 'all')}
          className="h-10 rounded-xl border border-zinc-200/80 bg-white px-3 text-sm text-zinc-800 shadow-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-violet-500 dark:focus:ring-violet-500/20"
        >
          <option value="all">Tous les statuts</option>
          {APPLICATION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading && filtered.length === 0 ? (
        <Loader label="Chargement des candidatures…" />
      ) : error && filtered.length === 0 ? (
        <EmptyState
          icon={AlertCircle}
          title="Erreur de chargement"
          description={error}
          action={
            <Button variant="secondary" onClick={() => void refresh()}>
              Réessayer
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Plus}
          title="Aucune candidature"
          description="Ajoutez votre première opportunité ou modifiez vos filtres."
          action={
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="size-4" />
              Nouvelle candidature
            </Button>
          }
        />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/80 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-400">
                  <th className="px-4 py-3">Entreprise</th>
                  <th className="px-4 py-3">Poste</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Offre</th>
                  <th className="px-4 py-3 w-12" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b border-zinc-50 transition-colors hover:bg-zinc-50/60 dark:border-zinc-800/80 dark:hover:bg-zinc-800/30"
                  >
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
                      <Link
                        to={`/applications/${app.id}`}
                        className="hover:text-violet-700 dark:hover:text-violet-300"
                      >
                        {app.company}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">{app.position}</td>
                    <td className="px-4 py-3 text-zinc-500">{formatDate(toApiDateInput(app.applicationDate))}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-4 py-3">
                      {app.jobUrl ? (
                        <a
                          href={app.jobUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-violet-700 hover:underline dark:text-violet-300"
                        >
                          Voir <ExternalLink className="size-3.5" />
                        </a>
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </td>
                    <td className="relative px-4 py-3">
                      <button
                        type="button"
                        className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        onClick={() => setMenuId(menuId === app.id ? null : app.id)}
                      >
                        <MoreHorizontal className="size-4" />
                      </button>
                      {menuId === app.id ? (
                        <div className="absolute right-4 top-10 z-10 min-w-[140px] rounded-xl border border-zinc-200/80 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-950">
                          <Link
                            to={`/applications/${app.id}`}
                            className="block px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
                            onClick={() => setMenuId(null)}
                          >
                            Détails
                          </Link>
                          <button
                            type="button"
                            className="block w-full px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                            onClick={() => void handleDelete(app.id)}
                          >
                            Supprimer
                          </button>
                        </div>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 md:hidden">
            {filtered.map((app, i) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-2xl border border-zinc-200/70 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      to={`/applications/${app.id}`}
                      className="font-semibold text-zinc-900 dark:text-white"
                    >
                      {app.company}
                    </Link>
                    <p className="text-sm text-zinc-500">{app.position}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
                  <span>{formatDate(toApiDateInput(app.applicationDate))}</span>
                  {app.jobUrl ? (
                    <a
                      href={app.jobUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-violet-700 dark:text-violet-300"
                    >
                      Offre <ExternalLink className="size-3" />
                    </a>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </div>

          {pagination ? (
            <Pagination pagination={pagination} onPageChange={setPage} />
          ) : null}
        </>
      )}

      <ApplicationFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
        submitting={submitting}
      />

      {menuId ? (
        <button
          type="button"
          className="fixed inset-0 z-[5]"
          aria-label="Fermer le menu"
          onClick={() => setMenuId(null)}
        />
      ) : null}
    </div>
  )
}
