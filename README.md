# Portfolio Site

Next.js + TypeScript + Tailwind CSS.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

```
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_API_KEY=
```

## Build

```bash
npm run build
npm run start
```

## Deploy (Render)

- Build command: `npm install && npm run build`
- Start command: `npm run start`
- Add the environment variables above under the service's Environment tab
