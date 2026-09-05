# Dashboard App (React Native / Expo)

Ye APK backend ko control karne ka dashboard hai — login, accounts add karna,
schedules set karna, activity log dekhna.

## Setup (ek dafa)

1. **Backend URL set karo:** `src/services/api.js` mein `BASE_URL` ko apne
   Render backend ke live URL se replace karo.

2. **Expo account banao:** https://expo.dev pe free account.

3. **EAS CLI install karo (local):**
   ```bash
   npm install -g eas-cli
   eas login
   ```

4. **Project link karo:**
   ```bash
   cd dashboard-app
   eas init
   ```
   Ye `app.json` mein `extra.eas.projectId` fill kar dega.

5. **GitHub Secret add karo** (APK auto-build ke liye):
   - `eas login` ke baad token lo: `eas whoami --json` ya expo.dev dashboard
     → Access Tokens se banao
   - GitHub repo → Settings → Secrets → Actions → naya secret:
     `EXPO_TOKEN` = wo token

## APK Build

**Automatic:** `dashboard-app/` folder mein koi bhi push karo `main` branch pe —
GitHub Actions khud EAS build trigger kar dega. Build complete hone par
expo.dev dashboard pe (Builds section) APK download link milega.

**Manual (local se trigger):**
```bash
cd dashboard-app
eas build --platform android --profile preview
```

## Notes
- Pehla build ~10-15 min leta hai (EAS cloud pe)
- Free EAS tier mein monthly build limit hai — testing ke dauran zaroorat
  ke hisaab se hi build trigger karo
