$junctionPath = "C:\Users\Lenovo\Desktop\App\TaskFlow_Mobile_Link"
$sourcePath = "C:\Users\Lenovo\Desktop\App\TaskFlow AI\mobile"

# Clean up existing link if any
if (Test-Path $junctionPath) {
    # On Windows, Remove-Item on a junction just removes the link
    cmd /c rmdir "$junctionPath"
}

Write-Host "Creating directory junction to bypass space-in-path issue..."
cmd /c mklink /J "$junctionPath" "$sourcePath"

if (-not (Test-Path $junctionPath)) {
    Write-Error "Failed to create junction. Please ensure you have permissions."
    exit 1
}

Write-Host "Starting EAS build from space-free path..."
Set-Location "$junctionPath"

# We use the original git state but through the junction path
eas build -p android --profile preview --non-interactive

Write-Host "Build command finished. Cleaning up link..."
Set-Location "$sourcePath"
cmd /c rmdir "$junctionPath"
