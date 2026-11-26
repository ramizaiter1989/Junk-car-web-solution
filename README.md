# Junk Car Web Solution: instant-offer website for a US vehicle buyer

**Live demo:** [wayne-car-flow.vercel.app](https://wayne-car-flow.vercel.app)

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TanStack](https://img.shields.io/badge/TanStack-Start%20%C2%B7%20Router%20%C2%B7%20Query-FF4154?style=flat-square)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)

The lead-generation website for a Michigan client that buys used and junk vehicles. A visitor enters basic car data and a photo, gets an instant cash offer from the backend API, and books a pickup. It is one part of a larger product I built for this client: website, Laravel backend and React Native app.

## Highlights

- **Instant-offer flow.** A multi-step form (`react-hook-form` + `zod`) with photo upload sends the data to the offer API and shows the result straight away.
- **One codebase, several domains.** Business name, branding and contact details come from `site-config` / `site-business`, selected by host name.
- **SEO.** Server-rendered routes with TanStack Start, per-page metadata, service-area and FAQ pages, structured data for AI and search discovery (`lib/seo.ts`, `lib/ai-discovery.ts`).
- **Privacy-aware analytics.** Google Consent Mode, and first-party click / page-view tracking that only runs where it is enabled (`lib/google-consent.ts`, `lib/website-tracking.ts`).
- **Resilience.** Error capture and custom error pages.

## Stack

React 19 · TanStack Start / Router / Query · Tailwind CSS 4 · shadcn/ui · react-hook-form · zod · Vite 7 · Vercel

## Run locally

```bash
cp .env.example .env   # set VITE_OFFER_API_URL
npm install
npm run dev
```

The first scaffold was generated with Lovable. The routing, offer flow, multi-domain config, tracking and SEO were built on top of it.

## Author

**Rami Zeaiter**, Lead Full-Stack Developer & Tech Lead · [rami-z-company.com](https://rami-z-company.com)
