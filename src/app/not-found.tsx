import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-xl w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            404 - Page Not Found
          </h1>
          
          <div className="space-y-6 text-base text-muted-foreground sm:text-lg">
            <p>
              The page you're looking for doesn't exist or has been moved.
            </p>
            
            <p>
              You can return to the homepage and try again.
            </p>
          </div>
        </div>

        <Link href="/" className="block">
          <Button 
            variant="default" 
            size="lg"
            className="w-full sm:w-auto"
          >
            Back to Homepage
          </Button>
        </Link>
      </div>
    </div>
  )
}
