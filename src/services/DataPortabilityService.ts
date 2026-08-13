import type { AuthContext } from '@/types/auth'

export type ExportFormat = 'json' | 'csv'
export type ExportScope =
  | 'profile'
  | 'posts'
  | 'threads'
  | 'messages'
  | 'engagement'
  | 'payments'
  | 'circles'
  | 'all'

export interface ExportManifest {
  exportId: string
  memberId: string
  formats: ExportFormat[]
  scopes: ExportScope[]
  createdAt: Date
  expiresAt: Date
  downloadUrls: Record<ExportFormat, string>
  recordCounts: Record<ExportScope, number>
  sizeBytes: number
}

export interface AdminExportJob {
  id: string
  requestedBy: string
  requestedForMemberId?: string
  formats: ExportFormat[]
  scope: 'single-member' | 'all-members' | 'engagement-report'
  status: 'queued' | 'processing' | 'ready' | 'failed'
  createdAt: Date
  completedAt?: Date
  downloadUrl?: string
  error?: string
  recordsProcessed?: number
}

export interface DataPortabilityServiceInterface {
  requestExport(
    auth: AuthContext,
    formats: ExportFormat[],
    scopes?: ExportScope[],
  ): Promise<{ exportId: string; etaMinutes: number }>
  getExportStatus(auth: AuthContext, exportId: string): Promise<{
    status: 'queued' | 'processing' | 'ready' | 'expired'
    progress: number
    manifest?: ExportManifest
  }>
  downloadExport(auth: AuthContext, exportId: string, format: ExportFormat): Promise<{ url: string }>
  listExports(auth: AuthContext): Promise<Array<{ id: string; createdAt: Date; scopes: ExportScope[]; status: string }>>
  requestErasure(auth: AuthContext, reason?: string): Promise<{ requestId: string; completesBy: Date }>
  getErasureStatus(auth: AuthContext, requestId: string): Promise<{
    status: 'pending-review' | 'processing' | 'complete'
    stages: Array<{ name: string; status: 'pending' | 'done'; recordsDeleted?: number }>
  }>
  adminListExportJobs(
    auth: AuthContext & { role: 'founder' | 'admin' },
  ): Promise<AdminExportJob[]>
  adminRequestBulkExport(
    auth: AuthContext & { role: 'founder' | 'admin' },
    formats: ExportFormat[],
    scope: AdminExportJob['scope'],
    memberIds?: string[],
  ): Promise<AdminExportJob>
  validateGDPRNDPRCompliance(): Promise<{
    jurisdictionChecks: Array<{ jurisdiction: 'GDPR' | 'NDPR'; checks: Array<{ name: string; passed: boolean; detail?: string }> }>
  }>
}

export const DataPortabilityService: DataPortabilityServiceInterface = {
  async requestExport(_auth, _formats, _scopes) {
    throw new Error('DataPortabilityService.requestExport not implemented — export must be self-serve (NFR-D01), not "contact support"')
  },
  async getExportStatus(_auth, _exportId) {
    throw new Error('DataPortabilityService.getExportStatus not implemented')
  },
  async downloadExport(_auth, _exportId, _format) {
    throw new Error('DataPortabilityService.downloadExport not implemented')
  },
  async listExports(_auth) {
    throw new Error('DataPortabilityService.listExports not implemented')
  },
  async requestErasure(_auth, _reason) {
    throw new Error('DataPortabilityService.requestErasure not implemented — right to erasure for both GDPR and NDPR (NFR-S04)')
  },
  async getErasureStatus(_auth, _requestId) {
    throw new Error('DataPortabilityService.getErasureStatus not implemented')
  },
  async adminListExportJobs(_auth) {
    throw new Error('DataPortabilityService.adminListExportJobs not implemented')
  },
  async adminRequestBulkExport(_auth, _formats, _scope, _memberIds) {
    throw new Error('DataPortabilityService.adminRequestBulkExport not implemented — founder must be able to export all member data at any time (NFR-D01)')
  },
  async validateGDPRNDPRCompliance() {
    throw new Error('DataPortabilityService.validateGDPRNDPRCompliance not implemented — dual-jurisdiction compliance is required')
  },
}
