import Link from 'next/link'
import { notFound } from "next/navigation"
import { Plus } from "lucide-react"
import { isPageOwner, getUserSettingBySlug } from "@/lib/supabase/server/auth"
import { Button } from '@/components/ui/button'
import ProjectsTable from '@/components/projects/ProjectsTable'

export default async function ProjectsPage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = await params

  const userSetting = await getUserSettingBySlug(slug)
  if (!userSetting) {
    notFound()
  }
  
  const isOwner = await isPageOwner(slug)
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">This is a page</h1>
          {isOwner &&
            <h1 className="text-2xl font-bold">Private Page for {userSetting.username}</h1>
          }
          {isOwner && (
            <Button className="mt-4 block">
              <Link href={`/${slug}/projects/new`} className="flex items-center gap-1">
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