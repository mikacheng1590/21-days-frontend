import { redirect } from 'next/navigation'
import Form from '@/components/projects/Form'
import { serverUserService } from '@/lib/supabase/server/user'

type NewProjectPageProps = {
  params: {
    slug: string
  }
}

export default async function NewProjectPage({
  params
}: NewProjectPageProps) {
  const { slug } = await params
  const isPageOwner = await serverUserService.isPageOwner(slug)

  if (!isPageOwner) {
    redirect('/error')
  }

  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Create New Project</h1>
          <p className="text-muted-foreground mt-2">
            Set up your new challenge
          </p>
        </div>

        <Form
          slug={slug}
        />
      </div>
    </div>
  )
}