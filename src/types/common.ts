export interface PaginationParams {
  limit?: number
  offset?: number
  cursor?: string
}

export interface Paginated<T> {
  items: T[]
  total: number
  limit: number
  offset: number
  hasMore: boolean
  nextCursor?: string
  prevCursor?: string
}

export interface Auditable {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface SortOption {
  field: string
  direction: 'asc' | 'desc'
}

export type ID = string
