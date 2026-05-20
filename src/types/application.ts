export type ApplicationStatus =
  | 'to_send'
  | 'sent'
  | 'interview'
  | 'rejected'
  | 'accepted'

export type ContractType = 'cdi' | 'cdd' | 'freelance' | 'stage' | 'alternance'

export interface ApplicationHistoryEntry {
  id: string
  date: string
  message: string
}

export interface Application {
  id: string
  company: string
  role: string
  contractType: ContractType
  appliedAt: string
  offerUrl: string
  status: ApplicationStatus
  notes: string
  history: ApplicationHistoryEntry[]
}
