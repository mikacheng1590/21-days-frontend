import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Oops! Something went wrong
          </h1>
          
          <div className="space-y-6 text-base text-muted-foreground sm:text-lg">
            <p>
              We encountered an unexpected error while processing your request.
              This could be due to:
            </p>
            
            <ul className="list-disc text-left space-y-2 pl-4">
              <li>A temporary system issue</li>
              <li>An expired or invalid session</li>
              <li>Missing or incorrect permissions</li>
            </ul>
            
            <p>
              Don't worry! You can try again by returning to the homepage.
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