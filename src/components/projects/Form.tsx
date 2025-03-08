'use client'

import { useForm } from 'react-hook-form'
import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/components/providers/AuthProvider'
import { PROJECT_STATUS_ACTIVE } from "@/lib/supabase/constants"
import { ProjectSummary, insertUpdateError } from '@/lib/supabase/types'
import { cn } from "@/lib/tailwind/utils"
import { insertProject, updateProject } from "@/lib/supabase/client/db"

type FormData = {
  title: string
  description: string
  numberOfDays: number
  allowedSkips: number
}

type FormProps = {
  slug: string
  project?: ProjectSummary
  formType?: 'new' | 'edit'
} 

export default function Form({
  slug,
  project,
  formType = 'new'
}: FormProps) {
  const { user } = useAuth()  
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid }
  } = useForm<FormData>({
    mode: 'onSubmit',
    defaultValues: {
      title: project?.title || '',
      description: project?.description || '',
      numberOfDays: project?.target_days || 21,
      allowedSkips: project?.allow_skipped_days || 0
    }
  })

  const handleFormSubmit = useCallback(async (data: FormData) => {
    if (isLoading) return
    setIsLoading(true)

    if (!user) {
      toast.error('Please login to create a project')
      setIsLoading(false)
      router.push('/')
      return
    }

    try {
      let error: insertUpdateError = null
      let successMessage = 'Project created successfully!'
      if (project) {
        successMessage = 'Project updated successfully!'

        error = await updateProject({
          id: project.id,
          title: data.title,
          description: data.description,
        })
      } else {
        error = await insertProject({
          title: data.title,
          description: data.description,
          user_id: user.id,
          target_days: data.numberOfDays,
          allow_skipped_days: data.allowedSkips,
          completed_days: 0,
          status: PROJECT_STATUS_ACTIVE
        })
      }

      if (error) throw error
      
      reset()
      toast.success(successMessage)
      router.push(`/${slug}/projects`)
    } catch (error) {
      console.error(error)
      const errorMessage = formType === 'new' ? 'Failed to create project. Please try again later.' : 'Failed to update project. Please try again later.'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, setIsLoading, user, toast, router, reset, updateProject, insertProject])

  const onSubmit = async (data: FormData) => {
    handleFormSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Project Title</label>
        <Input
          {...register('title', {
            required: 'Title is required'
          })}
          placeholder="e.g. Learn Guitar"
          disabled={isLoading}
          className="neo-brutalism-input"
          aria-invalid={errors.title ? 'true' : 'false'}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description (Optional)</label>
        <Textarea
          {...register('description')}
          placeholder="What do you want to achieve?"
          disabled={isLoading}
          className="neo-brutalism-input"
        />
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium">Number of Days</label>
        <div className="space-y-2">
          <Slider
            value={[watch('numberOfDays')]}
            onValueChange={(value) => setValue('numberOfDays', value[0])}
            min={21}
            max={31}
            step={1}
            className={cn("neo-brutalism-slider", !!project && "opacity-50")}
            disabled={!!project}
          />
          <p className="text-sm text-muted-foreground text-center">
            {watch('numberOfDays')} days
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium">Allowed Skip Days</label>
        <div className="space-y-2">
          <Slider
            value={[watch('allowedSkips')]}
            onValueChange={(value) => setValue('allowedSkips', value[0])}
            min={0}
            max={3}
            step={1}
            className={cn("neo-brutalism-slider", !!project && "opacity-50")}
            disabled={!!project}
          />
          <p className="text-sm text-muted-foreground text-center">
            {watch('allowedSkips')} {[0, 1].includes(watch('allowedSkips')) ? 'day' : 'days'}
          </p>
        </div>
      </div>

      <Button 
        type="submit"
        className="w-full neo-brutalism-button"
        disabled={!isValid || isLoading}
      >
        {formType === 'new' ? 'Create Project' : 'Update Project'}
      </Button>
    </form>
  )
}