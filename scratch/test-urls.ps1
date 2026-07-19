$urls = @(
  "https://images.unsplash.com/photo-1544298621-a1bd3c8e10c7?w=400",
  "https://images.unsplash.com/photo-1613918431703-aa50889e3ec3?w=400",
  "https://images.unsplash.com/photo-1534158914592-062992fbe900?w=400",
  "https://images.unsplash.com/photo-1571731856697-0b0bac9e855e?w=400",
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400",
  "https://images.unsplash.com/photo-1529699211952-734e680f0960?w=400",
  "https://images.unsplash.com/photo-1590249241325-c42e3f76edbe?w=400",
  "https://images.unsplash.com/photo-1599058945845-cc3a92b56fdf?w=400",
  "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400",
  "https://images.unsplash.com/photo-1547347298-4074ad3086f0?w=400",
  "https://images.unsplash.com/photo-1604014237800-1c5c50c19a6d?w=400",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
  "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400",
  "https://images.unsplash.com/photo-1551958219-acbc595d69a3?w=400",
  "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400",
  "https://images.unsplash.com/photo-1564228940-32b30e2da2b5?w=400",
  "https://images.unsplash.com/photo-1540497077202-b12e0c55abe0?w=400"
)

$names = @("hero","badminton","tableTennis","snooker","fitness","chess","carrom","story","badmintonAction","coaching","arenaWide","fitnessAction","fitnessWeights","coachingKids","coachingAdult","facilityAmenities","facilitySafety")

for ($i = 0; $i -lt $urls.Count; $i++) {
    try {
        $r = Invoke-WebRequest -Uri $urls[$i] -Method Head -UseBasicParsing -TimeoutSec 5
        Write-Host "$($names[$i]): OK ($($r.StatusCode))"
    } catch {
        Write-Host "$($names[$i]): BROKEN"
    }
}
