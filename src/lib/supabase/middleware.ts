import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server/client'
import { getUser, getSlugByUserId } from '@/lib/supabase/server/auth'

export const updateSession = async (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = await createClient()

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const user = await getUser()

  const needEditAccessPathNames = ['/new', '/edit']
  const url = request.nextUrl.clone()

  // protect routes that are only accessible to logged in users
  if (
    !user &&
    request.nextUrl.pathname !== '/' &&
    !request.nextUrl.pathname.startsWith('/auth') &&
    (
      needEditAccessPathNames.filter(path => request.nextUrl.pathname.endsWith(path)).length > 0 ||
      request.nextUrl.pathname === '/welcome'
    )
  ) {
    // no user, potentially respond by redirecting the user to the login page
    url.pathname = '/'
    return NextResponse.redirect(url)
  }   

  if (user) {
    const slug = await getSlugByUserId(user.id)

    // check if user has set up setting
    if (request.nextUrl.pathname !== '/welcome' && !slug) {
      url.pathname = '/welcome'
      return NextResponse.redirect(url)
    }

    // redirect to projects page if user is logged in and has set up setting
    if (request.nextUrl.pathname === '/' && slug) {
      url.pathname = `/${slug}/projects`
      return NextResponse.redirect(url)
    }
    
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}