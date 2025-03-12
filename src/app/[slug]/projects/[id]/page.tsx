import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getProjectEntriesByProjectId } from "@/lib/supabase/server/db"
import { serverUserService } from '@/lib/supabase/server/user'
import { ProjectCollapsible } from "@/components/projects/ProjectCollapsible"
import { EntryGrid } from "@/components/projects/EntryGrid"

export default async function ProjectPage({
  params
}: { params: { id: number, slug: string} }) {
  const { id, slug } = await params

  const userSetting = await serverUserService.getUserSettingBySlug(slug)
  if (!userSetting) {
    notFound()
  }

  const { data, success } = await getProjectEntriesByProjectId(id, userSetting.user_id)
  if (!success || !data) {
    redirect('/error')
  }

  const isOwner = await serverUserService.isPageOwner(slug)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative md:sticky md:top-4">
          <ProjectCollapsible
            title={data.title}
            description={data.description}
            status={data.status}
            targetDays={data.target_days}
            completedDays={data.completed_days}
            allowedSkippedDays={data.allow_skipped_days}
            createdAt={data.created_at}
            isOwner={isOwner}
            slug={slug}
            id={id}
          />
          {isOwner && (
            <Button type="button" className="mt-4 block">
              <Link href={`/${slug}/entries/new/${id}`} className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                New Entry
              </Link>
            </Button>
          )}
        </div>
        <EntryGrid entries={data.entries} isOwner={isOwner} slug={slug} />
      </div>
    </div>
  )
}