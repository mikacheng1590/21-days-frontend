'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  // DialogDescription,
  // DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { EntryImage } from '@/lib/supabase/types'
import { convertToDate } from "@/lib/datetime/utils"
import Link from "next/link"

type ProjectDialogProps = {
  description: string
  day: number
  images: Pick<EntryImage, 'id' | 'image_url'>[]
  createdAt: string
  entryId: number
  isOwner: boolean
  slug: string
}

export function EntryDialog({
  description,
  day,
  images,
  createdAt,
  entryId,
  isOwner,
  slug
}: ProjectDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>See More</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] h-full md:h-[80%] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1">Day {day} - <span className="text-sm text-muted-foreground">{convertToDate(createdAt)}</span>{isOwner}
          {isOwner && (
            <Link href={`/${slug}/entries/${entryId}/edit`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>  
            </Link>
          )}
        </DialogTitle>
          {/* <DialogDescription> */}
            <div className="flex justify-center items-center">
              <Carousel className="w-full max-w-[200px] md:max-w-[400px]">
                <CarouselContent>
                  {images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="p-[10px]">
                        <Card className="shadow-none">
                          <CardContent className="flex aspect-[4/3] items-center justify-center p-4">
                            <img src={image.image_url} alt={`image-${index}`} className="w-full h-full object-cover" />
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
            <p className="text-xl font-base">{description}</p>
          {/* </DialogDescription> */}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}