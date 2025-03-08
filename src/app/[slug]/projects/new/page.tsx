import NewForm from '@/components/projects/Form'

type NewProjectPageProps = {
  params: {
    slug: string
  }
}

export default async function NewProjectPage({
  params
}: NewProjectPageProps) {
  const { slug } = await params

  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Create New Project</h1>
          <p className="text-muted-foreground mt-2">
            Set up your new challenge
          </p>
        </div>

        <NewForm
          slug={slug}
        />
      </div>
    </div>
  )
}