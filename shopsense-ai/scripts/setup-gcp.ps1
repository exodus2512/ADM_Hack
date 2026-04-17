[CmdletBinding()]
param(
  [string]$ProjectId = 'admhack',
  [string]$ProjectNumber = '715743211099',
  [string]$Region = 'us-central1',
  [string]$ServiceName = 'shopsense-ai',
  [string]$BucketName = 'admhack-715743211099-uploads',
  [string]$RuntimeServiceAccount = 'shopsense-runtime',
  [switch]$SkipCloudRunDeploy
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Require-Command {
  param([string]$Name)
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Missing required command: $Name"
  }
}

function Invoke-Step {
  param(
    [string]$Message,
    [scriptblock]$Action
  )

  Write-Host "`n==> $Message" -ForegroundColor Cyan
  & $Action
}

Require-Command gcloud

Invoke-Step "Checking active gcloud authentication" {
  $account = & gcloud auth list --filter='status:ACTIVE' --format='value(account)' | Select-Object -First 1
  if (-not $account) {
    throw 'No active gcloud account found. Run gcloud auth login first.'
  }
  Write-Host "Active account: $account"
}

Invoke-Step "Setting gcloud project to $ProjectId" {
  & gcloud config set project $ProjectId | Out-Host
}

Invoke-Step "Enabling required Google Cloud APIs" {
  $services = @(
    'run.googleapis.com'
    'cloudbuild.googleapis.com'
    'artifactregistry.googleapis.com'
    'firestore.googleapis.com'
    'storage.googleapis.com'
    'aiplatform.googleapis.com'
    'discoveryengine.googleapis.com'
    'cloudfunctions.googleapis.com'
    'logging.googleapis.com'
    'monitoring.googleapis.com'
    'iam.googleapis.com'
    'identitytoolkit.googleapis.com'
    'firebase.googleapis.com'
    'secretmanager.googleapis.com'
  )

  & gcloud services enable @services --project $ProjectId | Out-Host
}

Invoke-Step "Creating or verifying Firestore database" {
  $firestoreName = & gcloud firestore databases describe --database='(default)' --project $ProjectId --format='value(name)' 2>$null
  if (-not $firestoreName) {
    & gcloud firestore databases create --database='(default)' --location=$Region --type=firestore-native --project $ProjectId | Out-Host
  }
  else {
    Write-Host 'Firestore database already exists.'
  }
}

Invoke-Step "Creating or verifying Cloud Storage bucket" {
  $bucketUri = "gs://$BucketName"
  $bucketNameCheck = & gcloud storage buckets describe $bucketUri --format='value(name)' 2>$null
  if (-not $bucketNameCheck) {
    & gcloud storage buckets create $bucketUri --location=$Region --uniform-bucket-level-access | Out-Host
  }
  else {
    Write-Host "Bucket already exists: $bucketUri"
  }

  $lifecycleJson = @'
{
  "rule": [
    {
      "action": { "type": "Delete" },
      "condition": { "age": 1, "matchesPrefix": ["uploads/"] }
    }
  ]
}
'@

  $lifecyclePath = Join-Path $env:TEMP "gcs-lifecycle-$BucketName.json"
  Set-Content -Path $lifecyclePath -Value $lifecycleJson -Encoding ascii
  & gcloud storage buckets update $bucketUri --lifecycle-file=$lifecyclePath | Out-Host
}

Invoke-Step "Creating runtime service account" {
  $runtimeSaEmail = "$RuntimeServiceAccount@$ProjectId.iam.gserviceaccount.com"
  $existingSa = & gcloud iam service-accounts describe $runtimeSaEmail --project $ProjectId --format='value(email)' 2>$null
  if (-not $existingSa) {
    & gcloud iam service-accounts create $RuntimeServiceAccount --project $ProjectId --display-name 'ShopSense runtime service account' | Out-Host
  }
  else {
    Write-Host "Service account already exists: $runtimeSaEmail"
  }

  $roles = @(
    'roles/datastore.user'
    'roles/storage.objectAdmin'
    'roles/aiplatform.user'
    'roles/discoveryengine.user'
    'roles/logging.logWriter'
    'roles/monitoring.metricWriter'
  )

  foreach ($role in $roles) {
    & gcloud projects add-iam-policy-binding $ProjectId --member="serviceAccount:$runtimeSaEmail" --role=$role | Out-Host
  }
}

if (-not $SkipCloudRunDeploy) {
  Invoke-Step "Deploying Next.js app to Cloud Run" {
    $runtimeSaEmail = "$RuntimeServiceAccount@$ProjectId.iam.gserviceaccount.com"
    $envVars = @(
      "GCP_PROJECT_ID=$ProjectId"
      "GCP_LOCATION=$Region"
      'GEMINI_USE_VERTEX_AI=true'
      'FIREBASE_AUTH_ENABLED=true'
      "FIREBASE_STORAGE_BUCKET=$BucketName"
      'VERTEX_SEARCH_ENABLED=false'
    ) -join ','

    & gcloud run deploy $ServiceName `
      --source . `
      --region $Region `
      --platform managed `
      --service-account $runtimeSaEmail `
      --allow-unauthenticated `
      --set-env-vars $envVars | Out-Host
  }
}

Write-Host "`nBootstrap complete." -ForegroundColor Green
Write-Host "Next manual steps:" -ForegroundColor Yellow
Write-Host "- Create or link the Firebase web app and paste NEXT_PUBLIC_FIREBASE_* values into .env.local"
Write-Host "- Enable Google Sign-In and Email/Password in Firebase Auth"
Write-Host "- Create the Vertex AI Search engine and set VERTEX_SEARCH_SERVING_CONFIG"
Write-Host "- If you want Firebase Admin JSON locally, export GOOGLE_APPLICATION_CREDENTIALS_JSON or use ADC"
Write-Host "- If Cloud Run source deploy needs a custom Dockerfile later, I can add it"
