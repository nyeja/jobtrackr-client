/** Aligné sur l’API MongoDB */

export type ApplicationStatus =
  | 'À envoyer'
  | 'Envoyée'
  | 'Entretien'
  | 'Refusée'
  | 'Acceptée'

export type ContractType = 'CDI' | 'CDD' | 'Freelance' | 'Stage' | 'Alternance'

export interface ApplicationApi {
  _id: string
  company: string
  position: string
  status: ApplicationStatus
  contractType: ContractType
  applicationDate: string
  jobUrl?: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export interface Application extends Omit<ApplicationApi, '_id'> {
  id: string
  jobUrl: string
  notes: string
}

export interface ApplicationStats {
  total: number
  interviews: number
  accepted: number
  rejected: number
  byStatus: Record<string, number>
}

export interface ApplicationPayload {
  company: string
  position: string
  status?: ApplicationStatus
  contractType?: ContractType
  applicationDate?: string
  jobUrl?: string
  notes?: string
}
