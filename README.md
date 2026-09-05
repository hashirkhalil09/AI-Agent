# AI Social Agent — Phase 1

Ek system jo AI se social media posts generate karta hai, schedule karta hai, aur
fix time pe multiple accounts/platforms pe auto-publish karta hai. Owner-only
dashboard se sab kuch control hota hai.

## Structure

```
ai-social-agent/
├── backend/          → Node.js + Express API + Scheduler (Render pe deploy hoga)
└── dashboard-app/     → React Native (Expo) app → APK banega GitHub Actions se
```

## Phase 1 Scope
- Owner-only login (single admin, JWT based)
- Accounts management (multiple pages/profiles per platform)
- AI content generation: Text + AI Image (Claude API + image API placeholder)
- Auto-publish scheduler (cron based, per-account schedule)
- Activity log (har post ka record: kab bana, kab publish hua, status)
- Platform connectors: stub/interface ready — Meta, YouTube, X, LinkedIn, TikTok
  (Phase 1 mein sirf structure hai; live API keys phase 2 mein daalni hain)

## Quick Start — Backend

```bash
cd backend
cp .env.example .env      # apni values daalo
npm install
npx prisma migrate dev    # database tables banayega
npm run dev                # local test (http://localhost:5000)
```

## Deploy — Render.com

1. GitHub pe pura repo push karo
2. Render.com → New → **Blueprint** → is repo ko select karo
   (root mein `render.yaml` hai, Render khud web service + worker + postgres bana dega)
3. Render dashboard mein Environment Variables fill karo (`.env.example` dekho)
4. Deploy — har `git push` pe auto-redeploy hoga

## Build APK — Dashboard App

```bash
cd dashboard-app
npm install
```

GitHub pe push karne ke baad, `.github/workflows/eas-build.yml` workflow
automatically APK build karega (EAS Build cloud service use karta hai — free tier
available). Build complete hone par Expo dashboard (expo.dev) pe download link
milega. Setup detail `dashboard-app/README.md` mein hai.

## Next Steps (baad mein)
- Har platform ka Developer App banana (Meta, Google Cloud, X, LinkedIn, TikTok)
- `.env` mein unki API keys daalna
- `backend/src/services/platforms/*.js` files mein real API calls likhna
  (abhi stub/mock hain taake system test ho sake bina keys ke)
- Engagement (comment/like) automation — manually manage karoge, jaisa decide hua
