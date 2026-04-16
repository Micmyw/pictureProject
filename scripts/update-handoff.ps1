param(
  [string]$RepoRoot = (Get-Location).Path,
  [string]$Objective = "Continue ecommerce image SaaS MVP",
  [string[]]$Constraints = @(
    "Do not modify docs/superpowers/plans/ unless explicitly requested",
    "Prefer UX-first behavior when requirements conflict"
  ),
  [string[]]$OpenTasks = @(
    "Finalize PR description and checklist",
    "Decide release/deploy path",
    "Track post-MVP enhancements"
  ),
  [switch]$RunChecks
)

$ErrorActionPreference = "Stop"

function Run-Cmd([string]$cmd) {
  try { return (Invoke-Expression $cmd | Out-String).Trim() }
  catch { return "FAILED: $cmd`n$($_.Exception.Message)" }
}

$branch = Run-Cmd "git -C `"$RepoRoot`" rev-parse --abbrev-ref HEAD"
$remote = Run-Cmd "git -C `"$RepoRoot`" remote get-url origin"
$status = Run-Cmd "git -C `"$RepoRoot`" status --short --branch"
$commits = Run-Cmd "git -C `"$RepoRoot`" log --oneline -12"
$now = Get-Date -Format "yyyy-MM-dd HH:mm:ss zzz"

$verification = @()
if ($RunChecks) {
  $checks = @(
    "npm.cmd run lint",
    "npm.cmd run typecheck",
    "npm.cmd run test"
  )
  foreach ($c in $checks) {
    try {
      Push-Location $RepoRoot
      Invoke-Expression $c | Out-Null
      $verification += ('- PASS: `{0}`' -f $c)
    } catch {
      $verification += ('- FAIL: `{0}`' -f $c)
    } finally {
      Pop-Location
    }
  }
} else {
  $verification += '- (Skipped in auto update) Run `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:e2e` when needed.'
}

$constraintsText = ($Constraints | ForEach-Object { "- $_" }) -join "`n"
$tasksText = ($OpenTasks | ForEach-Object { "- $_" }) -join "`n"

$content = @"
# PROJECT_STATUS

Last Updated: $now

## Objective
$Objective

## Repo
- Branch: $branch
- Remote: $remote

## Recent Commits
$commits

## Working Tree
~~~
$status
~~~

## Verification
$($verification -join "`n")

## Open Tasks (Priority)
$tasksText

## Constraints
$constraintsText

## Next Action
- Read this file first, then continue from the top item in **Open Tasks (Priority)**.
- Keep all new updates reflected by rerunning: powershell -File scripts/update-handoff.ps1
"@

$outFile = Join-Path $RepoRoot "docs\handoff\PROJECT_STATUS.md"
Set-Content -Path $outFile -Value $content -Encoding UTF8
Write-Host "Updated: $outFile"
