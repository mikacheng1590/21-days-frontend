'use client'

import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import ImageCard from "@/components/ui/image-card"
import { Textarea } from "@/components/ui/textarea"
import { convertBlobUrlToFile } from "@/lib/image/utils"
import { uploadImage } from "@/lib/supabase/client/storage"
import { createClient } from "@/lib/supabase/client/client"
import { INSERT_ENTRY_WITH_IMAGES_FUNCTION } from "@/lib/supabase/constants"
import { getActiveProjectLatestEntry } from "@/lib/supabase/client/db"

type FormData = {
  description: string
  images: string[]
}

type NewFormProps = {
  projectId: number
  todayDay: number
  slug: string
}

export default function NewForm({
  projectId,
  todayDay,
  slug
}: NewFormProps) {
  const router = useRouter()
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors, isValid }
  } = useForm<FormData>({
    mode: 'onSubmit',
    defaultValues: {
      description: '',
      images: []
    }
  })

  const imagesInput = useWatch({
    control: control,
    name: 'images'
  })

  const handleImageChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));

      const newUrls = [...imagesInput, ...newImageUrls]
      setValue('images', newUrls, {
        shouldValidate: true,
      })
    }
  }, [imagesInput, setValue])

  const handleDeleteImage = useCallback((index: number) => {
    const newUrls = imagesInput.filter((_, i) => i !== index)
    setValue('images', newUrls, {
      shouldValidate: true,
    })
  }, [imagesInput, setValue])

  const handleFormSubmit = useCallback(async(formData: FormData) => {
    if (isLoading) return
    setIsLoading(true)

    try {
      const latestEntry = await getActiveProjectLatestEntry(projectId)
      if (!latestEntry) {
        throw new Error('User/ project not found')
      }

      const latestEntryDay = latestEntry.entries.length ? latestEntry.entries[0].day : 0
      if (todayDay - latestEntryDay !== 1) {
        throw new Error('Something wrong with the day. Please refresh the page.')
      }

      const { images, description } = formData
      // upload images to supabase storage
      let imageUrls = []
      for (const url of images) {
        const imageFile = await convertBlobUrlToFile(url);

        const { imageUrl, error } = await uploadImage({
          file: imageFile,
        });
        imageUrls.push(imageUrl)

        if (error) throw error
      }

      const supabase = createClient()
      const { data, error } = await supabase.rpc(INSERT_ENTRY_WITH_IMAGES_FUNCTION, {
        project_id: Number(projectId),
        entry_description: description,
        image_urls: imageUrls,
        today_day: todayDay
      })

      if (error) throw error
      toast.success('Congratulations! You\'re one step closer to your goal!')
      router.push(`/${slug}/projects/${projectId}`)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, setIsLoading])

  const onSubmit = (data: FormData) => {
    handleFormSubmit(data)
  }

  useEffect(() => {
    register('images', {
      validate: (value) => {
        if (!value.length) {
          return 'Please select at least one image'
        }
        return true
      }
    })
   }, [register])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center rounded-md border border-border border-dashed p-4 gap-4">
          {imagesInput.map((url, index) => (
            <div className="relative" key={index}>
              <ImageCard imageUrl={url} />
              <Button variant="neutral" size="icon" className="w-6 h-6 absolute top-0 right-0"
                onClick={() => handleDeleteImage(index)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </Button>
            </div>
          ))}
        </div>
        
        <Input
          type="file"
          className="hidden"
          multiple
          accept="image/*"
          ref={imageInputRef}
          onChange={handleImageChange}
          disabled={isLoading}
        />
        <Button
          type="button"
          onClick={(e) => {
            imageInputRef.current?.click()
          }}
          disabled={isLoading}
        >
          Select Images
        </Button>
        {errors.images && (
          <p className="text-sm text-red-500">{errors.images.message}</p>
        )}
      </div>

      <div className="space-y-2">
      <label className="text-sm font-medium">Description</label>
        <Textarea
          {...register('description', {
            required: 'Description is required'
          })}
          placeholder="What did you do today?"
          disabled={isLoading}
          className="neo-brutalism-input"
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <Button 
        type="submit"
        className="w-full neo-brutalism-button"
        disabled={!isValid || isLoading}
      >
        {isLoading ? 'Pending...' : 'Create Entry'}
      </Button>
      
    </form>
  )
}