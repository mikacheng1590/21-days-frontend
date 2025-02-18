import { isPageOwner } from "@/lib/supabase/server/auth"

export default async function ProjectsPage({
  params,
}: {
  params: { username: string }
}) {
  const { username } = await params
  const isOwner = await isPageOwner(username)
  
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">This is a page</h1>
          {isOwner &&
            <h1 className="text-2xl font-bold">Private Page for {username}</h1>
          }
        </div>
      </div>
    </div>
  )
}