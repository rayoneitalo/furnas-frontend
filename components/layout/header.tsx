'use client'

import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Users, UserPlus, BarChart3, Download, BookOpen, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const navigation = [
  { name: 'Início', href: '/', icon: Home },
  { name: 'Jogadores', href: '/admin/players', icon: Users },
  { name: 'Convites', href: '/admin/invites', icon: UserPlus },
  { name: 'Estado', href: '/admin/list-state', icon: BarChart3 },
  { name: 'Exportar', href: '/admin/export', icon: Download },
]

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center px-4">
        <div className="mr-4 sm:mr-8 flex">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md transition-transform group-hover:scale-105">
              <span className="font-bold text-xs sm:text-sm">F</span>
            </div>
            <span className="font-bold text-lg sm:text-xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Furnas
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all',
              pathname === '/'
                ? 'bg-primary/10 text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
            )}
          >
            <Home className="h-4 w-4" />
            <span>Inscrição</span>
          </Link>
          {pathname?.startsWith('/admin') && (
            <>
              {navigation
                .filter((item) => item.href !== '/')
                .map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  return (
          <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all',
                        isActive
                          ? 'bg-primary/10 text-primary shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      )}
          >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
          </Link>
                  )
                })}
            </>
          )}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-2">
          {!pathname?.startsWith('/admin') && (
            <Button variant="outline" size="sm" asChild className="hidden sm:flex">
              <Link href="/admin/players">Área Administrativa</Link>
            </Button>
          )}
          <Button variant="outline" size="sm" asChild className="gap-2 hidden sm:flex">
            <a
              href="http://localhost:3000/docs"
              target="_blank"
              rel="noopener noreferrer"
          >
              <BookOpen className="h-4 w-4" />
              <span className="hidden lg:inline">Documentação</span>
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container px-4 py-4 space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all',
                pathname === '/'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              )}
            >
              <Home className="h-4 w-4" />
              <span>Inscrição</span>
            </Link>
            {pathname?.startsWith('/admin') && (
              <>
                {navigation
                  .filter((item) => item.href !== '/')
                  .map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all',
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}
              </>
            )}
            {!pathname?.startsWith('/admin') && (
              <Link
                href="/admin/players"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50"
              >
                <Users className="h-4 w-4" />
                <span>Área Administrativa</span>
              </Link>
            )}
            <a
              href="http://localhost:3000/docs"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50"
            >
              <BookOpen className="h-4 w-4" />
              <span>Documentação</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}

