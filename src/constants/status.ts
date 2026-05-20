import type { ApplicationStatus, ContractType } from '@/types/application'

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'À envoyer',
  'Envoyée',
  'Entretien',
  'Refusée',
  'Acceptée',
]

export const CONTRACT_TYPES: ContractType[] = [
  'CDI',
  'CDD',
  'Freelance',
  'Stage',
  'Alternance',
]

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  'À envoyer': 'À envoyer',
  Envoyée: 'Envoyée',
  Entretien: 'Entretien',
  Refusée: 'Refusée',
  Acceptée: 'Acceptée',
}

export const STATUS_BADGE_CLASS: Record<ApplicationStatus, string> = {
  'À envoyer':
    'border-zinc-200/80 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-200',
  Envoyée:
    'border-sky-200/80 bg-sky-50 text-sky-800 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-100',
  Entretien:
    'border-amber-200/80 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100',
  Refusée:
    'border-rose-200/80 bg-rose-50 text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100',
  Acceptée:
    'border-emerald-200/80 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100',
}
