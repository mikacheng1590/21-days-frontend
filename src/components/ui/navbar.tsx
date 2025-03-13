'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { useAuth } from '@/components/providers/AuthProvider'

type NavLink = {
  href: string
  label: string
  notShowOn: string[]  // paths where this link should NOT be shown
}

const navLinks: NavLink[] = [
  {
    href: `/profile`,
    label: 'Profile',
    notShowOn: ['/welcome']
  }
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()

  // Function to determine if nav items should be shown
  const shouldShowNavItems = () => {
    return !navLinks.some(link => 
      link.notShowOn.some(path => pathname.startsWith(path))
    )
  }

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo/Brand and Desktop Navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold">
                21 Days
              </Link>
            </div>
            {/* Desktop Navigation Links */}
            {shouldShowNavItems() && (
              <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === link.href
                        ? 'text-foreground'
                        : 'text-foreground/60 hover:text-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Logout Button */}
          {user && (
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <LogoutButton />
            </div>
          )}

          {/* Mobile menu button - Always visible */}
          <div className="flex items-center sm:hidden">
            <Button
              variant="neutral"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu - Shows when open */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {shouldShowNavItems() && navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === link.href
                    ? 'text-foreground'
                    : 'text-foreground/60 hover:text-foreground'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {/* Mobile Logout Button */}
            {user && (
              <div className="mt-4 px-3">
                <LogoutButton />
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
} 