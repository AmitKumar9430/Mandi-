$loginBody = @{ identifier = '9876543211'; password = 'Password@123' } | ConvertTo-Json
$loginRes = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/login' -Method Post -Body $loginBody -ContentType 'application/json'
$token = $loginRes.data.token
Write-Host "✅ Farmer Logged In successfully."

$reqBody = @{
    title = 'Need 45+ HP Tractor for 5 Acres Ploughing in Malihabad'
    rawDescription = 'Urgent requirement of tractor with rotavator for 5 acres land preparation before sowing.'
    category = 'AGRICULTURE'
    requestType = 'REQUEST_SERVICE'
    serviceType = 'TRACTOR'
    isOffer = $false
    requiredDate = '2026-08-20'
    requiredStartTime = '09:00:00'
    requiredEndTime = '13:00:00'
    budgetAmount = 1200
    budgetUnit = 'per hour'
    structuredAttributes = '{"landSize":5,"landUnit":"ACRES","workType":"PLOUGHING","minHorsePower":"HP_40_50","operatorNeeded":true,"fuelArrangement":"PROVIDER"}'
    villageOrTown = 'Malihabad'
    district = 'Lucknow'
    state = 'Uttar Pradesh'
    contactPhone = '9876543211'
} | ConvertTo-Json

$headers = @{ Authorization = "Bearer $token" }
$probRes = Invoke-RestMethod -Uri 'http://localhost:8080/api/problems' -Method Post -Body $reqBody -ContentType 'application/json' -Headers $headers
$probId = $probRes.data.id
Write-Host "✅ Created Tractor Problem Request ID: $probId (Ticket: $($probRes.data.passportCode))"

$matches = Invoke-RestMethod -Uri "http://localhost:8080/api/problems/$probId/best-matches?limit=3" -Headers $headers
$top = $matches.data[0]
$resName = $top.resource.name
$score = $top.score
$dist = $top.distanceKm
Write-Host "✅ Top Match Found: $resName | Compatibility Score: $score% | Distance: $dist km"
Write-Host "   Matched Reasons:"
foreach ($r in $top.matchedReasons) {
    Write-Host "   ✓ $r"
}

$providerId = $top.provider.id
$resourceId = $top.resource.id

$bookingBody = @{
    providerId = $providerId
    problemId = $probId
    resourceId = $resourceId
    serviceType = 'TRACTOR'
    bookingDate = '2026-08-20'
    startTime = '09:00:00'
    endTime = '13:00:00'
    agreedPrice = 1200
    priceUnit = 'per hour'
    villageOrTown = 'Malihabad'
    district = 'Lucknow'
    state = 'Uttar Pradesh'
    notes = '5 acres ploughing with rotavator'
} | ConvertTo-Json

$bookRes = Invoke-RestMethod -Uri 'http://localhost:8080/api/bookings' -Method Post -Body $bookingBody -ContentType 'application/json' -Headers $headers
$bookingId = $bookRes.data.id
$status = $bookRes.data.bookingStatus
Write-Host "✅ Booking Placed Successfully ID: $bookingId | Status: $status"

# Provider Accepts Booking
$pLoginBody = @{ identifier = '9876543215'; password = 'Password@123' } | ConvertTo-Json
$pLoginRes = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/login' -Method Post -Body $pLoginBody -ContentType 'application/json'
$pToken = $pLoginRes.data.token
$pHeaders = @{ Authorization = "Bearer $pToken" }

$acceptRes = Invoke-RestMethod -Uri "http://localhost:8080/api/bookings/$bookingId/accept" -Method Post -Headers $pHeaders
$accStatus = $acceptRes.data.bookingStatus
Write-Host "✅ Provider Accepted Booking! New Status: $accStatus"

# Provider Marks Delivered
$delivRes = Invoke-RestMethod -Uri "http://localhost:8080/api/bookings/$bookingId/deliver" -Method Post -Headers $pHeaders
$delStatus = $delivRes.data.bookingStatus
Write-Host "✅ Service Marked Delivered! Status: $delStatus"

# Requester Confirms Completion
$confRes = Invoke-RestMethod -Uri "http://localhost:8080/api/bookings/$bookingId/confirm" -Method Post -Headers $headers
$confStatus = $confRes.data.bookingStatus
Write-Host "✅ Requester Confirmed! Status: $confStatus"

# Requester Rates Provider
$rateBody = @{ rating = 5; feedback = 'Timely arrival with excellent tractor and implements.'; tags = 'ON_TIME,EXCELLENT_EQUIPMENT' } | ConvertTo-Json
$rateRes = Invoke-RestMethod -Uri "http://localhost:8080/api/bookings/$bookingId/rate" -Method Post -Body $rateBody -ContentType 'application/json' -Headers $headers
Write-Host "✅ 5-Star Rating Submitted Successfully!"

# Test Double-Booking Collision Prevention
Write-Host "Testing Collision / Double-Booking Prevention..."
try {
    $dupRes = Invoke-RestMethod -Uri 'http://localhost:8080/api/bookings' -Method Post -Body $bookingBody -ContentType 'application/json' -Headers $headers
    Write-Host "❌ ERROR: Double booking was not blocked!"
} catch {
    Write-Host "✅ SUCCESS: Double-booking blocked by server as expected: $($_.Exception.Message)"
}
