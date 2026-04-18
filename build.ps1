$tempDir = "C:\Users\Lenovo\Desktop\App\TaskFlow_Build_Final"
$source = "C:\Users\Lenovo\Desktop\App\TaskFlowAI\mobile"

if (Test-Path $tempDir) { 
    Write-Host "Cleaning up..."
    if (Test-Path "$tempDir\node_modules") {
        cmd /c rmdir "$tempDir\node_modules"
    }
    Remove-Item -Recurse -Force $tempDir 
}
New-Item -ItemType Directory -Path $tempDir

Write-Host "Copying files..."
robocopy "$source" "$tempDir" /E /XD node_modules .git .expo android ios bin obj /NFL /NDL /NJH /NJS /nc /ns /np

Write-Host "Linking node_modules..."
cmd /c mklink /J "$tempDir\node_modules" "$source\node_modules"

Set-Location "$tempDir"
git init
git config user.email "test@example.com"
git config user.name "Test User"
git add .
git commit -m "temp build"

Write-Host "Fixing file attributes (removing Read-Only)..."
Get-ChildItem -Path app, src, assets -Recurse | ForEach-Object { $_.Attributes = $_.Attributes -band (-not [System.IO.FileAttributes]::ReadOnly) }

Write-Host "Starting EAS build..."
eas build -p android --profile preview

Write-Host "Cleanup..."
Set-Location "$source"
if (Test-Path "$tempDir\node_modules") { 
    cmd /c rmdir "$tempDir\node_modules" 
}
Remove-Item -Recurse -Force $tempDir
