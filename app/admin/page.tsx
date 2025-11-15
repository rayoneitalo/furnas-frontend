import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Users, UserPlus, BarChart3, Download } from 'lucide-react'

export default function AdminPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Área Administrativa</h1>
        <p className="text-muted-foreground">
          Gerencie a lista de jogadores, convites e configurações do sistema
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Jogadores
            </CardTitle>
            <CardDescription>
              Visualize e gerencie os jogadores da lista principal e lista de espera
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/players">Gerenciar Jogadores</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Convites
            </CardTitle>
            <CardDescription>
              Crie e gerencie convites para jogadores (janela: Terça 00:00 - Quinta 14:00)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/invites">Gerenciar Convites</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Estado
            </CardTitle>
            <CardDescription>
              Visualize o estado atual e gerencie resets da lista
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/list-state">Ver Estado</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Exportar
            </CardTitle>
            <CardDescription>
              Exporte a lista completa em formato Markdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/export">Exportar Lista</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

