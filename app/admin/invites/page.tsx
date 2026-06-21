'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { api } from '@/lib/api'
import type { CreateInviteDto, AcceptInviteDto } from '@/lib/types'
import { Plus, Copy, CheckCircle2, UserPlus, XCircle } from 'lucide-react'

export default function InvitesPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [createInviteDialogOpen, setCreateInviteDialogOpen] = useState(false)
  const [createInviteError, setCreateInviteError] = useState<string | null>(null)
  const [acceptInviteDialogOpen, setAcceptInviteDialogOpen] = useState(false)
  const [inviteFormData, setInviteFormData] = useState<CreateInviteDto>({
    rg: '',
  })
  const [acceptFormData, setAcceptFormData] = useState<AcceptInviteDto>({
    token: '',
    name: '',
    rg: '',
    phone: '',
    profile: 'LINHA',
  })

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 2) return numbers ? `(${numbers}` : ''
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)})${numbers.slice(2)}`
    return `(${numbers.slice(0, 2)})${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }

  const formatRG = (value: string): string => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`
    if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}-${numbers.slice(8, 9)}`
  }
  const [copiedToken, setCopiedToken] = useState<string | null>(null)
  const [inviteToken, setInviteToken] = useState<string | null>(null)
  const [inviteExpiresAt, setInviteExpiresAt] = useState<Date | null>(null)

  const handleCreateInvite = async () => {
    if (!inviteFormData.rg.trim()) {
      setCreateInviteError('Por favor, informe seu RG para gerar o convite.')
      return
    }

    try {
      setCreateInviteError(null)
      setSuccess(null)
      // Remove formatação do RG antes de enviar (mantém apenas números)
      const rgWithoutFormatting = inviteFormData.rg.replace(/\D/g, '')
      const invite = await api.createInvite({ rg: rgWithoutFormatting })
      setInviteToken(invite.token)
      setInviteExpiresAt(new Date(invite.expiresAt))
      setInviteFormData({ rg: '' })
      setCreateInviteError(null)
      setSuccess('Convite criado com sucesso!')
    } catch (err) {
      setCreateInviteError(err instanceof Error ? err.message : 'Erro ao criar convite')
    }
  }

  const handleAcceptInvite = async () => {
    if (!acceptFormData.name.trim() || !acceptFormData.rg.trim() || !acceptFormData.phone.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    if (!/^\(\d{2}\)\d{5}-\d{4}$/.test(acceptFormData.phone)) {
      setError('Por favor, insira um telefone válido no formato (99)99999-9999.')
      return
    }

    try {
      setError(null)
      setSuccess(null)
      await api.acceptInvite(acceptFormData)
      setAcceptInviteDialogOpen(false)
      setAcceptFormData({ token: '', name: '', rg: '', phone: '', profile: 'LINHA' })
      setSuccess('Convite aceito com sucesso!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao aceitar convite')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedToken(text)
    setTimeout(() => setCopiedToken(null), 2000)
  }

  const formatExpirationDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:py-10">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Convites</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Gerencie convites para jogadores. Janela de convites: Terça-feira 00:00 até Quinta-feira 14:00.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-destructive/15 p-3 sm:p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-md bg-green-500/15 p-3 sm:p-4 text-sm text-green-600">
          {success}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Criar Convite */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Criar Convite
            </CardTitle>
            <CardDescription>
              Jogadores titulares podem criar convites informando apenas o RG
            </CardDescription>
          </CardHeader>
          <CardContent>
                    <Dialog
              open={createInviteDialogOpen}
              onOpenChange={(open) => {
                setCreateInviteDialogOpen(open)
                if (!open) {
                  // Limpa erros e estados quando o modal é fechado
                  setCreateInviteError(null)
                  setInviteToken(null)
                  setInviteExpiresAt(null)
                  setInviteFormData({ rg: '' })
                }
              }}
                    >
                      <DialogTrigger asChild>
                <Button className="w-full">
                          <Plus className="mr-2 h-4 w-4" />
                  Criar Novo Convite
                        </Button>
                      </DialogTrigger>
              <DialogContent className="max-w-md mx-4">
                        <DialogHeader>
                          <DialogTitle>Criar Convite</DialogTitle>
                          <DialogDescription>
                    Informe seu RG para gerar um link de convite. O convite será válido por 48
                    horas ou até o fim da janela de convites (Quinta-feira às 14:00).
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                  {createInviteError && (
                    <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive flex items-center gap-2">
                      <XCircle className="h-4 w-4 shrink-0" />
                      <span>{createInviteError}</span>
                    </div>
                  )}
                          <div className="grid gap-2">
                    <Label htmlFor="rg">Informe o seu RG</Label>
                            <Input
                      id="rg"
                      value={inviteFormData.rg}
                      onChange={(e) => {
                        const formatted = formatRG(e.target.value)
                                setInviteFormData({
                                  ...inviteFormData,
                          rg: formatted,
                                })
                        // Limpa erro quando o usuário começa a digitar
                        if (createInviteError) {
                          setCreateInviteError(null)
                              }
                      }}
                      placeholder="12.345.678-9"
                      maxLength={12}
                            />
                          </div>
                        </div>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                          <Button
                            variant="outline"
                    onClick={() => {
                      setCreateInviteDialogOpen(false)
                      setInviteToken(null)
                      setInviteExpiresAt(null)
                      setCreateInviteError(null)
                      setInviteFormData({ rg: '' })
                    }}
                    className="w-full sm:w-auto"
                          >
                            Cancelar
                          </Button>
                          <Button
                    onClick={handleCreateInvite}
                    disabled={!inviteFormData.rg.trim()}
                    className="w-full sm:w-auto"
                          >
                    Criar Convite
                          </Button>
                        </DialogFooter>
                        {inviteToken && (
                  <div className="mt-4 rounded-md border bg-muted/30 p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <p className="text-sm font-medium">Convite criado com sucesso!</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Token do Convite</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                value={inviteToken}
                                readOnly
                          className="font-mono text-xs bg-background"
                              />
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => copyToClipboard(inviteToken)}
                          className="shrink-0"
                              >
                                {copiedToken === inviteToken ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                    </div>
                    {inviteExpiresAt && (
                      <p className="text-xs text-muted-foreground">
                        Válido até: {formatExpirationDate(inviteExpiresAt)}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                              Compartilhe este token com o jogador convidado
                            </p>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
          </CardContent>
        </Card>

        {/* Aceitar Convite */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Aceitar Convite
            </CardTitle>
            <CardDescription>
              Use o token recebido para aceitar um convite
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={acceptInviteDialogOpen} onOpenChange={setAcceptInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Aceitar Convite
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Aceitar Convite</DialogTitle>
                  <DialogDescription>
                    Preencha os dados para aceitar o convite
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="token">Token do Convite</Label>
                    <Input
                      id="token"
                      value={acceptFormData.token}
                      onChange={(e) =>
                        setAcceptFormData({
                          ...acceptFormData,
                          token: e.target.value,
                        })
                      }
                      placeholder="uuid-do-convite"
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="acceptName">Nome Completo</Label>
                    <Input
                      id="acceptName"
                      value={acceptFormData.name}
                      onChange={(e) =>
                        setAcceptFormData({
                          ...acceptFormData,
                          name: e.target.value,
                        })
                      }
                      placeholder="Italo Rayone"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="acceptRg">RG</Label>
                    <Input
                      id="acceptRg"
                      value={acceptFormData.rg}
                      onChange={(e) =>
                        setAcceptFormData({
                          ...acceptFormData,
                          rg: e.target.value,
                        })
                      }
                      placeholder="12.345.678-9"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="acceptPhone">Telefone Celular</Label>
                    <Input
                      id="acceptPhone"
                      value={acceptFormData.phone}
                      onChange={(e) => {
                        const formatted = formatPhone(e.target.value)
                        setAcceptFormData({
                          ...acceptFormData,
                          phone: formatted,
                        })
                      }}
                      placeholder="(11)98765-4321"
                      maxLength={14}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="acceptProfile">Perfil</Label>
                    <Select
                      value={acceptFormData.profile}
                      onValueChange={(value: 'LINHA' | 'GOLEIRO' | 'RESENHA') =>
                        setAcceptFormData({
                          ...acceptFormData,
                          profile: value,
                        })
                      }
                    >
                      <SelectTrigger id="acceptProfile">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LINHA">Linha</SelectItem>
                        <SelectItem value="GOLEIRO">Goleiro</SelectItem>
                        <SelectItem value="RESENHA">Resenha</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setAcceptInviteDialogOpen(false)}
                    className="w-full sm:w-auto"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleAcceptInvite}
                    disabled={
                      !acceptFormData.name.trim() ||
                      !acceptFormData.rg.trim() ||
                      !acceptFormData.phone.trim() ||
                      !acceptFormData.token.trim()
                    }
                    className="w-full sm:w-auto"
                  >
                    Aceitar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
