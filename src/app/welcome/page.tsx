'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SUPABASE_DB_ERROR_DUPLICATE_KEY } from '@/lib/constants'
import { useAuth } from '@/components/providers/AuthProvider'
import { trimText, slugifyText } from '@/lib/text/utils'
import { clientUserService } from '@/lib/supabase/client/user'

type FormData = {
  email: string
  username: string
}

export default function Welcome() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    reset
  } = useForm<FormData>({
    mode: 'onSubmit'
  })

  useEffect(() => {
    if (user && user.email) {
      setValue('email', user.email)
    }
  }, [user, setValue])

  const onSubmit = useCallback(async (data: FormData) => {
    if (!user || isLoading) return

    setIsLoading(true)
    
    try {
      const cleanedUsername = trimText(data.username)
      const slug = slugifyText(cleanedUsername)

      const { error } = await clientUserService.insertUserSetting(user.id, data.email, cleanedUsername, slug)

      if (error) throw error

      reset()
      toast.success('Settings saved successfully!')
      router.push(`/${slug}/projects`)
    } catch (error: any) {
      console.error(error)

      const errMsg = error?.code === SUPABASE_DB_ERROR_DUPLICATE_KEY ? 'Username already exists. Please choose another username.' : 'Failed to save settings'
      toast.error(errMsg)
    } finally {
      setIsLoading(false)
    }
  }, [user, isLoading, setIsLoading, trimText, slugifyText, setValue, reset, toast, router, clientUserService.insertUserSetting])

  return (
    <div className="flex items-center justify-center flex-1 p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome to 21 Days</h1>
          <p className="text-muted-foreground mt-2">
            Please complete your profile to continue
          </p>
        </div>

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
              aria-invalid={errors.username ? 'true' : 'false'}
              aria-describedby={errors.username ? 'username-error' : undefined}
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              disabled={isLoading}
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={!isValid || isLoading}
          >
            Save Settings
          </Button>
        </form>
      </div>
    </div>
  )
}
