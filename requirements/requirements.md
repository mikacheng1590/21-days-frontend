# Project Overview
An app with RWD for people to build habit. Users can create a habit (it's called "project" in the app), and set a target day of doing it (21-31 days). Under each project, user can input entry daily (it's called "entry" in the app). There can be 1-3 days off, but if user input entry for a number of days off (user cam set the number of days off in the project), the project will be over. Whenever user misses a day. an email will be sent to user to remind them to get back on track.

# Core Functionalities
1. Only logged in user can access the app
2. User can create a project (fields: name, description, target days (21-31 days), days off (1-3 days))
3. User can input entry daily (fields: image, description)
4. Whenever user misses a day, an email will be sent to user to remind them to get back on track.
5. When user input entry for a number of days off, the project will be over.

# URL Structure
1. / login signup page for non-logged in user OR redirect user to /{username} for logged in user
2. /{username} dashboard page
3. /{username}/projects page for projects
4. /{username}/project/create page for creating a project (only logged in user can access)
5. /{username}/project/:id page for viewing a project which shows the list of entries
6. /{username}/entry/:id page for viewing the entry details

# Libraries
1. React
2. Next.js
3. Tailwind CSS
4. Supabase for database and authentication
5. React Hook Form for form handling
6. shadcn/ui for components

# Doc

# Current File Structure
21-DAYS-FRONTEND/
├── .next/
├── node_modules/
├── public/
├── requirements/
│   └── requirements.md
├── src/
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── lib/
│       └── utils.ts
├── .env.local
├── .env.sample
├── .gitignore
├── components.json
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json