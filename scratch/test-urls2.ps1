$urls = @(
  @{name="badminton-1"; url="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400"},
  @{name="badminton-2"; url="https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?w=400"},
  @{name="snooker-1"; url="https://images.unsplash.com/photo-1615213612138-4d1195b1c0e1?w=400"},
  @{name="snooker-2"; url="https://images.unsplash.com/photo-1570283626767-b91e7d485c55?w=400"},
  @{name="chess-1"; url="https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=400"},
  @{name="chess-2"; url="https://images.unsplash.com/photo-1586165368502-1bad9cc98592?w=400"},
  @{name="carrom-1"; url="https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?w=400"},
  @{name="hero-1"; url="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400"},
  @{name="hero-2"; url="https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=400"},
  @{name="arena-1"; url="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400"},
  @{name="coaching-1"; url="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=400"},
  @{name="coaching-2"; url="https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400"},
  @{name="kids-coaching"; url="https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400"},
  @{name="amenities-1"; url="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400"},
  @{name="safety-1"; url="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=400"},
  @{name="indoor-sports-1"; url="https://images.unsplash.com/photo-1593786267440-e3d8b4a0deab?w=400"},
  @{name="arena-2"; url="https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400"},
  @{name="gym-1"; url="https://images.unsplash.com/photo-1540497077202-7c35dd823e8c?w=400"},
  @{name="sports-hall"; url="https://images.unsplash.com/photo-1562552052-c77e8045ebe4?w=400"},
  @{name="shuttle-1"; url="https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=400"}
)

foreach ($item in $urls) {
    try {
        $r = Invoke-WebRequest -Uri $item.url -Method Head -UseBasicParsing -TimeoutSec 5
        Write-Host "$($item.name): OK"
    } catch {
        Write-Host "$($item.name): BROKEN"
    }
}
