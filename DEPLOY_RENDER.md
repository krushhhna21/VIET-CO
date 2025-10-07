# Deploying VIET-CO to Render

This guide covers deploying the combined Express (API + static) + Vite (React) + Drizzle/Postgres stack to Render using the included `render.yaml` blueprint.

## 1. Prerequisites
- GitHub repository pushed (public or private)
- Render account (https://render.com)
- Strong JWT secret ready (>= 32 chars)

## 2. Files of Interest
- `render.yaml` – Infrastructure as code: provisions a Postgres DB + a Node web service.
- `package.json` – Build + start scripts. `build` bundles server + client. `start` runs migrations (`db:push`) then boots server.
- `server/index.ts` – Serves static client build under `dist/client` in production.

## 3. One-Time Setup (Dashboard)
1. Log into Render.
2. Click New + Blueprints.
3. Point to your repo (make sure `render.yaml` is in root).
4. Review resources:
   - Web Service: `viet-co-app`
   - Database: `viet-co-db`
5. Click Apply.
6. After creation, go to the web service -> Environment -> Add `JWT_SECRET` (because it is marked `sync: false`).
7. (Optional) Set any other env vars: `HOST=0.0.0.0` (default is fine), custom analytics keys, etc.

## 4. Environment Variables
| Key | Description | Required | Example |
|-----|-------------|----------|---------|
| NODE_ENV | Must be `production` for static serving | Yes | production |
| DATABASE_URL | Injected from the Render Postgres | Yes | (auto) |
| JWT_SECRET | Secret used to sign JWT tokens | Yes | (generate) |
| HOST | Bind host (defaults to 0.0.0.0) | No | 0.0.0.0 |
| PORT | Provided by Render (DO NOT hardcode) | Auto | (Render sets it) |

## 5. Build & Start Flow
Render runs the following (from `render.yaml`):
```
Build: npm install && npm run build
Start: node dist/server/index.js
```
During start the script `npm run start` (not used here) would run `db:push` before launching. If you want migrations on each deploy, either:
- Change `startCommand` to `npm run start` (will run `db:push`), OR
- Add a `preDeployCommand: npm run db:push` to `render.yaml`.

Currently, the blueprint runs only the compiled server. Choose one migration strategy and stay consistent.

## 6. Migrations (Drizzle)
If schema changes:
```
npm run db:push
```
Commit the new migrations (if using generated migrations) or rely on push. For production discipline, consider adding a `migrate` script using drizzle-kit migrations instead of push.

## 7. Logs & Debugging
- View service logs in Render dashboard.
- Health check: `/health` returns `{ status: 'ok' }`.
- Remove or disable any debug endpoints before going fully public.

## 8. Local vs Production Differences
| Feature | Local | Render |
|---------|-------|--------|
| Port | 3000 | Random (exposed) | 
| Static Client | Served after `npm run build` or dev via Vite | Served from `dist/client` |
| Vite Dev Server | Enabled in dev (hot reload) | Not used |
| Logging | Verbose | Trim debug logs (set `DEBUG_LOGS=false`) |

## 9. Optional: Split Frontend & Backend
Later you can:
- Turn current service into API only (remove static serve).
- Create a Render Static Site pointing to `client/` with build command:
  `npm install && npm run build:client`
  and publish directory: `client/dist`.
- Set `VITE_API_BASE_URL` in Static Site env vars pointing to API URL.

## 10. Rollback & Redeploy
- Use the Deploys tab to roll back to any successful deploy.
- Changing `render.yaml` requires a new blueprint deploy to apply structural changes.

## 11. Generating a Strong JWT Secret
Use any of:
```
openssl rand -base64 48
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```
Set it once; rotating later will invalidate existing tokens (force re-login).

## 12. Common Pitfalls
| Issue | Cause | Fix |
|-------|-------|-----|
| 502 after deploy | Build succeeded but server crashed | Check logs for DB URL or JWT secret missing |
| Static files 404 | Client build not copied | Ensure `copy-client` script runs in `build` chain |
| Auth always fails | JWT_SECRET not set in service | Add env var & redeploy |
| DB errors | Migration mismatch | Run `db:push` locally, commit, or add preDeployCommand |

## 13. Next Improvements
- Add a proper migration workflow (generate migrations instead of push).
- Introduce rate limiting (login endpoints).
- Move refresh tokens to httpOnly cookies (security upgrade).

## 14. Tear Down
- Deleting the blueprint does NOT delete the DB automatically; remove database resource explicitly if desired.

---
Deploy complete? Open an issue or ask for the next platform (Fly.io, Vercel split, etc.) if you want multi-region or edge setup.
