import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getProjectEntriesByProjectId } from "@/lib/supabase/server/db"
import { getUserSettingByUsername, isPageOwner } from "@/lib/supabase/server/auth"
import { ProjectCollapsible } from "@/components/projects/ProjectCollapsible"
import { EntryGrid } from "@/components/projects/EntryGrid"

export default async function ProjectPage({
  params
}: { params: { id: number, username: string} }) {
  const { id, username } = await params
  const userSetting = await getUserSettingByUsername(username)
  if (!userSetting) {
    notFound()
  }

  const data = await getProjectEntriesByProjectId(id, userSetting.user_id)
  if (!data) {
    redirect('/error')
  }

  const isOwner = await isPageOwner(username)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row">
        <div>
          <ProjectCollapsible
            title={data.title}
            description={data.description}
            status={data.status}
            targetDays={data.target_days}
            completedDays={data.completed_days}
            allowedSkippedDays={data.allow_skipped_days}
            createdAt={data.created_at}
            isOwner={isOwner}
          />
          {isOwner && (
            <Link href={`/${username}/entries/new/${id}`} className="mt-4 block">
              <Button>
                Add New Entry
              </Button>
            </Link>
          )}
        </div>
        <EntryGrid entries={data.entries} />
      </div>
    </div>
  )
}