'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'
import { Download, Copy, CheckCircle2 } from 'lucide-react'

export default function ExportPage() {
  const [markdown, setMarkdown] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleExport = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.exportList()
      setMarkdown(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao exportar lista')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (markdown) {
      navigator.clipboard.writeText(markdown)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const downloadMarkdown = () => {
    if (markdown) {
      const blob = new Blob([markdown], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `lista-jogadores-${new Date().toISOString().split('T')[0]}.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Exportar Lista</h1>
        <p className="text-muted-foreground">
          Exporte a lista completa de jogadores em formato Markdown
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-destructive/15 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Exportação</CardTitle>
          <CardDescription>
            Gere um arquivo Markdown com a lista completa de jogadores,
            ordenada por lista principal e depois lista de espera
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleExport} disabled={loading}>
            <Download className="mr-2 h-4 w-4" />
            {loading ? 'Gerando...' : 'Gerar Exportação'}
          </Button>

          {markdown && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button variant="outline" onClick={copyToClipboard}>
                  {copied ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copiar
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={downloadMarkdown}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>

              <div className="rounded-md border bg-muted/50 p-4">
                <pre className="whitespace-pre-wrap text-sm font-mono">
                  {markdown}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

