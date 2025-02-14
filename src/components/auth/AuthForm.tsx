'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type FormData = {
  email: string
  password: string
}

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const router = useRouter()
  const supabase = createClient()
  const { register, handleSubmit, reset } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        })

        if (error) {
          if (error.code === 'invalid_credentials') {
            toast.error('Invalid email or password')
          } else if (error.code === 'email_not_confirmed') {
            toast.warning('Please verify your email address')
          } else {
            toast.error('Failed to sign in')
          }
          throw error
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        })
        if (error) {
          const errorCode = error.code ?? 'unknown_error'
          const errors = ['email_already_exists', 'user_already_exists']
          if (errors.includes(errorCode)) {
            toast.error('Email already registered')
          } else {
            toast.error('Failed to sign up')
          }
          throw error
        }
        toast.success('Verification email sent! Please check your inbox')
        reset()
      }
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        toast.error('Failed to sign in with Google')
        throw error
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="space-y-6 w-full max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          {...register('email', { required: true })}
        />
        <Input
          type="password"
          placeholder="Password"
          {...register('password', { required: true })}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {mode === 'signin' ? 'Sign In' : 'Sign Up'}
        </Button>
      </form>

      <div className="text-center space-y-4">
        <Button
          type="button"
          variant="outline"
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