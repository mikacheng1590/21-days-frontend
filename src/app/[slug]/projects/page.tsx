import Link from 'next/link'
import { notFound } from "next/navigation"
import { Plus } from "lucide-react"
import { Button } from '@/components/ui/button'
import ProjectsTable from '@/components/projects/ProjectsTable'
import { serverUserService } from '@/lib/supabase/server/user'

export default async function ProjectsPage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = await params

  const { data: userSetting, success: userSettingSuccess } = await serverUserService.getUserSettingBySlug(slug)
  if (!userSettingSuccess || !userSetting) {
    notFound()
  }

  const isOwner = await serverUserService.isPageOwner(slug)
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">{userSetting.username}'s Projects</h1>
          {isOwner && (
            <Button>
              <Link href={`/${slug}/projects/new`} className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                New Project
              </Link>
            </Button>
          )}
        </div>
        <ProjectsTable userSetting={userSetting} />
      </div>
    </div>
  )
}