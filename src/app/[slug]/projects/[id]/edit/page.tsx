import NewForm from "@/components/projects/Form"
import { getUserSettingBySlug } from "@/lib/supabase/server/auth"
import { getActiveProjectById } from "@/lib/supabase/server/db"
import { notFound, redirect } from "next/navigation"

type EditProjectPageProps = {
  params: {
    slug: string
    id: number
  }
}

export default async function EditProjectPage({
  params
}: EditProjectPageProps) {
  const { slug, id } = await params
  const userSetting = await getUserSettingBySlug(slug)
  if (!userSetting) {
    notFound()
  }
  
  const project = await getActiveProjectById(id, userSetting.user_id)
  if (!project) {
    redirect('/error')
  }

  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Edit Project</h1>
        </div>

        <NewForm
          slug={slug}
          project={project}
          formType="edit"
        />
      </div>
    </div>
  )
}