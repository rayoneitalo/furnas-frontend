export interface ListState {
  id: number
  listOpenTimestamp: string
  listResetCount: number
}

export interface Player {
  id: string
  userId: string
  name: string
  rg: string
  phone: string
  profile: 'LINHA' | 'GOLEIRO' | 'RESENHA'
  status: 'MAIN' | 'WAITLIST'
  joinTimestamp: string
  isGuest: boolean
  invitedByPlayerId?: string | null
  invitedBy?: {
    name: string
    userId: string
  }
}

export interface Invite {
  id: string
  token: string
  invitedByPlayerId?: string | null
  invitedByUserId: string
  status: 'PENDING' | 'USED' | 'EXPIRED'
  createdAt: string
  expiresAt: string
  usedAt?: string | null
  acceptedPlayerId?: string | null
}

export interface CreatePlayerDto {
  name: string
  rg: string
  phone: string
  profile: 'LINHA' | 'GOLEIRO' | 'RESENHA'
}

export interface RemovePlayerDto {
  rg: string
}

export interface CreateInviteDto {
  rg: string
}

export interface AcceptInviteDto {
  token: string
  name: string
  rg: string
  phone: string
  profile: 'LINHA' | 'GOLEIRO' | 'RESENHA'
}

export type ExportResponse = string

