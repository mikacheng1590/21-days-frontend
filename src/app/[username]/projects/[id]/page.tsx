import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function ProjectPage({
  params
}: { params: { id: number, username: string} }) {
  // TODO: check if user has this project
  const { id, username } = await params

  return (
    <Link href={`/${username}/entries/new/${id}`}>
      <Button>
        Add New Entry
      </Button>
    </Link>
  )
}