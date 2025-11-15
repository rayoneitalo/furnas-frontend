# Furnas Frontend

Frontend desenvolvido com Next.js 16 para consumir a API do backend Furnas.

## Tecnologias

- **Next.js 16** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização utilitária
- **shadcn/ui** - Componentes UI acessíveis
- **Radix UI** - Componentes primitivos acessíveis

## Pré-requisitos

- Node.js 20 LTS ou superior
- npm 10 ou superior
- Backend Furnas rodando (ver README do backend)

## Configuração

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```
   
   Ajuste `NEXT_PUBLIC_API_URL` se necessário (padrão: `http://localhost:3000`)

## Execução

- **Desenvolvimento**: `npm run dev`
- **Build de produção**: `npm run build`
- **Iniciar produção**: `npm run start`

A aplicação estará disponível em `http://localhost:3000` (ou outra porta se 3000 estiver em uso).

## Estrutura do Projeto

```
furnas-frontend/
├── app/              # App Router do Next.js
│   ├── layout.tsx   # Layout principal
│   └── page.tsx     # Página inicial
├── components/       # Componentes React
│   ├── layout/      # Componentes de layout (Header, Footer)
│   └── ui/          # Componentes shadcn/ui
├── lib/             # Utilitários e helpers
│   ├── api.ts       # Cliente API para consumir o backend
│   └── utils.ts     # Funções utilitárias
└── hooks/           # Custom hooks React
```

## Componentes UI

O projeto utiliza shadcn/ui para componentes. Para adicionar novos componentes:

```bash
npx shadcn@latest add [component-name]
```

## Integração com Backend

O cliente API está configurado em `lib/api.ts` e utiliza a variável de ambiente `NEXT_PUBLIC_API_URL` para se conectar ao backend.

## Desenvolvimento

- O projeto utiliza TypeScript para type safety
- Tailwind CSS para estilização
- Componentes são Server Components por padrão (Next.js 16)
- Para Client Components, use `'use client'` no topo do arquivo
