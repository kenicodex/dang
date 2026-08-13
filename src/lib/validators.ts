export interface ValidationResult {
  valid: boolean
  errors: Array<{ field: string; message: string }>
}

export function validateEmail(email: unknown): boolean {
  if (typeof email !== 'string') return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validateNigeriaPhone(phone: unknown): boolean {
  if (typeof phone !== 'string') return false
  const normalized = phone.replace(/\D/g, '')
  return /^(?:234[7-9]\d{9}|0[7-9]\d{9})$/.test(normalized)
}

export function validatePassword(password: unknown): ValidationResult {
  const errors: ValidationResult['errors'] = []
  if (typeof password !== 'string') {
    return { valid: false, errors: [{ field: 'password', message: 'Password must be a string' }] }
  }
  if (password.length < 8) {
    errors.push({ field: 'password', message: 'Password must be at least 8 characters' })
  }
  if (!/[A-Z]/.test(password)) {
    errors.push({ field: 'password', message: 'Password must contain an uppercase letter' })
  }
  if (!/[a-z]/.test(password)) {
    errors.push({ field: 'password', message: 'Password must contain a lowercase letter' })
  }
  if (!/\d/.test(password)) {
    errors.push({ field: 'password', message: 'Password must contain a digit' })
  }
  return { valid: errors.length === 0, errors }
}

export function validateDisplayName(name: unknown): ValidationResult {
  const errors: ValidationResult['errors'] = []
  if (typeof name !== 'string' || name.trim().length === 0) {
    errors.push({ field: 'displayName', message: 'Display name is required' })
  } else if (name.trim().length < 2) {
    errors.push({ field: 'displayName', message: 'Display name must be at least 2 characters' })
  } else if (name.trim().length > 50) {
    errors.push({ field: 'displayName', message: 'Display name must be under 50 characters' })
  }
  return { valid: errors.length === 0, errors }
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c] ?? c)
}
