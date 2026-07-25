# muse

Lightweight fullstack proof of concept for organizing fashion inspiration images. Users can upload an image or provide a photo URL, classify garments with a multimodal model, tune the returned tags, filter the library, search descriptions and observations, and add human notes over time.

## Stack

- Next.js, TypeScript, Tailwind CSS
- Auth.js / NextAuth with Google sign-in
- Prisma with local SQLite for application data
- Supabase Storage for public image hosting only
- OpenAI-compatible Chat Completions client pointed at MiniMax-M3
- Vitest and Playwright for unit, integration, and end-to-end tests

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

3. Configure Google sign-in:

- In Google Cloud Console, create an OAuth client for a web application.
- Add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI.
- Copy the client id into `AUTH_GOOGLE_ID`.
- Copy the client secret into `AUTH_GOOGLE_SECRET`.
- `AUTH_GOOGLE_CLIENT_ID` / `AUTH_GOOGLE_CLIENT_SECRET` and `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` are also accepted aliases.
- Set `NEXTAUTH_URL=http://localhost:3000`.
- Set `AUTH_SECRET` and `NEXTAUTH_SECRET` to the same long random string.

Only Google sign-in is supported in v1. Any Google account can sign in, and each account gets its own private canvas.

4. Configure Supabase Storage:

- Create a Supabase project.
- Create a public bucket, for example `fashion-inspiration`.
- Copy the project URL into `SUPABASE_URL`.
- Copy the service role key into `SUPABASE_SERVICE_ROLE_KEY`.
- Set `SUPABASE_BUCKET=fashion-inspiration`.

The bucket is public for v1 so MiniMax-M3 can read image URLs directly. Files are stored with UUID-based object keys.

5. Configure MiniMax:

```env
OPENAI_BASE_URL="https://api.minimaxi.com/v1"
OPENAI_API_KEY="your-key"
VISION_MODEL="MiniMax-M3"
```

6. Create the local SQLite schema:

```bash
npm run db:push
```

7. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

The home page is the full muse workspace: a light gray dotted whiteboard canvas with masonry image cards, a bottom add toolbar, a hidden right-side filter drawer, and an inspector for editing selected images. `/gallery` is kept only as a compatibility redirect back to `/`.

## Architecture Notes

- `/app` contains the Next.js application, API routes, UI, and domain adapters.
- `/prisma/schema.prisma` defines designers, images, annotations, and a search index table.
- `/eval` contains the evaluation manifest and script.
- `/tests` contains unit, integration, and end-to-end tests.
- Supabase is intentionally limited to uploaded image storage.
- SQLite remains the local source of truth for app data.
- Auth.js stores Google accounts and sessions in SQLite through Prisma.
- The classifier is isolated in `app/lib/classifier.ts`. If MiniMax changes its image input format, update that adapter only.
- Automated tests set `MOCK_EXTERNAL_SERVICES=true`, so they do not require Supabase or MiniMax credentials.

## Data Model

Each image stores:

- Supabase object key and public URL
- External URL metadata when the user provides a URL instead of uploading
- AI one-line title and description
- Editable tag fields: garment, brand/designer, gender, style, material, colors, pattern, and occasion
- Captured year and month, automatically set when the photo is added
- Human observations
- Owner user id, so each Google account sees only its own canvas

AI-generated tags are editable: users can remove unwanted small values and add their own values per field.

When auth is first enabled on an existing local database, the first signed-in Google user claims existing unauthenticated images and notes.

## Testing

```bash
npm run test:unit
npm run test:integration
npm run test:e2e
```

The E2E test starts Next.js with mock external services, uploads a tiny PNG, verifies classification, edits tags, adds an observation, and filters the result.

## Evaluation

Run the 50-image evaluation manifest:

```bash
npm run eval
```

The script classifies each Pexels image URL and reports per-attribute accuracy for garment, style, material, and occasion.

The included labels are a starter labeled set for this practice project. Before treating scores as final, visually review the Pexels URLs and tighten labels where the garment is ambiguous or the image has changed.

## Known Limitations

- Google-only authentication; no email/password, magic links, or anonymous mode.
- Public image bucket is acceptable for uploaded practice imagery but should be replaced with signed URLs or private access for sensitive imagery.
- SQLite search uses a maintained search index table and in-app filtering. For larger libraries, use SQLite FTS5 or a managed search service.
- Model quality depends on the provider accepting public image URLs in OpenAI-compatible `image_url` content blocks.
- Evaluation labels are intentionally lightweight and should be audited before presenting final accuracy.
