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
$env:EAS_NO_GIT="1"
$env:EAS_SKIP_FILENAMES_CASING_CHECK="1"
$env:EAS_SKIP_AUTO_FINGERPRINT="1"

Write-Host "Starting EAS build (No Git mode)..."
eas build -p android --profile preview --non-interactive

Write-Host "Cleanup..."
Set-Location "$source"
if (Test-Path "$tempDir\node_modules") { 
    cmd /c rmdir "$tempDir\node_modules" 
}
Remove-Item -Recurse -Force $tempDir
