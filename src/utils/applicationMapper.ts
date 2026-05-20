import { APPLICATION_STATUSES } from '@/constants/status'
import type { Application, ApplicationApi, ApplicationStatus } from '@/types/application'
import type { ApplicationFormValues } from '@/components/ApplicationFormModal'

export type { ApplicationApi }

export function mapApplication(doc: ApplicationApi): Application {
  return {
    id: doc._id,
    company: doc.company,
    position: doc.position,
    status: doc.status,
    contractType: doc.contractType,
    applicationDate: doc.applicationDate,
    jobUrl: doc.jobUrl ?? '',
    notes: doc.notes ?? '',
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

export function toApiDateInput(isoOrDate: string): string {
  const d = new Date(isoOrDate)
  if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 10)
  return d.toISOString().slice(0, 10)
}

export function mapApplicationToApi(values: ApplicationFormValues) {
  return {
    company: values.company.trim(),
    position: values.position.trim(),
    status: values.status,
    contractType: values.contractType,
    applicationDate: values.applicationDate
      ? new Date(values.applicationDate).toISOString()
      : new Date().toISOString(),
    jobUrl: values.jobUrl?.trim() ?? '',
    notes: values.notes?.trim() ?? '',
  }
}

export function mapStatsByStatus(
  byStatus: Record<string, number> = {},
): Record<ApplicationStatus, number> {
  const counts = {} as Record<ApplicationStatus, number>
  for (const s of APPLICATION_STATUSES) {
    counts[s] = byStatus[s] ?? 0
  }
  return counts
}
