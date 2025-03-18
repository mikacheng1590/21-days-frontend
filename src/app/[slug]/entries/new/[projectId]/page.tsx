import { redirect } from "next/navigation"
import NewForm from "@/components/entries/NewForm"
import { serverDbService } from "@/lib/supabase/server/db"
import { isDateToday } from "@/lib/datetime/utils"
import { ENTRY_WARNING_DUPLICATED_ENTRY_FOR_TODAY } from "@/lib/supabase/constants"

type NewEntryPageProps = {  
  params: {
    projectId: number
    slug: string
  }
}

export default async function NewEntryPage({
  params
}: NewEntryPageProps)
{
  const { projectId, slug } = await params

  // check if project exists AND is active, if so return the latest entry
  const { data: latestEntry, success: latestEntrySuccess } = await serverDbService.getActiveProjectLatestEntry(projectId)
  if (!latestEntrySuccess || !latestEntry) {
    redirect('/error')
  }

  let todayDay = 1

  // today has an entry, cannot create a new one
  if (latestEntry?.entries.length && isDateToday(latestEntry.entries[0].created_at)) {
    redirect(`/${slug}/entries/${latestEntry.entries[0].id}/edit?warning=${ENTRY_WARNING_DUPLICATED_ENTRY_FOR_TODAY}`)
  } else if (latestEntry?.entries.length) {
    todayDay = latestEntry.entries[0].day + 1
  }

  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Create New Entry</h1>
          <p className="text-muted-foreground mt-2">
            Tell me what you achieved today
          </p>
          <p className="text-muted-foreground mt-2">
            Day {todayDay} of {latestEntry?.target_days} days
          </p>
        </div>

        <NewForm
          projectId={projectId}
          todayDay={todayDay}
          slug={slug}
        />
      </div>
    </div>
  )
}