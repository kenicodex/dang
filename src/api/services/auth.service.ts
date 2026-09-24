import type { ApiClientInterface } from '@/api/client'
import { apiClient } from '@/api/client'
import type {
  AppleOAuthRequest,
  AuthSessionInfo,
  AuthTokenResponse,
  ChangePasswordInput,
  EmailChangeConfirmInput,
  EmailChangeRequestInput,
  EmailVerifyInput,
  EmailVerifyResponse,
  GoogleOAuthRequest,
  LoginRequest,
  LogoutRequest,
  OtpSendRequest,
  OtpVerifyRequest,
  PasswordResetInput,
  PasswordResetRequestInput,
  PasswordResetRequestResponse,
  PasswordResetResponse,
  PhoneChangeSendOtpInput,
  PhoneChangeVerifyInput,
  RefreshTokenRequest,
  RegisterRequest,
} from '@/types/auth'

export interface AuthService {
  register: (input: RegisterRequest) => Promise<AuthTokenResponse>
  login: (input: LoginRequest) => Promise<AuthTokenResponse>
  loginWithGoogle: (input: GoogleOAuthRequest) => Promise<AuthTokenResponse>
  loginWithApple: (input: AppleOAuthRequest) => Promise<AuthTokenResponse>
  refreshToken: (input: RefreshTokenRequest) => Promise<AuthTokenResponse>
  sendOtp: (input: OtpSendRequest) => Promise<void>
  verifyOtp: (input: OtpVerifyRequest) => Promise<AuthTokenResponse>
  logout: (input: LogoutRequest) => Promise<void>
  requestPasswordReset: (input: PasswordResetRequestInput) => Promise<PasswordResetRequestResponse>
  resetPassword: (input: PasswordResetInput) => Promise<PasswordResetResponse>
  changePassword: (input: ChangePasswordInput) => Promise<void>
  verifyEmail: (input: EmailVerifyInput) => Promise<EmailVerifyResponse>
  requestEmailChange: (input: EmailChangeRequestInput) => Promise<void>
  confirmEmailChange: (input: EmailChangeConfirmInput) => Promise<void>
  requestPhoneChange: (input: PhoneChangeSendOtpInput) => Promise<void>
  confirmPhoneChange: (input: PhoneChangeVerifyInput) => Promise<void>
  listSessions: () => Promise<AuthSessionInfo[]>
  revokeSession: (id: string) => Promise<void>
  revokeOtherSessions: () => Promise<void>
}

export function createAuthService(client: ApiClientInterface = apiClient): AuthService {
  return {
    register: input => client.post('/auth/register', input, { auth: false }),
    login: input => client.post('/auth/login', input, { auth: false }),
    loginWithGoogle: input => client.post('/auth/oauth/google', input, { auth: false }),
    loginWithApple: input => client.post('/auth/oauth/apple', input, { auth: false }),
    refreshToken: input => client.post('/auth/token/refresh', input, { auth: false }),
    sendOtp: input => client.post('/auth/otp/send', input, { auth: false }),
    verifyOtp: input => client.post('/auth/otp/verify', input, { auth: false }),
    logout: input => client.post('/auth/logout', input),
    requestPasswordReset: input => client.post('/auth/password/reset-request', input, { auth: false }),
    resetPassword: input => client.post('/auth/password/reset', input, { auth: false }),
    changePassword: input => client.patch('/auth/password', input),
    verifyEmail: input => client.post('/auth/email/verify', input, { auth: false }),
    requestEmailChange: input => client.post('/auth/email/change', input),
    confirmEmailChange: input => client.post('/auth/email/confirm-change', input, { auth: false }),
    requestPhoneChange: input => client.post('/auth/phone/change/send-otp', input),
    confirmPhoneChange: input => client.post('/auth/phone/change/verify-otp', input),
    listSessions: () => client.get('/auth/sessions'),
    revokeSession: id => client.delete(`/auth/sessions/${id}`),
    revokeOtherSessions: () => client.post('/auth/sessions/revoke-others'),
  }
}

export const authApi: AuthService = createAuthService()
