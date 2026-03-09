# Workshop Landing Page

A component-based landing page with an admin panel. Built with React, Bootstrap, and Supabase.

## Features

- **Landing page**: Logo, title, hero, instructor section, countdown, benefits, registration form (name, email, phone), bonuses, footer. All content and theme are configurable.
- **Admin panel** (`/admin`): Edit theme colors, logo, title, images (upload or URL), instructor details, featured logos, bonus images. View all form submissions.
- **Form**: Submissions are stored in Supabase and listed in the admin panel.
- **Theme**: Primary/secondary/background colors managed in admin; applied via CSS variables.

## Setup

1. **Install and run**
   ```bash
   npm install
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000). Without Supabase the app uses default config and form submit will show a message.

2. **Supabase**
   - Create a project at [supabase.com](https://supabase.com).
   - In **SQL Editor**, run the contents of `supabase-setup.sql` to create:
     - `site_config` (id, config JSONB) for admin-editable content
     - `registrations` (name, email, phone) for form data
     - Storage bucket `images` for uploads
   - In **Settings → API**: copy Project URL and anon key.

3. **Environment**
   - Copy `.env.example` to `.env`.
   - Set:
     - `REACT_APP_SUPABASE_URL`
     - `REACT_APP_SUPABASE_ANON_KEY`
   - Restart `npm start`.

4. **Admin**
   - Go to **Admin** (link in header) or `/admin`.
   - Change colors, logo, title, images; click **Save all config**.
   - Upload images (they go to Supabase Storage and URLs are saved in config).
   - View form submissions in the table and use **Refresh list** to update.

## Project structure

- `src/config/defaultConfig.js` – default content/theme (fallback when Supabase is not used).
- `src/context/ConfigContext.js` – loads/saves config from Supabase, provides it to the app.
- `src/components/landing/` – reusable sections: Header, HeroSection, InstructorSection, CountdownSection, FeaturedInSection, BenefitsSection, WhatWillChangeSection, LearningOutcomesSection, BonusesSection, RegistrationForm, FooterSection.
- `src/pages/LandingPage.js` – composes all landing sections.
- `src/pages/AdminPage.js` – admin UI for config and submissions.
- `src/lib/supabase.js` – Supabase client (optional if env vars are set).

## Tech stack

- React 19, React Router, Bootstrap 5, Supabase (database + storage).
