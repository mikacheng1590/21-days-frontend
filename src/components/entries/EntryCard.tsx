'use client'

import Image from 'next/image'
import { EntryDialog } from '@/components/entries/EntryDialog'
import { EntryImage } from '@/lib/supabase/types'

type EntryCardProps = {
  description: string 
  day: number
  images: Pick<EntryImage, 'id' | 'image_url'>[]
  createdAt: string
  entryId: number
  isOwner: boolean
  slug: string
}

export function EntryCard({
  description,
  day,
  images,
  createdAt,
  entryId,
  isOwner,
  slug
}: EntryCardProps) {
  return (
    <>
      <figure className="w-full overflow-hidden rounded-base border-2 border-border bg-main font-base shadow-shadow">
        <Image className="w-full object-contain aspect-4/3" src={images[0].image_url} alt={`entry-image-${images[0].id}`} width={400} height={300} />
          <figcaption className="border-t-2 text-mtext border-border p-4">
            <h6 className="text-lg font-bold mb-1">Day {day}</h6>
            <p className="text-sm line-clamp-3 mb-2 min-h-[calc(1.25rem*3)]">{description}</p>
            <EntryDialog
              description={description}
              day={day}
              images={images}
              createdAt={createdAt}
              entryId={entryId}
              isOwner={isOwner}
              slug={slug}
            />
          </figcaption>
      </figure>
    </>
  )
}
