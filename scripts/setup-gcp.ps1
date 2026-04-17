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

$scriptPath = Join-Path $PSScriptRoot '..\shopsense-ai\scripts\setup-gcp.ps1'
if (-not (Test-Path $scriptPath)) {
  throw "Inner bootstrap script not found at $scriptPath"
}

& $scriptPath @PSBoundParameters
