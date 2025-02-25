import NewForm from "@/components/entries/NewForm"
import { isUserHaveProject } from "@/lib/supabase/server/db"
import { redirect } from "next/navigation"

export default async function NewEntryPage({
  params
}: { params: { projectId: number } })
{
  const { projectId } = await params
  // check if project exists AND is active
  const isHaveProject = await isUserHaveProject(projectId)
  if (!isHaveProject) {
    redirect('/error')
  }
  
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Create New Entries</h1>
          <p className="text-muted-foreground mt-2">
            Tell me what you achieved today
          </p>
        </div>

        <NewForm projectId={projectId} />
      </div>
    </div>
  )
}