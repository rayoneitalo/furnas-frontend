'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
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
import type { Player, CreatePlayerDto } from '@/lib/types'
import { Plus, Trash2 } from 'lucide-react'
import { MAIN_LIST_CAPACITY } from '@/lib/constants'
import { Card, CardContent } from '@/components/ui/card'

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [removeDialogOpen, setRemoveDialogOpen] = useState<string | null>(null)
  const [formData, setFormData] = useState<CreatePlayerDto>({
    name: '',
    rg: '',
    phone: '',
    profile: 'LINHA',
  })
  const [removeRg, setRemoveRg] = useState('')

  const loadPlayers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getPlayers()
      setPlayers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar jogadores')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPlayers()
  }, [])

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 2) return numbers ? `(${numbers}` : ''
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)})${numbers.slice(2)}`
    return `(${numbers.slice(0, 2)})${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }

  const handleCreate = async () => {
    if (!formData.name.trim() || !formData.rg.trim() || !formData.phone.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    if (!/^\(\d{2}\)\d{5}-\d{4}$/.test(formData.phone)) {
      setError('Por favor, insira um telefone válido no formato (99)99999-9999.')
      return
    }

    try {
      setError(null)
      await api.createPlayer(formData)
      setCreateDialogOpen(false)
      setFormData({ name: '', rg: '', phone: '', profile: 'LINHA' })
      await loadPlayers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar jogador')
    }
  }

  const handleRemove = async (playerId: string) => {
    try {
      setError(null)
      await api.removePlayer(playerId, { rg: removeRg })
      setRemoveDialogOpen(null)
      setRemoveRg('')
      await loadPlayers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover jogador')
    }
  }

  // Filtra jogadores por status, excluindo RESENHA da lista principal
  const mainPlayers = players.filter(
    (p) => p.status === 'MAIN' && p.profile !== 'RESENHA'
  )
  const waitlistPlayers = players.filter(
    (p) => p.status === 'WAITLIST' && p.profile !== 'RESENHA'
  )
  const resenhaPlayers = players.filter((p) => p.profile === 'RESENHA')

  const getProfileLabel = (profile: string) => {
    const labels: Record<string, string> = {
      LINHA: 'Linha',
      GOLEIRO: 'Goleiro',
      RESENHA: 'Resenha',
    }
    return labels[profile] || profile
  }

  const getProfileColor = (profile: string) => {
    const colors: Record<string, string> = {
      LINHA: 'bg-primary text-primary-foreground border-primary/20', // Dark Blue from logo
      GOLEIRO: 'bg-furnas-yellow text-furnas-yellow-foreground border-furnas-yellow/20', // Yellow from logo central star
      RESENHA: 'bg-accent text-accent-foreground border-accent/20', // Red from logo stripes
    }
    return colors[profile] || 'bg-muted text-muted-foreground'
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:py-10">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Jogadores</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gerencie a lista de jogadores e lista de espera
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Jogador
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Jogador</DialogTitle>
              <DialogDescription>
                Inscreva um novo jogador na lista. Jogadores com perfil Resenha vão para a lista de resenha. 
                Se a lista principal estiver cheia, será adicionado à lista de espera.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Italo Rayone"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rg">RG</Label>
                <Input
                  id="rg"
                  value={formData.rg}
                  onChange={(e) =>
                    setFormData({ ...formData, rg: e.target.value })
                  }
                  placeholder="12.345.678-9"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefone Celular</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const formatted = formatPhone(e.target.value)
                    setFormData({ ...formData, phone: formatted })
                  }}
                  placeholder="(11)98765-4321"
                  maxLength={14}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="profile">Perfil</Label>
                <Select
                  value={formData.profile}
                  onValueChange={(value: 'LINHA' | 'GOLEIRO' | 'RESENHA') =>
                    setFormData({ ...formData, profile: value })
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
              <Button
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!formData.name.trim() || !formData.rg.trim() || !formData.phone.trim()}
                className="w-full sm:w-auto"
              >
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-destructive/15 p-3 sm:p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-6 sm:space-y-8">
        {/* Lista Principal */}
        <div>
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <h2 className="text-xl sm:text-2xl font-semibold">
              Lista Principal ({mainPlayers.length}/{MAIN_LIST_CAPACITY})
            </h2>
            <Badge variant={mainPlayers.length >= MAIN_LIST_CAPACITY ? 'destructive' : 'default'}>
              {mainPlayers.length >= MAIN_LIST_CAPACITY ? 'Cheia' : 'Disponível'}
            </Badge>
          </div>
          {loading ? (
            <p className="text-muted-foreground">Carregando...</p>
          ) : mainPlayers.length === 0 ? (
            <p className="text-muted-foreground">Nenhum jogador na lista principal</p>
          ) : (
            <>
              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {mainPlayers.map((player) => (
                  <Card key={player.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-base truncate">{player.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(player.joinTimestamp).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <Dialog
                          open={removeDialogOpen === player.id}
                          onOpenChange={(open) =>
                            setRemoveDialogOpen(open ? player.id : null)
                          }
                        >
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="shrink-0">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md mx-4">
                            <DialogHeader>
                              <DialogTitle>Remover Jogador</DialogTitle>
                              <DialogDescription>
                                Digite o RG do jogador para confirmar a remoção.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="removeRg">RG</Label>
                                <Input
                                  id="removeRg"
                                  value={removeRg}
                                  onChange={(e) => setRemoveRg(e.target.value)}
                                  placeholder="12.345.678-9"
                                />
                              </div>
                            </div>
                            <DialogFooter className="flex-col sm:flex-row gap-2">
                              <Button
                                variant="outline"
                                onClick={() => setRemoveDialogOpen(null)}
                                className="w-full sm:w-auto"
                              >
                                Cancelar
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleRemove(player.id)}
                                className="w-full sm:w-auto"
                              >
                                Remover
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className={getProfileColor(player.profile)}
                        >
                          {getProfileLabel(player.profile)}
                        </Badge>
                        {player.isGuest && (
                          <Badge variant="secondary" className="text-xs">
                            {player.invitedBy
                              ? `Convidado por ${player.invitedBy.name}`
                              : 'Convidado'}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Convidado</TableHead>
                  <TableHead>Data de Inscrição</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mainPlayers.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell className="font-medium">{player.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getProfileColor(player.profile)}
                      >
                        {getProfileLabel(player.profile)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {player.isGuest ? (
                        <Badge variant="secondary">
                          {player.invitedBy
                            ? `Convidado por ${player.invitedBy.name}`
                            : 'Convidado'}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(player.joinTimestamp).toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog
                        open={removeDialogOpen === player.id}
                        onOpenChange={(open) =>
                          setRemoveDialogOpen(open ? player.id : null)
                        }
                      >
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md mx-4">
                          <DialogHeader>
                            <DialogTitle>Remover Jogador</DialogTitle>
                            <DialogDescription>
                              Digite o RG do jogador para confirmar a remoção.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="removeRg">RG</Label>
                              <Input
                                id="removeRg"
                                value={removeRg}
                                onChange={(e) => setRemoveRg(e.target.value)}
                                placeholder="12.345.678-9"
                              />
                            </div>
                          </div>
                          <DialogFooter className="flex-col sm:flex-row gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setRemoveDialogOpen(null)}
                              className="w-full sm:w-auto"
                            >
                              Cancelar
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleRemove(player.id)}
                              className="w-full sm:w-auto"
                            >
                              Remover
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
              </div>
            </>
          )}
        </div>

        {/* Lista de Espera */}
        <div>
          <div className="mb-4">
            <h2 className="text-xl sm:text-2xl font-semibold">
              Lista de Espera ({waitlistPlayers.length})
            </h2>
          </div>
          {loading ? (
            <p className="text-muted-foreground">Carregando...</p>
          ) : waitlistPlayers.length === 0 ? (
            <p className="text-muted-foreground">Nenhum jogador na lista de espera</p>
          ) : (
            <>
              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {waitlistPlayers
                  .sort(
                    (a, b) =>
                      new Date(a.joinTimestamp).getTime() -
                      new Date(b.joinTimestamp).getTime()
                  )
                  .map((player, index) => (
                    <Card key={player.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-muted-foreground">
                                #{index + 1}
                              </span>
                              <p className="font-semibold text-base truncate">{player.name}</p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {new Date(player.joinTimestamp).toLocaleString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                          <Dialog
                            open={removeDialogOpen === player.id}
                            onOpenChange={(open) =>
                              setRemoveDialogOpen(open ? player.id : null)
                            }
                          >
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="shrink-0">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md mx-4">
                              <DialogHeader>
                                <DialogTitle>Remover Jogador</DialogTitle>
                                <DialogDescription>
                                  Digite o RG do jogador para confirmar a remoção.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="removeRg">RG</Label>
                                  <Input
                                    id="removeRg"
                                    value={removeRg}
                                    onChange={(e) => setRemoveRg(e.target.value)}
                                    placeholder="12.345.678-9"
                                  />
                                </div>
                              </div>
                              <DialogFooter className="flex-col sm:flex-row gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => setRemoveDialogOpen(null)}
                                  className="w-full sm:w-auto"
                                >
                                  Cancelar
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleRemove(player.id)}
                                  className="w-full sm:w-auto"
                                >
                                  Remover
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant="outline"
                            className={getProfileColor(player.profile)}
                          >
                            {getProfileLabel(player.profile)}
                          </Badge>
                          {player.isGuest && (
                            <Badge variant="secondary" className="text-xs">
                              Convidado
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Posição</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Convidado</TableHead>
                  <TableHead>Data de Inscrição</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {waitlistPlayers
                  .sort(
                    (a, b) =>
                      new Date(a.joinTimestamp).getTime() -
                      new Date(b.joinTimestamp).getTime()
                  )
                  .map((player, index) => (
                    <TableRow key={player.id}>
                      <TableCell className="font-medium">
                        #{index + 1}
                      </TableCell>
                      <TableCell className="font-medium">{player.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getProfileColor(player.profile)}
                        >
                          {getProfileLabel(player.profile)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {player.isGuest ? (
                          <Badge variant="secondary">Convidado</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(player.joinTimestamp).toLocaleString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog
                          open={removeDialogOpen === player.id}
                          onOpenChange={(open) =>
                            setRemoveDialogOpen(open ? player.id : null)
                          }
                        >
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md mx-4">
                            <DialogHeader>
                              <DialogTitle>Remover Jogador</DialogTitle>
                              <DialogDescription>
                                Digite o RG do jogador para confirmar a remoção.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="removeRg">RG</Label>
                                <Input
                                  id="removeRg"
                                  value={removeRg}
                                  onChange={(e) => setRemoveRg(e.target.value)}
                                  placeholder="12.345.678-9"
                                />
                              </div>
                            </div>
                            <DialogFooter className="flex-col sm:flex-row gap-2">
                              <Button
                                variant="outline"
                                onClick={() => setRemoveDialogOpen(null)}
                                className="w-full sm:w-auto"
                              >
                                Cancelar
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleRemove(player.id)}
                                className="w-full sm:w-auto"
                              >
                                Remover
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
              </div>
            </>
          )}
        </div>

        {/* Lista de Resenha */}
        <div>
          <div className="mb-4">
            <h2 className="text-xl sm:text-2xl font-semibold">
              Lista de Resenha ({resenhaPlayers.length})
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Jogadores com perfil Resenha não ocupam vagas na lista principal
            </p>
          </div>
          {loading ? (
            <p className="text-muted-foreground">Carregando...</p>
          ) : resenhaPlayers.length === 0 ? (
            <p className="text-muted-foreground">Nenhum jogador na lista de resenha</p>
          ) : (
            <>
              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {resenhaPlayers
                  .sort(
                    (a, b) =>
                      new Date(a.joinTimestamp).getTime() -
                      new Date(b.joinTimestamp).getTime()
                  )
                  .map((player) => (
                    <Card key={player.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-base truncate">{player.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(player.joinTimestamp).toLocaleString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                          <Dialog
                            open={removeDialogOpen === player.id}
                            onOpenChange={(open) =>
                              setRemoveDialogOpen(open ? player.id : null)
                            }
                          >
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="shrink-0">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md mx-4">
                              <DialogHeader>
                                <DialogTitle>Remover Jogador</DialogTitle>
                                <DialogDescription>
                                  Digite o RG do jogador para confirmar a remoção.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="removeRg">RG</Label>
                                  <Input
                                    id="removeRg"
                                    value={removeRg}
                                    onChange={(e) => setRemoveRg(e.target.value)}
                                    placeholder="12.345.678-9"
                                  />
                                </div>
                              </div>
                              <DialogFooter className="flex-col sm:flex-row gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => setRemoveDialogOpen(null)}
                                  className="w-full sm:w-auto"
                                >
                                  Cancelar
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleRemove(player.id)}
                                  className="w-full sm:w-auto"
                                >
                                  Remover
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant="outline"
                            className={getProfileColor(player.profile)}
                          >
                            {getProfileLabel(player.profile)}
                          </Badge>
                          {player.isGuest && (
                            <Badge variant="secondary" className="text-xs">
                              {player.invitedBy
                                ? `Convidado por ${player.invitedBy.name}`
                                : 'Convidado'}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Perfil</TableHead>
                      <TableHead>Convidado</TableHead>
                      <TableHead>Data de Inscrição</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resenhaPlayers
                      .sort(
                        (a, b) =>
                          new Date(a.joinTimestamp).getTime() -
                          new Date(b.joinTimestamp).getTime()
                      )
                      .map((player) => (
                        <TableRow key={player.id}>
                          <TableCell className="font-medium">{player.name}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getProfileColor(player.profile)}
                            >
                              {getProfileLabel(player.profile)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {player.isGuest ? (
                              <Badge variant="secondary">
                                {player.invitedBy
                                  ? `Convidado por ${player.invitedBy.name}`
                                  : 'Convidado'}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(player.joinTimestamp).toLocaleString('pt-BR')}
                          </TableCell>
                          <TableCell className="text-right">
                            <Dialog
                              open={removeDialogOpen === player.id}
                              onOpenChange={(open) =>
                                setRemoveDialogOpen(open ? player.id : null)
                              }
                            >
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md mx-4">
                                <DialogHeader>
                                  <DialogTitle>Remover Jogador</DialogTitle>
                                  <DialogDescription>
                                    Digite o RG do jogador para confirmar a remoção.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="removeRg">RG</Label>
                                    <Input
                                      id="removeRg"
                                      value={removeRg}
                                      onChange={(e) => setRemoveRg(e.target.value)}
                                      placeholder="12.345.678-9"
                                    />
                                  </div>
                                </div>
                                <DialogFooter className="flex-col sm:flex-row gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => setRemoveDialogOpen(null)}
                                    className="w-full sm:w-auto"
                                  >
                                    Cancelar
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleRemove(player.id)}
                                    className="w-full sm:w-auto"
                                  >
                                    Remover
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

