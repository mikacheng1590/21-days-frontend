'use client'

import { useCallback, useState } from "react"
import { useForm } from 'react-hook-form'
import { toast } from "react-toastify"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { clientUserService } from "@/lib/supabase/client/user"

type FormProps = {
  username: string
  preferredEmail: string
  userId: string
}

export default function Form({
  username,
  preferredEmail,
  userId
}: FormProps) {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    mode: 'onSubmit',
    defaultValues: {
      username: username || '',
      preferredEmail: preferredEmail || ''
    }
  })
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = useCallback(async (data: any) => {
    if (isLoading) return
    try {
      setIsLoading(true)
      const { username, preferredEmail } = data
      const { success, error } = await clientUserService.updateUserSetting(userId, preferredEmail, username)
      if (!success) {
        throw error
      }

      toast.success('User setting updated successfully.')
    } catch (error) {
      console.error(error)
      toast.error('Failed to update user setting. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, setIsLoading, clientUserService.updateUserSetting, userId, toast])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Username</label>
        <Input
          {...register('username', {
            required: 'Username is required',
            minLength: {
              value: 3,
              message: 'Username must be at least 3 characters'
            },
            pattern: {
              value: /^[a-zA-Z0-9\-\s]+$/,
              message: 'Username can only contain letters, numbers and dashes'
            }
          })}
          disabled={isLoading}
          className="neo-brutalism-input"
          aria-invalid={errors.username ? 'true' : 'false'}
        />
        {errors.username && (
          <p className="text-sm text-red-500">{errors.username.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Preferred Email</label>
        <Input
          {...register('preferredEmail', {
            required: 'Preferred Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          disabled={isLoading}
          className="neo-brutalism-input"
          aria-invalid={errors.preferredEmail ? 'true' : 'false'}
        />
        {errors.preferredEmail && (
          <p className="text-sm text-red-500">{errors.preferredEmail.message}</p>
        )}
      </div>
      <Button 
        type="submit"
        className="w-full neo-brutalism-button"
        disabled={!isValid || isLoading}
      >
        Update Profile
      </Button>
    </form>
  )
}