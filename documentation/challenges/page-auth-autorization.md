There are three types of pages in this application, each with distinct rendering and access control behaviors:

1. Public Pages (Universal Content)
Access: Available to everyone, whether logged in or not.
Rendering: The same content is displayed for all users.
Examples: Login page

2. Public Pages with User-Specific Content
Access: Available to everyone, but content varies based on authentication & ownership.
Rendering:
If not logged in, show generic content.
If logged in but not the page owner, still show generic content.
If page owner, show personalized content (e.g., additional details or editing controls).
Examples: A user projects page where visitors see a public version, but the owner sees full details and an edit option.

3. Private Pages (Restricted Access to Owner Only)
Access: Only available to the logged-in user who owns the page (authorized user).
Rendering: Completely blocked for unauthorized users.
Examples: Create and edit projects/ entries page.

# Challenges
- Should I implement the logic of checking logged in user and user ownership in the middleware or in the page?
- How can I reduce the number of times I need to query the database for user settings?
- Make sure user data is accessible to both client and server components. (was using context but realized it's not the best way to do it when I need the data in the server components)

# Solution
middleware: allow/ disallow users to land on the page (db query: get user and get username by user)
- disallow unauthenticated users from landing on /new, /edit, /welcome (redirect to /)

page level: check if user is owner of the page (db query: check if path username is valid AND check if current user is the owner of the page)
- allow everyone to access /projects, /entries, but check if they own the page to display different content

global client component level (e.g. navbar): only need to check if user is authenticated since it's only different between authenticated and unauthenticated users (use client side event: *supabase.auth.onAuthStateChange*)

# Additional Notes
- Thought about using context with *supabase.auth.onAuthStateChange* to get user data and check if user is owner, but the event is triggered every time the page is navigated (e.g. switching between windows), so db query becomes excessive; and it's not recommended to use async functions in the event handler (https://supabase.com/docs/reference/javascript/auth-onauthstatechange).