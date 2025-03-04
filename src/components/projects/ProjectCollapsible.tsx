'use client'

import { ChevronsUpDown } from 'lucide-react'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useIsMd } from '@/lib/hooks/useMediaQuery'
import { Badge } from '@/components/ui/badge'
import { PROJECT_STATUS_ACTIVE, PROJECT_STATUS_COMPLETED } from '@/lib/supabase/constants'
import { convertToDate } from '@/lib/datetime/utils'

type ProjectCollapsibleProps = {
  title: string
  description: string
  status: string
  targetDays: number
  completedDays: number
  allowedSkippedDays: number
  createdAt: string
  isOwner: boolean
} 

export function ProjectCollapsible({
  title,
  description,
  status,
  targetDays,
  completedDays,
  allowedSkippedDays,
  createdAt,
  isOwner
}: ProjectCollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false)
  const isMd = useIsMd()

  useEffect(() => {
    setIsOpen(isMd)
  }, [isMd])

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full md:min-w-[250px] lg:min-w-[300px] lg:max-w-[350px] space-y-2 relative md:sticky md:top-4 "
    >
      <div className="rounded-base flex items-center justify-between space-x-4 border-2 border-border text-mtext bg-main px-4 py-2">
        <h4 className="text-sm font-heading">
          {title}
        </h4>
        <CollapsibleTrigger asChild>
          <Button
            variant="noShadow"
            size="sm"
            className="w-9 bg-bw text-text p-0"
          >
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="space-y-2 text-mtext font-base">
        {
          description && (
            <div className="rounded-base border-2 border-border bg-main px-4 py-3 font-mono text-sm">
              {description}
            </div>
          )
        }
        <div className="rounded-base border-2 border-border bg-main px-4 py-3 font-mono text-sm">
          <div>
            <div className="flex items-center justify-between mb-3">
              <p>Progress: {completedDays} / {targetDays} days</p>
              <Badge variant={status === PROJECT_STATUS_ACTIVE ? 'ordinary' : status === PROJECT_STATUS_COMPLETED ? 'success' : 'error'}>{status}</Badge>
            </div>
            <p className="mb-3">Started on: <br/>{convertToDate(createdAt)}</p>
            {isOwner && <p>Allowed skipped days: {allowedSkippedDays}</p>}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}