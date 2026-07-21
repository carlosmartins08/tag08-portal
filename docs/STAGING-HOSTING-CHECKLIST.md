# TAG08 staging package

## Host setup

1. Create `staging.tag08.com.br` with HTTPS and proxy it to the Node service on port `3000`.
2. Create a PostgreSQL database dedicated to staging. Do not reuse local Docker or production credentials.
3. Copy the variable names from `.env.staging.example` into the hosting panel. Set `DATABASE_URL`, `DATABASE_SSL`, `ALLOWED_ORIGINS`, `INTERNAL_API_TOKEN`, and `BASE_URL` with staging values.
4. Keep `INTEGRATIONS_ENABLED`, `GOOGLE_SHEETS_ENABLED`, and `CLICKUP_ENABLED` set to `false`.

## Release order

```bash
npm ci
npm run preflight:deploy
npm run db:migrate
npm run build
npm start
```

Run the release commands from the application root. The web process is the only persistent Node process.

## Remote gate

After the service is healthy, run from an environment that has the same staging variables:

```bash
BASE_URL=https://staging.tag08.com.br npm run verify:staging
```

The gate checks routes, aliases, health, protected metrics, SEO, security headers, persistence, idempotency, mocked outbox, retention, interactions, and images. Its synthetic records are removed at the end of each verification.

## Scheduled jobs

Do not run either job until the remote gate is green. When integrations are later approved, schedule the integration job every five minutes. Schedule retention at `03:15` BRT daily.

```bash
npm run worker:integrations
npm run worker:retention
```

## Backup and rollback

Create a database backup before every migration and retain it outside the web root. Keep the prior application release available. Roll back code by starting the prior release; do not roll back an already-applied migration unless a migration-specific rollback was tested. Restore data only to an isolated database first and validate it before any recovery action.
