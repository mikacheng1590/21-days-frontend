import Link from 'next/link'
import { notFound } from "next/navigation"
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
            <Link href={`/${username}/projects/new`}>
              <Button
                type="button"
              >
                Add New Project
              </Button>
            </Link>
          )}
        </div>
        <ProjectsTable userSetting={userSetting} />
      </div>
    </div>
  )
}