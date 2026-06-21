'use client'

import { useEffect, useState } from 'react'
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

export default function ConvitesPage() {
  const [inviteWindowOpen, setInviteWindowOpen] = useState<boolean | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [acceptError, setAcceptError] = useState<string | null>(null)
  const [acceptSuccess, setAcceptSuccess] = useState(false)
  const [inviteToken, setInviteToken] = useState<string | null>(null)
  const [inviteExpiresAt, setInviteExpiresAt] = useState<Date | null>(null)
  const [copiedToken, setCopiedToken] = useState(false)

  const [createForm, setCreateForm] = useState<CreateInviteDto>({ rg: '' })
  const [acceptForm, setAcceptForm] = useState<AcceptInviteDto>({
    token: '',
    name: '',
    rg: '',
    phone: '',
    profile: 'LINHA',
  })

  useEffect(() => {
    api.getInviteWindow()
      .then(({ open }) => setInviteWindowOpen(open))
      .catch(() => setInviteWindowOpen(false))
  }, [])

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

  const handleCreate = async () => {
    if (!createForm.rg.trim()) {
      setCreateError('Informe seu RG.')
      return
    }
    try {
      setCreateError(null)
      const rg = createForm.rg.replace(/\D/g, '')
      const invite = await api.createInvite({ rg })
      setInviteToken(invite.token)
      setInviteExpiresAt(new Date(invite.expiresAt))
      setCreateForm({ rg: '' })
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Erro ao criar convite.')
    }
  }

  const handleAccept = async () => {
    if (!acceptForm.name.trim() || !acceptForm.rg.trim() || !acceptForm.phone.trim() || !acceptForm.token.trim()) {
      setAcceptError('Preencha todos os campos.')
      return
    }
    if (!/^\(\d{2}\)\d{5}-\d{4}$/.test(acceptForm.phone)) {
      setAcceptError('Telefone inválido. Use o formato (99)99999-9999.')
      return
    }
    try {
      setAcceptError(null)
      await api.acceptInvite(acceptForm)
      setAcceptSuccess(true)
      setAcceptForm({ token: '', name: '', rg: '', phone: '', profile: 'LINHA' })
    } catch (err) {
      setAcceptError(err instanceof Error ? err.message : 'Erro ao aceitar convite.')
    }
  }

  const copyToken = () => {
    if (!inviteToken) return
    navigator.clipboard.writeText(inviteToken)
    setCopiedToken(true)
    setTimeout(() => setCopiedToken(false), 2000)
  }

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(date)

  const windowClosed = inviteWindowOpen === false

  return (
    <div className="container mx-auto py-6 px-4 sm:py-10 max-w-3xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Convites</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Jogadores titulares podem gerar convites durante a janela semanal: Terça 00:00 – Quinta 14:00.{' '}
          {inviteWindowOpen !== null && (
            <span className={inviteWindowOpen ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
              ({inviteWindowOpen ? 'Aberta agora' : 'Fechada'})
            </span>
          )}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Criar convite */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Criar Convite
            </CardTitle>
            <CardDescription>
              Informe seu RG para gerar um link de convite para um amigo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog
              open={createDialogOpen}
              onOpenChange={(open) => {
                setCreateDialogOpen(open)
                if (!open) {
                  setCreateError(null)
                  setInviteToken(null)
                  setInviteExpiresAt(null)
                  setCreateForm({ rg: '' })
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="w-full" disabled={windowClosed}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Convite
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md mx-4">
                <DialogHeader>
                  <DialogTitle>Criar Convite</DialogTitle>
                  <DialogDescription>
                    Informe seu RG para confirmar que você é um titular e gerar o convite.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {createError && (
                    <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive flex items-center gap-2">
                      <XCircle className="h-4 w-4 shrink-0" />
                      {createError}
                    </div>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="rg">Seu RG</Label>
                    <Input
                      id="rg"
                      value={createForm.rg}
                      onChange={(e) => {
                        setCreateForm({ rg: formatRG(e.target.value) })
                        setCreateError(null)
                      }}
                      placeholder="12.345.678-9"
                      maxLength={12}
                    />
                  </div>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <Button variant="outline" onClick={() => setCreateDialogOpen(false)} className="w-full sm:w-auto">
                    Cancelar
                  </Button>
                  <Button onClick={handleCreate} disabled={!createForm.rg.trim()} className="w-full sm:w-auto">
                    Gerar Convite
                  </Button>
                </DialogFooter>
                {inviteToken && (
                  <div className="mt-4 rounded-md border bg-muted/30 p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <p className="text-sm font-medium">Convite gerado!</p>
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-xs">Token do Convite</Label>
                      <div className="flex items-center gap-2">
                        <Input value={inviteToken} readOnly className="font-mono text-xs bg-background" />
                        <Button size="icon" variant="outline" onClick={copyToken} className="shrink-0">
                          {copiedToken ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    {inviteExpiresAt && (
                      <p className="text-xs text-muted-foreground">
                        Válido até: {formatDate(inviteExpiresAt)}
                      </p>
                    )}
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Aceitar convite */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Aceitar Convite
            </CardTitle>
            <CardDescription>
              Recebeu um token de convite? Preencha seus dados para entrar na lista.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog
              open={acceptDialogOpen}
              onOpenChange={(open) => {
                setAcceptDialogOpen(open)
                if (!open) {
                  setAcceptError(null)
                  setAcceptSuccess(false)
                  setAcceptForm({ token: '', name: '', rg: '', phone: '', profile: 'LINHA' })
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="w-full" disabled={windowClosed}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Aceitar Convite
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Aceitar Convite</DialogTitle>
                  <DialogDescription>
                    Preencha seus dados para entrar na lista como convidado.
                  </DialogDescription>
                </DialogHeader>

                {acceptSuccess ? (
                  <div className="py-6 flex flex-col items-center gap-3 text-center">
                    <CheckCircle2 className="h-12 w-12 text-green-500" />
                    <p className="font-medium">Convite aceito com sucesso!</p>
                    <p className="text-sm text-muted-foreground">Você foi adicionado à lista.</p>
                    <Button onClick={() => { setAcceptDialogOpen(false) }} className="mt-2">
                      Fechar
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid gap-4 py-4">
                      {acceptError && (
                        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive flex items-center gap-2">
                          <XCircle className="h-4 w-4 shrink-0" />
                          {acceptError}
                        </div>
                      )}
                      <div className="grid gap-2">
                        <Label htmlFor="token">Token do Convite</Label>
                        <Input
                          id="token"
                          value={acceptForm.token}
                          onChange={(e) => setAcceptForm({ ...acceptForm, token: e.target.value })}
                          placeholder="cole o token aqui"
                          className="font-mono text-sm"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input
                          id="name"
                          value={acceptForm.name}
                          onChange={(e) => setAcceptForm({ ...acceptForm, name: e.target.value })}
                          placeholder="Seu nome"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="acceptRg">RG</Label>
                        <Input
                          id="acceptRg"
                          value={acceptForm.rg}
                          onChange={(e) => setAcceptForm({ ...acceptForm, rg: e.target.value })}
                          placeholder="12.345.678-9"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          value={acceptForm.phone}
                          onChange={(e) => setAcceptForm({ ...acceptForm, phone: formatPhone(e.target.value) })}
                          placeholder="(11)98765-4321"
                          maxLength={14}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="profile">Perfil</Label>
                        <Select
                          value={acceptForm.profile}
                          onValueChange={(value: 'LINHA' | 'GOLEIRO' | 'RESENHA') =>
                            setAcceptForm({ ...acceptForm, profile: value })
                          }
                        >
                          <SelectTrigger id="profile">
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
                      <Button variant="outline" onClick={() => setAcceptDialogOpen(false)} className="w-full sm:w-auto">
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleAccept}
                        disabled={!acceptForm.token.trim() || !acceptForm.name.trim() || !acceptForm.rg.trim() || !acceptForm.phone.trim()}
                        className="w-full sm:w-auto"
                      >
                        Entrar na Lista
                      </Button>
                    </DialogFooter>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
