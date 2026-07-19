$urls = @(
  @{name="snooker-3"; url="https://images.unsplash.com/photo-1585222515068-7201a72c4181?w=400"},
  @{name="snooker-4"; url="https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?w=400"},
  @{name="pool-1"; url="https://images.unsplash.com/photo-1519455511-ac51aeece3bb?w=400"},
  @{name="billiards-1"; url="https://images.unsplash.com/photo-1580910365203-91ea9115a319?w=400"},
  @{name="amenities-2"; url="https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=400"},
  @{name="locker-1"; url="https://images.unsplash.com/photo-1562076797-9be8e214b8fd?w=400"},
  @{name="lockers-2"; url="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400"},
  @{name="facility-2"; url="https://images.unsplash.com/photo-1590239926044-4131f3027b21?w=400"},
  @{name="arena-floor"; url="https://images.unsplash.com/photo-1519861531473-9200262188bf?w=400"},
  @{name="story-1"; url="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400"},
  @{name="safety-cctv"; url="https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400"}
)

foreach ($item in $urls) {
    try {
        $r = Invoke-WebRequest -Uri $item.url -Method Head -UseBasicParsing -TimeoutSec 5
        Write-Host "$($item.name): OK"
    } catch {
        Write-Host "$($item.name): BROKEN"
    }
}
