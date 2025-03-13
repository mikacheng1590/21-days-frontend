import { Navbar } from '@/components/ui/navbar'

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 my-4">
        {children}
      </main>
    </div>
  )
} 