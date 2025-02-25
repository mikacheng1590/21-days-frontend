'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AuthError } from '@supabase/supabase-js'
import { SUPABASE_AUTH_ERROR_INVALID_CREDENTIALS, SUPABASE_AUTH_ERROR_EMAIL_NOT_CONFIRMED, SUPABASE_AUTH_ERROR_USER_ALREADY_EXISTS, SUPABASE_AUTH_ERROR_EMAIL_ALREADY_EXISTS } from '@/lib/supabase/constants'

type FormData = {
  email: string
  password: string
}

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const router = useRouter()
  const supabase = createClient()
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors, isValid }
  } = useForm<FormData>({
    mode: 'onSubmit'
  })

  const handleEmailAuth = useCallback(async (data: FormData) => {
    if (isLoading) return

    setIsLoading(true)

    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword(data)

        if (error) {
          throw error
        }
      } else {
        const { error } = await supabase.auth.signUp(data)

        if (error) {
          throw error
        }

        toast.success('Verification email sent! Please check your inbox')
      }
      
      router.refresh()
    } catch (error) {
      console.error(error)
      let errMsg = 'Something went wrong. Please try again later.'

      if (error instanceof AuthError) {
        switch (error.code) {
          case SUPABASE_AUTH_ERROR_INVALID_CREDENTIALS:
            errMsg = 'Invalid email or password'
            break
          case SUPABASE_AUTH_ERROR_EMAIL_NOT_CONFIRMED:
            errMsg = 'Please verify your email address'
            break
          case SUPABASE_AUTH_ERROR_USER_ALREADY_EXISTS:
            errMsg = 'User already exists'
            break
          case SUPABASE_AUTH_ERROR_EMAIL_ALREADY_EXISTS:
            errMsg = 'Email already exists'
            break
          default:
            errMsg = 'Something went wrong. Please try again later.'
            break
        }
      }

      toast.error(errMsg)
      resetField('password')
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, setIsLoading, resetField, mode, setMode, supabase, router])

  const onSubmit = async (data: FormData) => {
    handleEmailAuth(data)
  }

  const handleGoogleLogin = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) {
        throw error
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to sign in with Google')
    }
  }, [supabase])

  return (
    <div className="space-y-6 w-full max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Email"
            {...register('email', {
              required: 'Email is required',
              ...(mode === 'signup' && {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })
            })}
            disabled={isLoading}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Password"
            {...register('password', {
              required: 'Password is required',
              ...(mode === 'signup' && {
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })
            })}
            disabled={isLoading}
            aria-invalid={errors.password ? 'true' : 'false'}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={!isValid || isLoading}
        >
          {mode === 'signin' ? 'Sign In' : 'Sign Up'}
        </Button>
      </form>

      <div className="text-center space-y-4">
        <Button
          type="button"
          variant="neutral"
          className="w-full"
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </Button>

        <div className="flex flex-col space-y-2 text-sm">
          <Link 
            href="/auth/forgot-password"
            className="text-blue-500 hover:underline"
          >
            Forgot Password?
          </Link>
          
          <p>
            {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
            <button
              className="text-blue-500 hover:underline"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            >
              {mode === 'signin' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
} 