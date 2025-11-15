'use client'

import { useState, useEffect } from 'react'
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
import { api } from '@/lib/api'
import type { ListState } from '@/lib/types'
import { RefreshCw, Calendar, RotateCcw } from 'lucide-react'

export default function ListStatePage() {
  const [listState, setListState] = useState<ListState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const [resetting, setResetting] = useState(false)

  const loadListState = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getListState()
      setListState(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar estado da lista')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadListState()
  }, [])

  const handleReset = async () => {
    try {
      setResetting(true)
      setError(null)
      setSuccess(null)
      await api.resetList()
      setResetDialogOpen(false)
      setSuccess('Lista resetada com sucesso!')
      await loadListState()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao resetar lista')
    } finally {
      setResetting(false)
    }
  }


  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Estado da Lista
          </h1>
          <p className="text-muted-foreground">
            Visualize e gerencie o estado atual da lista
          </p>
        </div>
        <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive">
              <RotateCcw className="mr-2 h-4 w-4" />
              Resetar Lista
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Resetar Lista</DialogTitle>
              <DialogDescription>
                Esta ação irá remover todos os jogadores da lista e atualizar o
                timestamp de abertura. Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setResetDialogOpen(false)}
                disabled={resetting}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleReset}
                disabled={resetting}
              >
                {resetting ? 'Resetando...' : 'Confirmar Reset'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-destructive/15 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-md bg-green-500/15 p-4 text-sm text-green-600">
          {success}
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : !listState ? (
        <p className="text-muted-foreground">Estado da lista não encontrado</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Próxima Abertura
              </CardTitle>
              <CardDescription>
                Data e hora da próxima abertura da lista
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold">
                  {listState.listOpenTimestamp
                    ? new Date(listState.listOpenTimestamp).toLocaleString('pt-BR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                    : 'N/A'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Data e hora da próxima abertura da lista
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Informações do Reset
              </CardTitle>
              <CardDescription>
                Estatísticas sobre resets da lista
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total de Resets
                  </p>
                  <p className="text-2xl font-bold">
                    {listState.listResetCount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Timestamp de Abertura Atual
                  </p>
                  <p className="text-sm font-mono">
                    {new Date(listState.listOpenTimestamp).toISOString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Regras de Negócio</CardTitle>
              <CardDescription>
                Informações sobre o funcionamento da lista
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="font-medium mb-2">Capacidade</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Lista Principal: 30 jogadores</li>
                    <li>• Máximo de 2 convidados por titular</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-2">Janela de Convites</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Abertura: Terça-feira 00:00</li>
                    <li>• Fechamento: Quinta-feira 14:00</li>
                    <li>• Validade: 48 horas ou até o fechamento</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-2">Ordem</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Lista de espera: FIFO (primeiro a entrar)</li>
                    <li>• Promoção automática quando há vaga</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-2">Perfis</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Linha</li>
                    <li>• Goleiro</li>
                    <li>• Resenha</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

