'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function DeleteDialog({
  deleteAction
}: {
  deleteAction: () => Promise<void>
}) {
  const [open, setOpen] = useState(false)

  const handleConfirm = async () => {
    await deleteAction()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2 !w-6 !h-6"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1">Caution!</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this project?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="noShadow" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="outline" onClick={() => handleConfirm()}>Yes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}