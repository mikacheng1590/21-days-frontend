'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

type FormData = {
  password: string
  confirmPassword: string
}

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { register, handleSubmit, watch } = useForm<FormData>()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(event)
      // if (event !== "PASSWORD_RECOVERY") {
      //   router.push('/')
      // }
    })
  }, [router])

  const onSubmit = async (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password
      })

      if (error) {
        toast.error('Failed to update password')
        throw error
      }

      toast.success('Password updated successfully')
      router.push('/')
    } catch (error) {
      console.error(error)
    } finally {
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
          <Input
            type="password"
            placeholder="New Password"
            {...register('password', { required: true, minLength: 6 })}
          />
          <Input
            type="password"
            placeholder="Confirm New Password"
            {...register('confirmPassword', { required: true })}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            Update Password
          </Button>
        </form>
      </div>
    </div>
  )
}