import { notFound, redirect } from "next/navigation"
import Toast from "@/components/entries/Toast"
import { getUserSettingBySlug } from "@/lib/supabase/server/auth"
import { getEntryById } from "@/lib/supabase/server/db"
import NewForm from "@/components/entries/NewForm"

type EditEntryPageProps = {
  params: {
    slug: string
    id: number
  }
}

export default async function EditEntryPage({
  params
}: EditEntryPageProps) {
  const { slug, id } = await params
  const userSetting = await getUserSettingBySlug(slug)
  if (!userSetting) {
    notFound()
  }

  const entry = await getEntryById(id, userSetting.user_id)
  if (!entry) {
    redirect('/error')
  }
  
  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Update Entry</h1>
        </div>

        <Toast />
        <NewForm
          projectId={entry.project_id}
          slug={slug}
          entry={entry}
        />
      </div>
    </div>
  )
}