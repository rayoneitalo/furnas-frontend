'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import type { CreatePlayerDto } from '@/lib/types'
import { CheckCircle2, AlertCircle } from 'lucide-react'

export default function Home() {
  const [formData, setFormData] = useState<CreatePlayerDto>({
    name: '',
    rg: '',
    phone: '',
    profile: 'LINHA',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 2) return numbers ? `(${numbers}` : ''
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)})${numbers.slice(2)}`
    return `(${numbers.slice(0, 2)})${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.rg.trim() || !formData.phone.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    if (!/^\(\d{2}\)\d{5}-\d{4}$/.test(formData.phone)) {
      setError('Por favor, insira um telefone válido no formato (99)99999-9999.')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(false)
      await api.createPlayer(formData)
      setSuccess(true)
      setFormData({ name: '', rg: '', phone: '', profile: 'LINHA' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao se inscrever na lista')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="w-full min-h-[calc(100vh-4rem)] sm:min-h-0 flex items-center justify-center py-4 px-4 sm:py-10">
        <div className="container mx-auto max-w-2xl w-full">
          <Card className="border-green-200 bg-green-50 w-full">
            <CardHeader className="text-center px-4 sm:px-6 pt-6">
              <div className="mx-auto mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <CardTitle className="text-lg sm:text-xl md:text-2xl">
                Inscrição realizada com sucesso!
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm md:text-base mt-2">
                Você foi adicionado à lista. Verifique sua posição na lista principal ou lista de
                espera.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center px-4 sm:px-6 pb-6">
              <Button
                onClick={() => {
                  setSuccess(false)
                  setError(null)
                }}
                className="w-full sm:w-auto"
              >
                Fazer nova inscrição
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:py-10 max-w-2xl">
      <div className="mb-6 sm:mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
          Lista de Jogadores
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          Inscreva-se na lista de jogadores do futebol
        </p>
      </div>

        <Card>
          <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Nova Inscrição</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Preencha seus dados para entrar na lista. Se a lista principal estiver cheia, você será
            adicionado à lista de espera.
            </CardDescription>
          </CardHeader>
          <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Italo Rayone"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="rg">RG</Label>
              <Input
                id="rg"
                value={formData.rg}
                onChange={(e) => setFormData({ ...formData, rg: e.target.value })}
                placeholder="12.345.678-9"
                required
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
                required
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

            {error && (
              <div className="rounded-md bg-destructive/15 p-4 text-sm text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
              {loading ? 'Enviando...' : 'Inscrever-se na Lista'}
            </Button>
          </form>
          </CardContent>
        </Card>

      <div className="mt-6 text-center">
        <p className="text-xs sm:text-sm text-muted-foreground">
          Capacidade máxima: 30 jogadores na lista principal
        </p>
      </div>
    </div>
  )
}
