# Amr Essam — Portfolio (Next.js + React + GSAP + Supabase)

## Run
1. Node 20+. `npm install`
2. Copy `.env.example` to `.env.local` and fill the three values.
3. In Supabase → SQL editor, run `supabase/schema.sql`.
4. Copy your files into `public/`: `images/` (avatar.png, logo1-6.jpg, car1-8.jpg, client1-2.jpg) and `amr_essam_cv.pdf`.
5. `npm run dev` (http://localhost:3000), `npm test`, `npm run build`.

## Deploy
Use Vercel (or any Node host). GitHub Pages is static only, so the `/api/contact` backend will not run there.
Set the same three env vars in the host dashboard. `SITE_URL` must equal your deployed origin.

## Protection
Security headers + CSP (next.config.mjs), server-only Supabase service key, RLS enabled with no public policies,
input validation, honeypot field, per-IP rate limit, origin check, 10 KB body cap.
