import { useEffect, useState, type FormEvent } from 'react'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Modal } from '@/components/Modal'
import { APPLICATION_STATUSES, CONTRACT_TYPES } from '@/constants/status'
import type { Application, ApplicationStatus, ContractType } from '@/types/application'

export type ApplicationFormValues = {
  company: string
  position: string
  contractType: ContractType
  applicationDate: string
  jobUrl: string
  status: ApplicationStatus
  notes: string
}

const emptyForm = (): ApplicationFormValues => ({
  company: '',
  position: '',
  contractType: 'CDI',
  applicationDate: new Date().toISOString().slice(0, 10),
  jobUrl: '',
  status: 'À envoyer',
  notes: '',
})

function fromApplication(app: Application): ApplicationFormValues {
  const date = app.applicationDate
    ? new Date(app.applicationDate).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10)
  return {
    company: app.company,
    position: app.position,
    contractType: app.contractType,
    applicationDate: date,
    jobUrl: app.jobUrl ?? '',
    status: app.status,
    notes: app.notes ?? '',
  }
}

const selectClass =
  'h-11 w-full rounded-xl border border-zinc-200/80 bg-white px-3.5 text-sm shadow-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-violet-500 dark:focus:ring-violet-500/20'

const labelClass = 'block text-sm font-medium text-zinc-700 dark:text-zinc-200'

export function ApplicationFormModal({
  open,
  onClose,
  initial,
  onSubmit,
  submitting,
}: {
  open: boolean
  onClose: () => void
  initial?: Application
  onSubmit: (values: ApplicationFormValues) => Promise<void>
  submitting?: boolean
}) {
  const [form, setForm] = useState<ApplicationFormValues>(emptyForm)
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})

  useEffect(() => {
    if (!open) return
    setForm(initial ? fromApplication(initial) : emptyForm())
    setErrors({})
  }, [open, initial])

  const validate = () => {
    const next: Partial<Record<string, string>> = {}
    if (!form.company.trim()) next.company = 'Entreprise requise'
    if (!form.position.trim()) next.position = 'Poste requis'
    if (!form.applicationDate) next.applicationDate = 'Date requise'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    try {
      await onSubmit(form)
      onClose()
    } catch {
      /* parent handles toast */
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Modifier la candidature' : 'Nouvelle candidature'}
      description="Enregistrement via l’API MongoDB."
      className="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Entreprise"
            value={form.company}
            onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
            error={errors.company}
          />
          <Input
            label="Poste"
            value={form.position}
            onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
            error={errors.position}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className={labelClass}>Type de contrat</label>
            <select
              className={selectClass}
              value={form.contractType}
              onChange={(e) =>
                setForm((f) => ({ ...f, contractType: e.target.value as ContractType }))
              }
            >
              {CONTRACT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Date"
            type="date"
            value={form.applicationDate}
            onChange={(e) => setForm((f) => ({ ...f, applicationDate: e.target.value }))}
            error={errors.applicationDate}
          />
        </div>
        <Input
          label="Lien offre"
          type="url"
          value={form.jobUrl}
          onChange={(e) => setForm((f) => ({ ...f, jobUrl: e.target.value }))}
        />
        <div className="space-y-1.5">
          <label className={labelClass}>Statut</label>
          <select
            className={selectClass}
            value={form.status}
            onChange={(e) =>
              setForm((f) => ({ ...f, status: e.target.value as ApplicationStatus }))
            }
          >
            {APPLICATION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className={labelClass}>Notes</label>
          <textarea
            rows={4}
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            className="w-full resize-none rounded-xl border border-zinc-200/80 bg-white px-3.5 py-3 text-sm shadow-sm outline-none dark:border-zinc-800 dark:bg-zinc-950"
          />
        </div>
        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
            Annuler
          </Button>
          <Button type="submit" loading={submitting}>
            Enregistrer
          </Button>
        </div>
      </form>
    </Modal>
  )
}
