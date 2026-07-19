Get-ChildItem -Path "src/app" -Recurse -Include "*.js","*.jsx" | 
  Where-Object { $_.FullName -notmatch "admin|api|node_modules" } | 
  ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match "Champions Sports Arena") {
      $newContent = $content -replace "Champions Sports Arena", "Bharti Sports Arena"
      Set-Content $_.FullName -Value $newContent -NoNewline
      Write-Host "Updated: $($_.FullName)"
    }
  }

# Also update components
Get-ChildItem -Path "src/components" -Recurse -Include "*.js","*.jsx" | 
  ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match "Champions Sports Arena") {
      $newContent = $content -replace "Champions Sports Arena", "Bharti Sports Arena"
      Set-Content $_.FullName -Value $newContent -NoNewline
      Write-Host "Updated: $($_.FullName)"
    }
  }
