# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Supabase configuration

Create a `.env` file in the project root using `.env.example` as a template. Set
`VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to the URL and publishable
key for the same Supabase project. Run `supabase-schema.sql` in the Supabase SQL
Editor to create the profile table and its row-level security (RLS) policies.

The project URL and publishable key are public client configuration: Vite embeds
them in the browser bundle, so they cannot be hidden from visitors. This is expected.
Never put a Supabase secret key or legacy `service_role` key in a `VITE_` variable,
the frontend, or GitHub. Data access must be protected by RLS; the supplied SQL
limits profile access to the authenticated owner.

The local `.env` is intentionally ignored by Git. For Vercel, add both variables in
**Project Settings → Environment Variables** for each environment you deploy
(Production, Preview, and Development as applicable), then redeploy. Changing
Vercel environment variables does not update an existing deployment.

Before pushing, verify that `.env` is ignored with `git check-ignore -v .env` and
that it is not staged. Commit `.env.example`, not `.env`. If a secret key was ever
committed or deployed, rotate it in Supabase; deleting it from the latest commit
does not remove it from Git history.

### Production security checklist

- In Supabase **Authentication → URL Configuration**, set the production Site URL
  and allow only the production domain and the exact callback URLs you use.
- Require email confirmation and configure the password/security protections
  available for your Supabase project.
- Test RLS with two separate accounts: each should read and change only their own
  profile. Unauthenticated requests should not read or write profiles.
- In Vercel, add only the URL and publishable key as frontend environment
  variables. Do not add a secret/service-role key to Vercel variables prefixed
  with `VITE_`.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
