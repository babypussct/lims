<#
.SYNOPSIS
    Them Environment Variables can thiet cho NAFIQPM6 LIMS QR Login API len Vercel.

.PREREQUISITE
    1. Tai Firebase Service Account JSON:
       Firebase Console -> Project Settings -> Service Accounts -> Generate new private key
       Luu file vao: c:\Users\chuan\OneDrive\Documents\lims\service-account.json

    2. Dam bao da dang nhap Vercel CLI:
       npx vercel whoami

.USAGE
    cd c:\Users\chuan\OneDrive\Documents\lims
    .\scripts\set-vercel-env.ps1

    Hoac chi dinh file service account khac:
    .\scripts\set-vercel-env.ps1 -ServiceAccountPath "C:\path\to\sa.json"
#>

param(
    [string]$ServiceAccountPath = ".\service-account.json"
)

$ErrorActionPreference = "Stop"

Write-Host "`n=== NAFIQPM6 LIMS - Vercel Environment Setup ===" -ForegroundColor Cyan
Write-Host ""

# 1. Kiem tra Vercel CLI
try {
    $whoami = npx vercel whoami 2>&1
    Write-Host "OK Vercel account: $whoami" -ForegroundColor Green
} catch {
    Write-Host "ERROR Chua dang nhap Vercel. Chay: npx vercel login" -ForegroundColor Red
    exit 1
}

# 2. Doc service account JSON
if (-not (Test-Path $ServiceAccountPath)) {
    Write-Host ""
    Write-Host "ERROR Khong tim thay: $ServiceAccountPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "Huong dan tai Service Account:" -ForegroundColor Yellow
    Write-Host "   1. Mo: https://console.firebase.google.com/" -ForegroundColor Yellow
    Write-Host "   2. Chon project 'lims-cloud-by-otada'" -ForegroundColor Yellow
    Write-Host "   3. Project Settings (gear icon) -> Service accounts" -ForegroundColor Yellow
    Write-Host "   4. Click 'Generate new private key'" -ForegroundColor Yellow
    Write-Host "   5. Luu file vao: $ServiceAccountPath" -ForegroundColor Yellow
    Write-Host "   6. Chay lai script nay" -ForegroundColor Yellow
    exit 1
}

$serviceAccountJson = Get-Content $ServiceAccountPath -Raw -Encoding UTF8
try {
    $sa = $serviceAccountJson | ConvertFrom-Json
    Write-Host "OK Service Account: $($sa.client_email)" -ForegroundColor Green
    Write-Host "   Project: $($sa.project_id)" -ForegroundColor Gray
} catch {
    Write-Host "ERROR File khong phai JSON hop le: $ServiceAccountPath" -ForegroundColor Red
    exit 1
}

# 3. Cau hinh
$APP_ID = "lims-cloud-fixed"
$ALLOWED_ORIGINS = "https://lims-cloud-by-otada.vercel.app"

Write-Host ""
Write-Host "Chuan bi set cac bien:" -ForegroundColor Cyan
Write-Host "   FIREBASE_SERVICE_ACCOUNT = [JSON blob, $($serviceAccountJson.Length) chars]"
Write-Host "   APP_ID                   = $APP_ID"
Write-Host "   ALLOWED_ORIGINS          = $ALLOWED_ORIGINS"
Write-Host ""

# 4. Ham set env var (ca 3 moi truong)
function Set-VercelEnv {
    param([string]$Name, [string]$Value)
    
    Write-Host "  -> Setting $Name..." -ForegroundColor Yellow -NoNewline
    
    # Xoa neu da ton tai (bo qua loi)
    try { echo "" | npx vercel env rm $Name production --yes 2>$null } catch {}
    try { echo "" | npx vercel env rm $Name preview --yes 2>$null } catch {}
    try { echo "" | npx vercel env rm $Name development --yes 2>$null } catch {}
    
    # Them cho tat ca environments
    $Value | npx vercel env add $Name production 2>&1 | Out-Null
    $Value | npx vercel env add $Name preview 2>&1 | Out-Null
    $Value | npx vercel env add $Name development 2>&1 | Out-Null
    
    Write-Host " DONE" -ForegroundColor Green
}

# 5. Set tung bien
Set-VercelEnv -Name "FIREBASE_SERVICE_ACCOUNT" -Value $serviceAccountJson
Set-VercelEnv -Name "APP_ID" -Value $APP_ID
Set-VercelEnv -Name "ALLOWED_ORIGINS" -Value $ALLOWED_ORIGINS

# 6. Xac nhan
Write-Host ""
Write-Host "Kiem tra lai..." -ForegroundColor Cyan
npx vercel env ls production 2>&1

Write-Host ""
Write-Host "HOAN TAT! Deploy de ap dung:" -ForegroundColor Green
Write-Host "   npx vercel --prod" -ForegroundColor White
Write-Host ""
Write-Host "QUAN TRONG: Xoa file service account sau khi xong:" -ForegroundColor Yellow
Write-Host "   Remove-Item service-account.json" -ForegroundColor Yellow
