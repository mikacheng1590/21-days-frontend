import Link from "next/link"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getProjectEntriesByProjectId } from "@/lib/supabase/server/db"

export default async function ProjectPage({
  params
}: { params: { id: number, username: string} }) {
  // TODO: check if user has this project
  const { id, username } = await params
  const data = await getProjectEntriesByProjectId(id)
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