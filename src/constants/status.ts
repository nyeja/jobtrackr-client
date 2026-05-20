import type { ApplicationStatus, ContractType } from '@/types/application'

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  to_send: 'À envoyer',
  sent: 'Envoyée',
  interview: 'Entretien',
  rejected: 'Refusée',
  accepted: 'Acceptée',
}

export const CONTRACT_LABELS: Record<ContractType, string> = {
  cdi: 'CDI',
  cdd: 'CDD',
  freelance: 'Freelance',
  stage: 'Stage',
  alternance: 'Alternance',
}
