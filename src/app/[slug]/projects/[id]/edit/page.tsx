import { notFound, redirect } from "next/navigation"
import NewForm from "@/components/projects/Form"
import { getActiveProjectById } from "@/lib/supabase/server/db"
import { serverUserService } from "@/lib/supabase/server/user"

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

  const userSetting = await serverUserService.getUserSettingBySlug(slug)
  if (!userSetting) {
    notFound()
  }
  
  const { data: project, success } = await getActiveProjectById(id)
  if (!success || !project) {
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