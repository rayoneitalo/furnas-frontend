import type {
  AcceptInviteDto,
  CreateInviteDto,
  CreatePlayerDto,
  ExportResponse,
  Invite,
  ListState,
  Player,
  RemovePlayerDto,
} from './types'
import { getAuthHeaders } from './auth'

// Para Server Components (Next.js SSR), use a URL interna do Docker ou localhost
// Para Client Components, use a URL pública
const getApiBaseUrl = (): string => {
  // Se estiver rodando no servidor (SSR), tenta usar a URL do Docker primeiro
  if (typeof window === 'undefined') {
    // Server-side: tenta usar o nome do serviço Docker ou fallback para localhost
    return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  }
  // Client-side: usa a URL pública
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
}

export async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const apiBaseUrl = getApiBaseUrl()
  const url = `${apiBaseUrl}${endpoint}`
  
  try {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `API Error: ${response.status} ${response.statusText} - ${errorText}`
    )
  }

  return response.json()
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        `Failed to connect to API at ${url}. Make sure the backend is running.`
      )
    }
    throw error
  }
}

export const api = {
  // List State
  getListState: () => fetchAPI<ListState | null>('/list-state'),
  resetList: () => fetchAPI<ListState>('/list-state/reset', { method: 'POST', headers: getAuthHeaders() }),

  // Players
  getPlayers: () => fetchAPI<Player[]>('/players'),
  createPlayer: (data: CreatePlayerDto) =>
    fetchAPI<Player>('/players', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  removePlayer: (id: string, data: RemovePlayerDto) =>
    fetchAPI<{ message: string }>(`/players/${id}`, {
      method: 'DELETE',
      body: JSON.stringify(data),
      headers: getAuthHeaders(),
    }),
  exportList: () => fetchAPI<ExportResponse>('/players/export'),

  // Invites
  getInviteWindow: () => fetchAPI<{ open: boolean; windowEnd: string | null }>('/invites/window'),
  createInvite: (data: CreateInviteDto) =>
    fetchAPI<Invite>('/invites/create', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: getAuthHeaders(),
    }),
  acceptInvite: (data: AcceptInviteDto) =>
    fetchAPI<Player>('/invites/accept', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

