param([string]$RepoRoot = (Get-Location).Path)

$hookPath = Join-Path $RepoRoot ".git\hooks\post-commit"
$hook = @"
#!/bin/sh
REPO_ROOT="$(git rev-parse --show-toplevel)"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$REPO_ROOT/scripts/update-handoff.ps1" -RepoRoot "$REPO_ROOT" > /dev/null 2>&1
exit 0
"@

Set-Content -Path $hookPath -Value $hook -Encoding ASCII
Write-Host "Installed hook: $hookPath"
