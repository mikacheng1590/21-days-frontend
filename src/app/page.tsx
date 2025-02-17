import { AuthForm } from '@/components/auth/AuthForm'

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to 21 Days</h1>
      <AuthForm />
    </main>
  )
}
