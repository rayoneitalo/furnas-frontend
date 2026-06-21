'use client'

import { Button } from '@/components/ui/button'
import { removeToken } from '@/lib/auth'
import { usePathname, useRouter } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  function handleLogout() {
    removeToken()
    router.push('/admin/login')
  }

  return (
    <div>
      {!isLoginPage && (
        <div className="border-b">
          <div className="container mx-auto py-2 flex justify-end">
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </div>
      )}
      {children}
    </div>
  )
}
