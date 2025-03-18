import { redirect } from "next/navigation"
import { serverDbService } from "@/lib/supabase/server/db"
import NewForm from "@/components/entries/NewForm"
import { ENTRY_WARNING_DUPLICATED_ENTRY_FOR_TODAY } from "@/lib/constants"

type EditEntryPageProps = {
  params: {
    slug: string
    id: number
  }
  searchParams: {
    warning?: string
  }
}

export default async function EditEntryPage({
  params,
  searchParams
}: EditEntryPageProps) {
  const { slug, id } = await params
  const { data: entry, success } = await serverDbService.getEntryById(id)
  if (!success || !entry) {
    redirect('/error')
  }

  const { warning } = await searchParams
  
  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {
          warning && warning === ENTRY_WARNING_DUPLICATED_ENTRY_FOR_TODAY && (
            <div className="p-3 bg-error text-white rounded-md">
              <p>You have already created an entry for today. Go to edit today's entry.</p>
            </div>
          )
        }
        <div>
          <h1 className="text-3xl font-bold">Update Entry</h1>
        </div>

        <NewForm
          projectId={entry.project_id}
          slug={slug}
          entry={entry}
        />
      </div>
    </div>
  )
}