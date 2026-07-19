Get-ChildItem -Path "src" -Recurse -Include "*.js","*.jsx" | 
  Where-Object { $_.FullName -notmatch "admin|api|node_modules" } | 
  ForEach-Object {
    $content = [System.IO.File]::ReadAllText($_.FullName)
    if ($content -match "championssportsarena") {
      $newContent = $content -replace "championssportsarena", "bhartisportsarena"
      [System.IO.File]::WriteAllText($_.FullName, $newContent)
      Write-Host "Updated: $($_.FullName)"
    }
  }
