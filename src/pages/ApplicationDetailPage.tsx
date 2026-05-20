import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  ApplicationFormModal,
  type ApplicationFormValues,
} from '@/components/ApplicationFormModal'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { EmptyState } from '@/components/EmptyState'
import { StatusBadge } from '@/components/Badge'
import { CONTRACT_LABELS } from '@/constants/status'
import { useApplications } from '@/context/ApplicationsContext'
import { usePageMeta } from '@/hooks/usePageMeta'
import { formatDate, formatDateTime } from '@/utils/format'

export function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getById, updateApplication, deleteApplication } = useApplications()
  const app = getById(id)
  const [editOpen, setEditOpen] = useState(false)

  usePageMeta(
    app ? app.company : 'Candidature',
    app ? app.role : 'Détail introuvable',
  )

  if (!app) {
    return (
      <EmptyState
        icon={ArrowLeft}
        title="Candidature introuvable"
        description="Cette candidature n’existe plus ou a été supprimée."
        action={
          <Button variant="secondary" onClick={() => navigate('/applications')}>
            Retour aux candidatures
          </Button>
        }
      />
    )
  }

  const handleUpdate = (values: ApplicationFormValues) => {
    updateApplication(app.id, values)
    toast.success('Candidature mise à jour')
  }

  const handleDelete = () => {
    deleteApplication(app.id)
    toast.success('Candidature supprimée')
    navigate('/applications')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to="/applications"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Retour
        </Link>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setEditOpen(true)}>
            <Pencil className="size-4" />
            Modifier
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <Trash2 className="size-4" />
            Supprimer
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
            {app.company}
          </h2>
          <p className="mt-1 text-zinc-500 dark:text-zinc-400">{app.role}</p>
        </div>
        <StatusBadge status={app.status} className="self-start sm:self-auto" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Informations</h3>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">Contrat</dt>
              <dd className="mt-1 text-sm text-zinc-800 dark:text-zinc-200">
                {CONTRACT_LABELS[app.contractType]}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">Date</dt>
              <dd className="mt-1 text-sm text-zinc-800 dark:text-zinc-200">
                {formatDate(app.appliedAt)}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Lien offre
              </dt>
              <dd className="mt-1">
                {app.offerUrl ? (
                  <a
                    href={app.offerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-violet-700 hover:underline dark:text-violet-300"
                  >
                    Ouvrir l’offre <ExternalLink className="size-3.5" />
                  </a>
                ) : (
                  <span className="text-sm text-zinc-400">Non renseigné</span>
                )}
              </dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Notes</h3>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            {app.notes || 'Aucune note pour le moment.'}
          </p>
        </Card>
      </div>

      <Card>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Historique</h3>
        <ul className="mt-4 space-y-4">
          {app.history.map((entry, i) => (
            <li key={entry.id} className="relative flex gap-4 pl-6">
              <span
                className="absolute left-0 top-1.5 size-2 rounded-full bg-violet-500 ring-4 ring-violet-100 dark:ring-violet-500/20"
                aria-hidden
              />
              {i < app.history.length - 1 ? (
                <span
                  className="absolute left-[3px] top-4 h-[calc(100%+8px)] w-px bg-zinc-200 dark:bg-zinc-800"
                  aria-hidden
                />
              ) : null}
              <div>
                <p className="text-sm text-zinc-800 dark:text-zinc-200">{entry.message}</p>
                <p className="mt-0.5 text-xs text-zinc-400">{formatDateTime(entry.date)}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <ApplicationFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initial={app}
        onSubmit={handleUpdate}
      />
    </motion.div>
  )
}
