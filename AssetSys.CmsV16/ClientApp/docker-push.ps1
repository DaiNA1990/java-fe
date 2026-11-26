param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("develop-tool-web", "all")]
    [string]$Module,

    # Registry noi bo, fix dia chi.
    [string]$Registry = "10.15.24.231:5000",

    # Namespace de phan biet image cua project nao tren cung 1 registry, vd "dtnn-fe".
    # Ket qua: <Registry>/<Project>/<Module>:<Tag>. Bo trong neu chi co 1 project.
    [string]$Project = "dtnn",

    [string]$Tag = "latest",

    # Cong cu container: docker hoac podman. Mac dinh tu nhan dien, uu tien docker
    # neu ca hai cung co san.
    [ValidateSet("auto", "docker", "podman")]
    [string]$Engine = "auto",

    # Bo qua buoc login - dung khi registry noi bo chua bat auth (registry:2 mac dinh
    # khong yeu cau dang nhap).
    [switch]$SkipLogin
)

$ErrorActionPreference = "Stop"

# Script nam ngay trong thu muc app nen context build la '.' (Dockerfile cung cap).
# Repo nay chi co 1 Angular app; them module moi: them entry vao day va vao
# ValidateSet cua -Module o tren.
$ModulePaths = @{
    "develop-tool-web" = "."
}

function Resolve-Engine {
    param([string]$Preferred)

    if ($Preferred -ne "auto") {
        if (-not (Get-Command $Preferred -ErrorAction SilentlyContinue)) {
            throw "Khong tim thay lenh '$Preferred'. Cai dat hoac chon -Engine khac."
        }
        return $Preferred
    }

    if (Get-Command docker -ErrorAction SilentlyContinue) { return "docker" }
    if (Get-Command podman -ErrorAction SilentlyContinue) { return "podman" }

    throw "Khong tim thay docker hoac podman trong PATH."
}

$Cmd = Resolve-Engine -Preferred $Engine
Write-Host "Container engine: $Cmd" -ForegroundColor DarkCyan

# $Registry la HTTP thuan (khong TLS) - luon bo qua verify TLS, khong can flag rieng.
$TlsArgs = @()
if ($Cmd -eq "podman") {
    $TlsArgs = @("--tls-verify=false")
} elseif ($Cmd -eq "docker") {
    Write-Host "Luu y: $Registry la HTTP thuan. Docker CLI khong co co insecure rieng tung lenh -" -ForegroundColor Yellow
    Write-Host "  can khai bao `"insecure-registries`": [`"$Registry`"] trong /etc/docker/daemon.json roi restart docker" -ForegroundColor Yellow
    Write-Host "  (chi can lam 1 lan)." -ForegroundColor Yellow
}

if ($Cmd -eq "podman") {
    $machineStatus = (podman machine list --format "{{.Running}}" 2>$null) -join ""
    if ($machineStatus -notmatch "true") {
        Write-Host "Podman machine chua chay, dang khoi dong..." -ForegroundColor Yellow
        podman machine start
        if ($LASTEXITCODE -ne 0) { throw "Khong khoi dong duoc podman machine" }
    }
}

$Root = $PSScriptRoot
Set-Location $Root

$Modules = if ($Module -eq "all") {
    @($ModulePaths.Keys)
} else {
    @($Module)
}

# Buoc 1: login + verify ket noi registry TRUOC khi build - fail nhanh, khong ton
# cong build image roi moi biet sai pass/khong ket noi duoc. Chi login 1 lan du push nhieu module.
$RegistryUser = "admin"

if ($SkipLogin) {
    Write-Host "[1/2] Bo qua buoc login (-SkipLogin)." -ForegroundColor DarkYellow
} else {
    Write-Host "[1/2] Logging in to $Registry voi user '$RegistryUser'..." -ForegroundColor Cyan
    $SecurePassword = Read-Host -Prompt "Password cho $RegistryUser" -AsSecureString
    $PlainPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecurePassword)
    )
    $PlainPassword | & $Cmd login @TlsArgs -u $RegistryUser --password-stdin "$Registry"
    if ($LASTEXITCODE -ne 0) { throw "$Cmd login failed with exit code $LASTEXITCODE" }
    Write-Host "Login OK, da ket noi duoc $Registry." -ForegroundColor Green
}

# Buoc 2: build + push tung module
Write-Host "[2/2] Build + push $($Modules.Count) module: $($Modules -join ', ')" -ForegroundColor Cyan

foreach ($m in $Modules) {
    $ModuleDir = Join-Path $Root $ModulePaths[$m]
    if (-not (Test-Path (Join-Path $ModuleDir "Dockerfile"))) {
        throw "Khong tim thay Dockerfile trong $ModuleDir cho module '$m'"
    }

    $Image = if ($Project) { "${Registry}/${Project}/${m}" } else { "${Registry}/${m}" }

    Write-Host ""
    Write-Host "=== $m ===" -ForegroundColor Magenta

    Write-Host "Building image $Image`:$Tag (context: $ModuleDir)..." -ForegroundColor Cyan
    & $Cmd build -t "${Image}:${Tag}" -t "${Image}:latest" $ModuleDir
    if ($LASTEXITCODE -ne 0) { throw "$Cmd build failed for module $m with exit code $LASTEXITCODE" }
    Write-Host "Build OK: ${Image}:${Tag}" -ForegroundColor Green

    Write-Host "Pushing ${Image}:latest ..." -ForegroundColor Cyan
    & $Cmd push @TlsArgs "${Image}:latest"
    if ($LASTEXITCODE -ne 0) { throw "$Cmd push failed for module $m tag latest with exit code $LASTEXITCODE" }

    Write-Host "Deploy OK: ${Image}:${Tag} (+ latest) da len $Registry" -ForegroundColor Green
}

Write-Host ""
Write-Host "Hoan tat $($Modules.Count) module: $($Modules -join ', ')" -ForegroundColor Green
