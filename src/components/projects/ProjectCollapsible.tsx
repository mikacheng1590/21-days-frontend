'use client'

import { ChevronsUpDown } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useIsMd } from '@/lib/hooks/useMediaQuery'
import StatusBadge from '@/components/projects/StatusBadge'
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
  slug: string
  id: number
} 

export function ProjectCollapsible({
  title,
  description,
  status,
  targetDays,
  completedDays,
  allowedSkippedDays,
  createdAt,
  isOwner,
  slug,
  id
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
      className="w-full md:min-w-[250px] lg:min-w-[300px] lg:max-w-[350px] space-y-2"
    >
      <div className="rounded-base flex items-center justify-between space-x-4 border-2 border-border text-mtext bg-main px-4 py-2">
        <h4 className="text-sm font-heading flex-1">
          {title}
        </h4>
        {isOwner && (
          <Link href={`/${slug}/projects/${id}/edit`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>  
          </Link>
        )}
        
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
              <StatusBadge status={status} />
            </div>
            <p className="mb-3">Started on: <br/>{convertToDate(createdAt)}</p>
            {isOwner && <p>Allowed skipped days: {allowedSkippedDays}</p>}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}