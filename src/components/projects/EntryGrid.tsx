'use client'

import { useState } from "react"
import { ProjectViewEntry } from "@/lib/supabase/types"
import { EntryCard } from "@/components/entries/EntryCard"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

type EntryGridProps = {
  entries: ProjectViewEntry[]
  isOwner: boolean
  slug: string
}

export function EntryGrid({
  entries,
  isOwner,
  slug
}: EntryGridProps) {
  // initial entries are sorted by day asc in db
  const [list, setList] = useState<ProjectViewEntry[]>(entries)

  return (
    <div className="w-full">
      <Button
        variant="noShadow"
        size="sm"
        className="mb-7"
        onClick={() => setList([...list].reverse())}
      >
        Created At
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-4">
        {list.map((entry) => (
          <EntryCard
            key={entry.id}
            entryId={entry.id}
            description={entry.description}
            day={entry.day}
            images={entry.images}
            createdAt={entry.created_at}
            isOwner={isOwner}
            slug={slug}
          />
        ))}
      </div>
    </div>
  )
}