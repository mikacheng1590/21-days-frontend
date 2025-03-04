'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

type ProjectDialogProps = {
  description: string
  day: number
  images: Pick<EntryImage, 'id' | 'image_url'>[]
  createdAt: string
}

export function ProjectDialog({
  description,
  day,
  images,
  createdAt
}: ProjectDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>See More</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] h-full md:h-[80%] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Day {day} - <span className="text-sm text-muted-foreground">{convertToDate(createdAt)}</span></DialogTitle>
          <DialogDescription>
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
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}