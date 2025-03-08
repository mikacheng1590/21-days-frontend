# Current situation
Error handling of supabase functions on project side is super unstandardized. Some functions returns error from supabase (error ?? data), but sometimes when there is error, null is returned instead (error ? null : data) so the error is missing making it hard to debug.

# Improvement
- Create a wrapper to hold both error and data which can be null if they do not exist (actually just like supabase response)
