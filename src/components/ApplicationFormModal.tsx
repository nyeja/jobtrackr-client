import { useEffect, useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Modal } from '@/components/Modal'
import { STATUS_LABELS, CONTRACT_LABELS } from '@/constants/status'
import type { Application, ApplicationStatus, ContractType } from '@/types/application'

export type ApplicationFormValues = {
  company: string
  role: string
  contractType: ContractType
  appliedAt: string
  offerUrl: string
  status: ApplicationStatus
  notes: string
}

const emptyForm = (): ApplicationFormValues => ({
  company: '',
  role: '',
  contractType: 'cdi',
  appliedAt: new Date().toISOString().slice(0, 10),
  offerUrl: '',
  status: 'to_send',
  notes: '',
})

function fromApplication(app: Application): ApplicationFormValues {
  return {
    company: app.company,
    role: app.role,
    contractType: app.contractType,
    appliedAt: app.appliedAt,
    offerUrl: app.offerUrl,
    status: app.status,
    notes: app.notes,
  }
}

const selectClass =
  'h-11 w-full rounded-xl border border-zinc-200/80 bg-white px-3.5 text-sm text-zinc-900 shadow-sm outline-none transition-[border-color,box-shadow] focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-violet-500 dark:focus:ring-violet-500/20'

const labelClass = 'block text-sm font-medium text-zinc-700 dark:text-zinc-200'

export function ApplicationFormModal({
  open,
  onClose,
  initial,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  initial?: Application
  onSubmit: (values: ApplicationFormValues) => void
}) {
  const [form, setForm] = useState<ApplicationFormValues>(emptyForm)
  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationFormValues, string>>>({})

  useEffect(() => {
    if (!open) return
    setForm(initial ? fromApplication(initial) : emptyForm())
    setErrors({})
  }, [open, initial])

  const validate = () => {
    const next: Partial<Record<keyof ApplicationFormValues, string>> = {}
    if (!form.company.trim()) next.company = 'Entreprise requise'
    if (!form.role.trim()) next.role = 'Poste requis'
    if (!form.appliedAt) next.appliedAt = 'Date requise'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      toast.error('Veuillez corriger les champs du formulaire')
      return
    }
    onSubmit(form)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Modifier la candidature' : 'Nouvelle candidature'}
      description="Ajoutez les informations clés pour suivre cette opportunité."
      className="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Entreprise"
            value={form.company}
            onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
            error={errors.company}
            placeholder="Ex. Linear"
          />
          <Input
            label="Poste"
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            error={errors.role}
            placeholder="Ex. Product Designer"
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
              {Object.entries(CONTRACT_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Date de candidature"
            type="date"
            value={form.appliedAt}
            onChange={(e) => setForm((f) => ({ ...f, appliedAt: e.target.value }))}
            error={errors.appliedAt}
          />
        </div>

        <Input
          label="Lien de l’offre"
          type="url"
          value={form.offerUrl}
          onChange={(e) => setForm((f) => ({ ...f, offerUrl: e.target.value }))}
          placeholder="https://…"
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
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
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
            placeholder="Préparation entretien, contacts, rappels…"
            className="w-full resize-none rounded-xl border border-zinc-200/80 bg-white px-3.5 py-3 text-sm text-zinc-900 shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-zinc-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-violet-500 dark:focus:ring-violet-500/20"
          />
        </div>

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit">Enregistrer</Button>
        </div>
      </form>
    </Modal>
  )
}
