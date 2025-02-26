# Enter page
- Check if the project
  1. Exists and is active for this user [TABLE_PROJECTS] --> if no --> error page
  2. Has an entry for today by getting the latest entry [get `day` from TABLE_ENTRIES] --> if the latest entry is today --> redirect them to today's entry edit page with a toast message

- Get today's day [`day` + 1] and pass it to the form

# Submit entry
- Check if the project
  1. Exists and is active for this user [TABLE_PROJECTS] --> if no --> throw error
  2. Next day entry is the same as the day in the form

- Insert and update
  1. Insert to entries and entries_images table
  2. Update completed_days in projects table

- Update project status
  1. Check if project is completed (today's day === target_days) --> if yes --> update project status to PROJECT_STATUS_COMPLETED

* When creating rpc for entry insert and project status update, insert works fine while update does not work. Made sure the name of the column to be updated is right, the condition is fulfilled but still no luck. Turns out it's because there is no RLS policy for [TABLE_PROJECTS] to update the column. For security reason, the rpc won't throw any errors if the RLS policy does not allow certain action, it will just not run the statement. Issue is fixed after adding policy which allows authenticated users to update the column. *