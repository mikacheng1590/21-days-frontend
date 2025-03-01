import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getProjectEntriesByProjectId } from "@/lib/supabase/server/db"
import { getUserSettingByUsername } from "@/lib/supabase/server/auth"

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

  return (
    // <Link href={`/${username}/entries/new/${id}`}>
    //   <Button>
    //     Add New Entry
    //   </Button>
    // </Link>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex">
        <div>
          
        {/* title, description, status, target days, completed days */}

        </div>
        <div></div>
      </div>
    </div>
  )
}