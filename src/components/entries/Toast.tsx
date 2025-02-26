'use client'

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { toast } from "react-toastify"

  export default function Toast() {
  const searchParams = useSearchParams()
  const warning = searchParams.get('warning')

  useEffect(() => {
    if (warning && warning === 'potential-entry-for-today') {
      toast.warn('You have already created an entry for today. Go to edit today\'s entry.')
    }
  }, [])
  return (
    <></>
  )
}