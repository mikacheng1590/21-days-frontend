import { OwnerOnly } from "@/components/auth/OwnerOnly"

export default async function ProjectsPage({
  params,
}: {
  params: { username: string }
}) {
  const { username } = await params
  
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">This is a page</h1>
          <OwnerOnly pageUsername={username}>
            <h1 className="text-2xl font-bold">Private Page for {username}</h1>
          </OwnerOnly>
        </div>
      </div>
    </div>
  )
}