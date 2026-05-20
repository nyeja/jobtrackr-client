import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { ApplicationFormModal } from '@/components/ApplicationFormModal'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { EmptyState } from '@/components/EmptyState'
import { Loader } from '@/components/Loader'
import { StatusBadge } from '@/components/Badge'
import { useApplications } from '@/context/ApplicationsContext'
import { getApiErrorMessage } from '@/lib/api'
import { usePageMeta } from '@/hooks/usePageMeta'
import type { Application } from '@/types/application'
import { formatDate, formatDateTime } from '@/utils/format'

export function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getById, fetchById, updateApplication, deleteApplication } = useApplications()
  const [app, setApp] = useState<Application | undefined>(getById(id))
  const [loading, setLoading] = useState(!getById(id))
  const [editOpen, setEditOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  usePageMeta(app?.company ?? 'Candidature', app?.position)

  useEffect(() => {
    if (!id) return
    const c = getById(id)
    if (c) {
      setApp(c)
      setLoading(false)
      return
    }
    setLoading(true)
    void fetchById(id)
      .then(setApp)
      .catch((e) => toast.error(getApiErrorMessage(e)))
      .finally(() => setLoading(false))
  }, [id, getById, fetchById])

  if (loading) return <Loader label="Chargement…" />
  if (!app) {
    return (
      <EmptyState
        icon={ArrowLeft}
        title="Introuvable"
        action={<Button onClick={() => navigate('/applications')}>Retour</Button>}
      />
    )
  }

  return (
    <motion.div className="space-y-6">
      <div className="flex justify-between">
        <Link to="/applications" className="text-sm text-zinc-500">
          <ArrowLeft className="inline size-4" /> Retour
        </Link>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setEditOpen(true)}>
            <Pencil className="size-4" /> Modifier
          </Button>
          <Button
            variant="danger"
            onClick={async () => {
              await deleteApplication(app.id)
              toast.success('Supprimée')
              navigate('/applications')
            }}
          >
            <Trash2 className="size-4" /> Supprimer
          </Button>
        </div>
      </div>
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{app.company}</h2>
          <p className="text-zinc-500">{app.position}</p>
        </div>
        <StatusBadge status={app.status} />
      </div>
      <Card>
        <p className="text-sm">
          Date : {formatDate(app.applicationDate)} · {app.contractType}
        </p>
        {app.jobUrl ? (
          <a href={app.jobUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-violet-700">
            Offre <ExternalLink className="size-3.5" />
          </a>
        ) : null}
        <p className="mt-4 text-sm">{app.notes || 'Sans notes'}</p>
      </Card>
      <Card>
        <h3 className="font-semibold">Historique</h3>
        <ul className="mt-4 space-y-3">
          <li>
            <p className="text-sm">Candidature créée</p>
            <p className="text-xs text-zinc-400">
              {formatDateTime(app.createdAt ?? app.applicationDate)}
            </p>
          </li>
          {app.updatedAt && app.updatedAt !== app.createdAt ? (
            <li>
              <p className="text-sm">Dernière mise à jour</p>
              <p className="text-xs text-zinc-400">{formatDateTime(app.updatedAt)}</p>
            </li>
          ) : null}
        </ul>
      </Card>
      <ApplicationFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initial={app}
        onSubmit={async (v) => {
          setSubmitting(true)
          try {
            setApp(await updateApplication(app.id, v))
            toast.success('Mis à jour')
          } catch (e) {
            toast.error(getApiErrorMessage(e))
            throw e
          } finally {
            setSubmitting(false)
          }
        }}
        submitting={submitting}
      />
    </motion.div>
  )
}
