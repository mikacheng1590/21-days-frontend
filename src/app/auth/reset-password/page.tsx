'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AuthError } from '@supabase/supabase-js'
import { SUPABASE_AUTH_ERROR_SAME_PASSWORD } from '@/lib/supabase/constants'

type FormData = {
  password: string
  confirmPassword: string
}

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid }
  } = useForm<FormData>({
    mode: 'onChange'
  })
  
  const password = watch('password')
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      // if (event !== "PASSWORD_RECOVERY") {
      //   router.push('/')
      // }
    })
  }, [router])

  const onSubmit = async (data: FormData) => {
    if (isLoading) return
    
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password
      })

      if (error) {
        throw error
      }

      toast.success('Password updated successfully')
      router.push('/')
    } catch (error) {
      console.error(error)

      const errMsg = error instanceof AuthError && error.code === SUPABASE_AUTH_ERROR_SAME_PASSWORD ? error.message : 'Failed to update password'
      toast.error(errMsg)
    } finally {
      reset()
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Set New Password</h1>
          <p className="text-muted-foreground mt-2">
            Please enter your new password
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="New Password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              disabled={isLoading}
              aria-invalid={errors.password ? 'true' : 'false'}
              aria-describedby={errors.password ? 'passwordError' : undefined}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Confirm New Password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => 
                  value === password || 'Passwords do not match'
              })}
              disabled={isLoading}
              aria-invalid={errors.confirmPassword ? 'true' : 'false'}
              aria-describedby={errors.confirmPassword ? 'confirmPasswordError' : undefined}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={!isValid || isLoading}
          >
            Update Password
          </Button>
        </form>
      </div>
    </div>
  )
}