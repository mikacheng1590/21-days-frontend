'use client'

import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { PostgrestError } from "@supabase/supabase-js"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import ImageCard from "@/components/ui/image-card"
import { Textarea } from "@/components/ui/textarea"
import { convertBlobUrlToFile } from "@/lib/image/utils"
import { uploadImage } from "@/lib/supabase/client/storage"
import { getActiveProjectLatestEntry, insertEntryAndUpdateProjectStatus, updateEntry } from "@/lib/supabase/client/db"
import { EntryView } from "@/lib/supabase/types"
import { useAuth } from "@/components/providers/AuthProvider"

type FormImage = {
  url: string
  isExisting: boolean
}

type FormData = {
  description: string
  images: FormImage[]
}

type NewFormProps = {
  projectId: number
  todayDay?: number
  slug: string
  entry?: EntryView
}

export default function NewForm({
  projectId,
  todayDay,
  slug,
  entry
}: NewFormProps) {
  const { user } = useAuth()
  const isEditMode = !!entry
  const router = useRouter()
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([])
  
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
      description: entry?.description || '',
      images: entry?.images.map((image) => ({
        url: image.image_url,
        isExisting: true
      })) || []
    }
  })

  const imagesInput = useWatch({
    control: control,
    name: 'images'
  })

  const handleImageChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImageUrls = filesArray.map((file) => ({
        url: URL.createObjectURL(file),
        isExisting: false
      }));

      const newUrls = [...imagesInput, ...newImageUrls]
      setValue('images', newUrls, {
        shouldValidate: true,
      })
    }
  }, [imagesInput, setValue])

  const handleDeleteImage = useCallback((index: number) => {
    const imageToDelete = imagesInput[index]
    if (imageToDelete.isExisting) {
      setImagesToDelete(prev => [...prev, imageToDelete.url])
    }
    const newUrls = imagesInput.filter((_, i) => i !== index)
    setValue('images', newUrls, {
      shouldValidate: true,
    })
  }, [imagesInput, setImagesToDelete, setValue])

  const uploadImageToDb = useCallback(async (images: FormImage[]): Promise<string[]> => {
    let imageUrls = []

    for (const image of images) {
      // if image does not exist on db, upload it
      if (!image.isExisting) {
        const imageFile = await convertBlobUrlToFile(image.url);
        const { imageUrl, error } = await uploadImage({
          file: imageFile,
        });

        if (error) throw error
        imageUrls.push(imageUrl)
      }
    }

    return imageUrls
  }, [convertBlobUrlToFile, uploadImage])

  const updateEntryOnDb = useCallback(async (description: string, imageUrls: string[]): Promise<{ success: boolean, error: PostgrestError | null }> => {
    if (!entry || !user) {
      return { success: false, error: null }
    }

    const { error: editError, success: editResponseSuccess } = await updateEntry(
      entry.id,
      user.id,
      description,
      imageUrls,
      imagesToDelete) 

    return {
      success: editResponseSuccess,
      error: editError
    }
  }, [updateEntry, entry, user, imagesToDelete])

  const insertEntryOnDb = useCallback(async (description: string, imageUrls: string[]): Promise<boolean | PostgrestError> => {
    // Validate day sequence for new entries only
    const { data: latestEntry, success: latestEntrySuccess } = await getActiveProjectLatestEntry(projectId)
    if (!latestEntrySuccess) {
      throw new Error('User/ project not found')
    }

    const latestEntryDay = latestEntry?.entries.length ? latestEntry.entries[0].day : 0
    if (!todayDay || (todayDay && todayDay - latestEntryDay !== 1)) {
      throw new Error('Something wrong with the day. Please refresh the page.')
    }

    // Insert new entry
    const { error: insertError, success: insertResponseSuccess } = await insertEntryAndUpdateProjectStatus(
      projectId,
      description,
      imageUrls,
      todayDay
    )
    if (!insertResponseSuccess) throw insertError

    return true
  }, [insertEntryAndUpdateProjectStatus, projectId, todayDay])

  const handleFormSubmit = useCallback(async(formData: FormData) => {
    if (isLoading) return
    setIsLoading(true)

    if (!user) {
      toast.error('Please login to create a project')
      setIsLoading(false)
      router.push('/')
      return
    }

    try {
      const { images, description } = formData
      let successMessage = ''

      const imageUrls = await uploadImageToDb(images)

      if (isEditMode) {
        const { success: editSuccess, error: editError } = await updateEntryOnDb(
          description,
          imageUrls,
        )
        if (!editSuccess) {
          let e = editError ?? new Error('Failed to update entry as entry/ user not found')
          throw e
        }

        successMessage = 'Entry updated successfully!'
      } else {
        // Validate day sequence for new entries only
        const insertResponse = await insertEntryOnDb(
          description,
          imageUrls
        )
        if (!insertResponse || insertResponse instanceof PostgrestError) throw new Error('Failed to create entry')

        successMessage = 'Congratulations! You\'re one step closer to your goal!'
      }     

      toast.success(successMessage)
      router.push(`/${slug}/projects/${projectId}`)
    } catch (error) {
      console.error(error)
      toast.error(isEditMode ? 'Failed to update entry' : 'Failed to create entry')
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, setIsLoading, toast, router, uploadImageToDb, isEditMode, updateEntryOnDb, insertEntryOnDb])

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
          {imagesInput.map((image, index) => (
            <div className="relative" key={index}>
              <ImageCard imageUrl={image.url} />
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
        {isLoading ? 'Pending...' : isEditMode ? 'Update Entry' : 'Create Entry'}
      </Button>
      
    </form>
  )
}