# Agricultural Statistics - Caraga

Responsive React + TypeScript application for AgriStat Caraga. The GitHub Pages frontend talks to a Cloudflare Worker API backed by D1 accounts and private R2 profile photos.

## Run locally

Node.js 22 or newer is required. `.env.local` sets the Vite API base to `/api`; Vite proxies that path to the local Worker on port 8787. `.dev.vars` contains local-only Worker settings and is excluded from Git. A local development Super Admin is preconfigured there:

- Email: `admin@agristat.local`
- Password: `LocalOnly-AgriStat-2026!`

Run the schema migration once, then start the API and frontend in separate terminals:

```powershell
npm ci
npm run db:migrate:local
npm run dev:api
```

```powershell
npm run dev
```

Open `http://localhost:5173`. Local D1 and R2 use Wrangler's local emulation; local records and uploaded photos are not production data. For a fresh clone, copy `.dev.vars.example` to `.dev.vars` before starting the Worker.

## Deploy

The current production Worker and D1 database are provisioned in the configured Cloudflare account, and the production schema is migrated. `VITE_API_BASE_URL` and `CLOUDFLARE_ACCOUNT_ID` are configured as GitHub Actions repository variables. The Worker was initially deployed through the authenticated Wrangler CLI session; GitHub Actions will deploy future Worker changes once a fresh `CLOUDFLARE_API_TOKEN` is added as a repository Actions secret.

For a new Cloudflare account or a separate deployment:

1. Create a D1 database with `npx wrangler d1 create agristat-caraga` and put its returned UUID in `wrangler.jsonc`.
2. Create the R2 bucket with `npx wrangler r2 bucket create agristat-caraga` if it does not already exist.
3. Apply the schema with `npm run db:migrate:remote`.
4. Set Worker secrets using `npx wrangler secret put NAME` (Wrangler prompts for each value): `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD`, `SUPER_ADMIN_NAME`, and `CREDENTIAL_ENCRYPTION_KEY`. Use a new, unique Super Admin password of at least 12 characters. Generate a 32-byte encryption key with `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`.
5. Add the GitHub Actions secret `CLOUDFLARE_API_TOKEN`. Generate a fresh API token with only the permissions needed to deploy Workers and manage the configured D1/R2 resources; do not reuse credentials previously shared in chat. Add Actions variables `CLOUDFLARE_ACCOUNT_ID` and `VITE_API_BASE_URL` with the Cloudflare account ID and deployed Worker URL ending in `/api`.
6. Ensure GitHub Pages is configured to deploy with GitHub Actions, then push to `main`. The workflow validates the API URL, builds and deploys Pages, and deploys the Worker only when both Cloudflare Actions secrets are present.

The Worker `APP_ORIGIN` in `wrangler.jsonc` must exactly match the public Pages origin. The Cloudflare R2 binding accesses the bucket directly; the S3 endpoint and S3 secret access key are not needed in the app.

## Security

Credentials included in the initial setup request must be treated as exposed. Rotate the Cloudflare API token and R2 access key in Cloudflare before deployment, and do not reuse the exposed initial Super Admin password. Never put Cloudflare tokens, R2 keys, or production bootstrap credentials in `.env`, GitHub variables, or committed files; use Worker secrets and GitHub Actions secrets. The local `.dev.vars` credentials are development-only and must never be copied to production.

Passwords are PBKDF2-hashed. Registration passwords are generated per account and encrypted at rest only so the Super Admin can view them during onboarding; they are removed when the user changes their password. Sessions are stored as token hashes and expire after seven days. Profile objects are private and available only to the account owner or Super Admin; image type and 5 MB limits are enforced by the API.

## Checks

```powershell
npm run build
npm run worker:check
npm run lint
```
