'use client'

import { ProjectDialog } from './EntryDialog'
import { EntryImage } from '@/lib/supabase/types'

type ProjectCardProps = {
  description: string 
  day: number
  images: Pick<EntryImage, 'id' | 'image_url'>[]
  createdAt: string
}

export function ProjectCard({
  description,
  day,
  images,
  createdAt
}: ProjectCardProps) {
  return (
    <>
      <figure className="w-full overflow-hidden rounded-base border-2 border-border bg-main font-base shadow-shadow">
        <img className="w-full object-contain aspect-[4/3]" src={images[0].image_url} alt={`entry-image-${images[0].id}`} />
          <figcaption className="border-t-2 text-mtext border-border p-4">
            <h6 className="text-lg font-bold mb-1">Day {day}</h6>
            <p className="text-sm line-clamp-3 mb-2 min-h-[calc(1.25rem*3)]">{description}</p>
            <ProjectDialog
              description={description}
              day={day}
              images={images}
              createdAt={createdAt}
            />
          </figcaption>
      </figure>
    </>
  )
}
