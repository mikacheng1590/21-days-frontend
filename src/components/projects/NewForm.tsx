'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/components/providers/AuthProvider'
import { TABLE_PROJECTS, PROJECT_STATUS_ACTIVE } from "@/lib/supabase/constants"
import { createClient } from '@/lib/supabase/client/client'

type FormData = {
  title: string
  description: string
  numberOfDays: number
  allowedSkips: number
}

export default function NewForm() {
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
      numberOfDays: 21,
      allowedSkips: 0
    }
  })

  const onSubmit = async (data: FormData) => {
    if (isLoading) return
    setIsLoading(true)

    if (!user) {
      toast.error('Please login to create a project')
      setIsLoading(false)
      router.push('/')
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from(TABLE_PROJECTS)
        .insert([
          {
            title: data.title,
            description: data.description,
            user_id: user.id,
            target_days: data.numberOfDays,
            allow_skipped_days: data.allowedSkips,
            status: PROJECT_STATUS_ACTIVE,
            completed_days: 0
          }
        ])
      
      if (error) throw error
      
      reset()
      toast.success('Project created successfully!')
      // router.back()
    } catch (error) {
      console.error(error)
      toast.error('Failed to create project')
    } finally {
      setIsLoading(false)
    }
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
            className="neo-brutalism-slider"
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
            className="neo-brutalism-slider"
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
        Create Project
      </Button>
    </form>
  )
}