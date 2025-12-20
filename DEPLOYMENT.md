# Deployment Guide - GitHub Pages

## Setup Instructions

### Step 1: Update the Homepage URL
Edit `package.json` and replace `<YOUR_USERNAME>` with your actual GitHub username:

```json
"homepage": "https://YOUR_USERNAME.github.io/Online-Shopping-Management-System/"
```

### Step 2: Update Vite Configuration
The `vite.config.ts` is already configured with the correct base path:
```typescript
base: '/Online-Shopping-Management-System/'
```

### Step 3: Deploy to GitHub Pages

#### Option A: Using npm script (Recommended)
```bash
npm run deploy
```

This will:
1. Build the production bundle
2. Deploy to GitHub Pages automatically

#### Option B: Manual deployment
```bash
npm run build
npx gh-pages -d dist
```

### Step 4: Configure GitHub Repository

1. Go to your GitHub repository settings
2. Navigate to **Pages** section
3. Select **Deploy from a branch**
4. Choose branch: **gh-pages**
5. Select folder: **/ (root)**
6. Click **Save**

### Step 5: Access Your Site

After deployment, your site will be live at:
```
https://YOUR_USERNAME.github.io/Online-Shopping-Management-System/
```

## First Time Deployment Checklist

- [ ] Fork/push this repository to GitHub
- [ ] Update GitHub username in `package.json` homepage field
- [ ] Run `npm run deploy`
- [ ] Enable GitHub Pages in repository settings
- [ ] Wait 1-2 minutes for the site to build and deploy
- [ ] Visit your deployment URL

## Troubleshooting

### Site shows 404
- Check that GitHub Pages is enabled in repository settings
- Verify the base path matches your repository name in `vite.config.ts`
- Wait a few minutes for GitHub Pages to finish building

### Assets not loading
- The `base: '/Online-Shopping-Management-System/'` path in `vite.config.ts` handles this
- Ensure you're using the correct repository name

### Need to redeploy
```bash
npm run deploy
```

## Environment Variables

If you add any environment variables, create a `.env` file:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_key
```

These will be available as `import.meta.env.VITE_*` in your code.

## Next Steps

1. Update `<YOUR_USERNAME>` in package.json
2. Run `npm run deploy`
3. Enable GitHub Pages in your repository settings
4. Share your live URL!

---

**Your deployment URL will be:** `https://<YOUR_USERNAME>.github.io/Online-Shopping-Management-System/`
