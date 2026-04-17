# ShopSense AI - GCP Integration Guide

This project now includes a GCP-ready integration layer for the services you listed:

- Firebase Authentication (token verification hooks + client SDK bootstrap)
- Gemini API on Vertex AI (chat + review summarization)
- Gemini Vision (image attribute extraction for visual search)
- Firestore/Admin SDK bootstrap helpers
- Cloud Storage bucket helper (for product/user images)
- Vertex AI Search (Discovery Engine) integration hook for semantic search

## Project Identity

- Project name: `ADMhack`
- Project ID: `admhack`
- Project number: `715743211099`

## What Was Added

- Server utilities in `src/lib/gcp/`
- Gemini-backed API usage in:
	- `src/app/api/chat/route.ts`
	- `src/app/api/review-summary/route.ts`
	- `src/app/api/visual-search/route.ts`
	- `src/app/api/search/route.ts`
- Firebase client setup in `src/lib/gcp/firebaseClient.ts`
- Env template in `.env.example`

All routes keep fallback behavior so the app still works before credentials are configured.

## Local Setup

1. Copy `.env.example` to `.env.local`
2. Fill required values
3. Install and run:

```bash
npm install
npm run dev
```

## GCP CLI Bootstrap

Run the provisioning script from the repo root in PowerShell:

```powershell
Set-Location .\shopsense-ai
.\scripts\setup-gcp.ps1
```

You can override the defaults if needed:

```powershell
.\scripts\setup-gcp.ps1 -ProjectId admhack -ProjectNumber 715743211099 -Region us-central1 -BucketName admhack-715743211099-uploads
```

The script automates the parts that `gcloud` can manage directly:

- API enablement
- Firestore creation
- Cloud Storage bucket creation plus 1-hour upload lifecycle cleanup
- Runtime service account creation and IAM bindings
- Cloud Run source deploy for the Next.js app

It still leaves Firebase Auth provider setup and the Firebase web app config for manual console steps.

## Required Environment Variables

At minimum for full GCP mode:

- `GCP_PROJECT_ID`
- `GCP_LOCATION` (for example `us-central1`)
- `GEMINI_USE_VERTEX_AI=true`
- `GOOGLE_APPLICATION_CREDENTIALS` (path to service account JSON) OR `GOOGLE_APPLICATION_CREDENTIALS_JSON`
- Firebase client values (`NEXT_PUBLIC_FIREBASE_*`)

For Vertex Search:

- `VERTEX_SEARCH_ENABLED=true`
- `VERTEX_SEARCH_SERVING_CONFIG` in format:
	`projects/<project-number>/locations/global/collections/default_collection/engines/<engine-id>/servingConfigs/default_search`

## Deployment Targets

- Next.js app: Cloud Run
- Event-based nudges/alerts: Cloud Functions (to be wired to your event source)
- Data: Firestore + Cloud Storage
- Analytics: GA4 via Firebase client SDK

## Remaining Production Work (Expected)

- Enable Google sign-in / Email-password UI flows in frontend
- Persist cart/wishlist/profile from Zustand stores into Firestore
- Replace local product matching with Vertex AI Search as primary catalog index
- Add Cloud Functions for price-drop + wishlist re-engagement triggers
- Configure Cloud Logging/Monitoring dashboards and alerts
- Add image upload flow to GCS with lifecycle rule (delete in 1 hour)

## Quick GCS Lifecycle Rule (1-hour delete)

Use this JSON policy on the upload bucket:

```json
{
	"rule": [
		{
			"action": { "type": "Delete" },
			"condition": { "age": 1, "matchesPrefix": ["uploads/"] }
		}
	]
}
```

Then apply with `gcloud storage buckets update` and lifecycle file.
