import { ReactNode } from 'react'
import { isPageOwner } from '@/lib/supabase/server/auth'

interface OwnerOnlyProps {
  pageUsername: string
  children: ReactNode
  fallback?: ReactNode
}

export async function OwnerOnly({ pageUsername, children, fallback = null }: OwnerOnlyProps) {
  const isOwner = await isPageOwner(pageUsername)

  if (!isOwner) return fallback
  return <>{children}</>
}