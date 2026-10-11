export type AccountRole = 'super_admin' | 'admin'
export type AccountStatus = 'pending' | 'approved' | 'rejected'

export interface User {
  id: string; firstName: string; middleName: string; lastName: string; suffix: string; position: string
  office: string; province: string; municipality: string; designated: string; designation: string
  email: string; username: string; role: AccountRole; status: AccountStatus; hasPhoto: boolean; mustChangePassword: boolean
}
export interface Registrant extends User { fullName: string; initialPassword: string | null; createdAt: string }
const apiBase = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) { super(message); this.name = 'ApiError'; this.status = status }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  const formData = options.body instanceof FormData
  if (options.body && !formData) headers.set('Content-Type', 'application/json')
  const token = localStorage.getItem('agristat-session')
  if (token) headers.set('Authorization', `Bearer ${token}`)
  const response = await fetch(`${apiBase}${path}`, { ...options, headers })
  const payload = await response.json().catch(() => ({})) as { error?: string }
  if (!response.ok) throw new ApiError(payload.error || `Request failed (${response.status}).`, response.status)
  return payload as T
}

export const api = {
  get<T>(path: string) { return request<T>(path) },
  post<T = void>(path: string, body?: unknown) { return request<T>(path, { method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body ?? {}) }) },
  patch<T = void>(path: string, body: unknown) { return request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }) },
  async photo(path: string) {
    const token = localStorage.getItem('agristat-session')
    const response = await fetch(`${apiBase}${path}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
    if (!response.ok) throw new ApiError('Could not load profile photo.', response.status)
    return URL.createObjectURL(await response.blob())
  },
}