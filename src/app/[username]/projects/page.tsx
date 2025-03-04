import Link from 'next/link'
import { notFound } from "next/navigation"
import { Plus } from "lucide-react"
import { isPageOwner, getUserSettingByUsername } from "@/lib/supabase/server/auth"
import { Button } from '@/components/ui/button'
import ProjectsTable from '@/components/projects/ProjectsTable'

export default async function ProjectsPage({
  params,
}: {
  params: { username: string }
}) {
  const { username } = await params

  const userSetting = await getUserSettingByUsername(username)
  if (!userSetting) {
    notFound()
  }
  
  const isOwner = await isPageOwner(username)
  
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">This is a page</h1>
          {isOwner &&
            <h1 className="text-2xl font-bold">Private Page for {username}</h1>
          }
          {isOwner && (
            <Button className="mt-4 block">
              <Link href={`/${username}/projects/new`} className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                New Entry
              </Link>
            </Button>
          )}
        </div>
        <ProjectsTable userSetting={userSetting} />
      </div>
    </div>
  )
}