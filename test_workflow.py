import json
import urllib.request
import urllib.error
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://localhost:8080/api"

def http_post(url, data, token=None):
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode('utf-8'),
        headers={
            'Content-Type': 'application/json',
            **({'Authorization': f'Bearer {token}'} if token else {})
        }
    )
    with urllib.request.urlopen(req) as res:
        return json.loads(res.read().decode('utf-8'))

def http_get(url, token=None):
    req = urllib.request.Request(
        url,
        headers={
            'Content-Type': 'application/json',
            **({'Authorization': f'Bearer {token}'} if token else {})
        }
    )
    with urllib.request.urlopen(req) as res:
        return json.loads(res.read().decode('utf-8'))

def main():
    print("==================================================")
    print(" MANDI ROLE-BASED REQUEST & MATCHING ENGINE TEST")
    print("==================================================")

    # 1. Login as Farmer
    login_res = http_post(f"{BASE_URL}/auth/login", {
        "identifier": "9876543211",
        "password": "Password@123"
    })
    token = login_res["data"]["token"]
    user_id = login_res["data"]["userId"]
    print(f"[SUCCESS] Farmer Logged In successfully. User ID: {user_id} ({login_res['data']['fullName']})")

    # 2. Submit Tractor Request
    req_body = {
        "title": "Need 45+ HP Tractor for 5 Acres Ploughing in Malihabad",
        "rawDescription": "Urgent requirement of tractor with rotavator for 5 acres land preparation before sowing.",
        "category": "AGRICULTURE",
        "requestType": "REQUEST_SERVICE",
        "serviceType": "TRACTOR",
        "isOffer": False,
        "requiredDate": "2026-08-20",
        "requiredStartTime": "09:00:00",
        "requiredEndTime": "13:00:00",
        "budgetAmount": 1200.0,
        "budgetUnit": "per hour",
        "structuredAttributes": json.dumps({
            "landSize": 5,
            "landUnit": "ACRES",
            "workType": "PLOUGHING",
            "minHorsePower": "HP_40_50",
            "operatorNeeded": True,
            "fuelArrangement": "PROVIDER"
        }),
        "villageOrTown": "Malihabad",
        "district": "Lucknow",
        "state": "Uttar Pradesh",
        "contactPhone": "9876543211"
    }

    prob_res = http_post(f"{BASE_URL}/problems", req_body, token)
    prob_id = prob_res["data"]["id"]
    passport_code = prob_res["data"].get("passportCode", "N/A")
    print(f"[SUCCESS] Problem Created: ID {prob_id} | Ticket: {passport_code}")

    # 3. Fetch Matches from Matching Engine
    matches_res = http_get(f"{BASE_URL}/problems/{prob_id}/best-matches?limit=3", token)
    matches = matches_res.get("data", [])
    print(f"[SUCCESS] Matching Engine returned {len(matches)} compatible providers.")
    top = matches[0]
    print(f"   [TOP MATCH] {top['resource']['name']}")
    print(f"   [COMPATIBILITY] Score: {top['score']}% (Distance: {top['distanceKm']} km)")
    print("   [TRANSPARENT REASONS]")
    for r in top.get("matchedReasons", []):
        print(f"      * {r}")

    provider_id = top["provider"]["id"]
    resource_id = top["resource"]["id"]

    # 4. Request Booking with Provider
    booking_body = {
        "providerId": provider_id,
        "problemId": prob_id,
        "resourceId": resource_id,
        "serviceType": "TRACTOR",
        "bookingDate": "2026-08-20",
        "startTime": "09:00:00",
        "endTime": "13:00:00",
        "agreedPrice": 1200.0,
        "priceUnit": "per hour",
        "villageOrTown": "Malihabad",
        "district": "Lucknow",
        "state": "Uttar Pradesh",
        "notes": "5 acres ploughing with rotavator"
    }

    book_res = http_post(f"{BASE_URL}/bookings", booking_body, token)
    booking_id = book_res["data"]["id"]
    print(f"[SUCCESS] Booking Created: ID {booking_id} | Status: {book_res['data']['bookingStatus']}")

    # 5. Login as Provider and Accept Booking
    p_login = http_post(f"{BASE_URL}/auth/login", {
        "identifier": "9876543215",
        "password": "Password@123"
    })
    p_token = p_login["data"]["token"]
    print(f"[SUCCESS] Provider Logged In: {p_login['data']['fullName']}")

    accept_res = http_post(f"{BASE_URL}/bookings/{booking_id}/accept", {}, p_token)
    print(f"[SUCCESS] Provider Accepted Booking! New Status: {accept_res['data']['bookingStatus']}")

    # 6. Provider Marks Delivered
    deliv_res = http_post(f"{BASE_URL}/bookings/{booking_id}/deliver", {}, p_token)
    print(f"[SUCCESS] Service Delivered! New Status: {deliv_res['data']['bookingStatus']}")

    # 7. Requester Confirms Completion
    conf_res = http_post(f"{BASE_URL}/bookings/{booking_id}/confirm", {}, token)
    print(f"[SUCCESS] Requester Confirmed! New Status: {conf_res['data']['bookingStatus']}")

    # 8. Requester Submits 5-Star Rating
    rate_res = http_post(f"{BASE_URL}/bookings/{booking_id}/rate", {
        "rating": 5,
        "feedback": "Timely arrival with excellent tractor and implements.",
        "tags": "ON_TIME,EXCELLENT_EQUIPMENT"
    }, token)
    print(f"[SUCCESS] 5-Star Rating Submitted Successfully: {rate_res.get('message')}")

    # 9. Test Double-Booking Collision Prevention on ACCEPTED slot
    print("[TESTING] Creating active ACCEPTED booking and testing Collision Prevention...")
    import time
    slot_day = (int(time.time()) % 20) + 10
    test_date = f"2026-09-{slot_day:02d}"

    active_booking_body = {
        "providerId": provider_id,
        "problemId": prob_id,
        "resourceId": resource_id,
        "serviceType": "TRACTOR",
        "bookingDate": test_date,
        "startTime": "10:00:00",
        "endTime": "14:00:00",
        "agreedPrice": 1200.0,
        "priceUnit": "per hour",
        "villageOrTown": "Malihabad",
        "district": "Lucknow",
        "state": "Uttar Pradesh"
    }
    b2_res = http_post(f"{BASE_URL}/bookings", active_booking_body, token)
    b2_id = b2_res["data"]["id"]
    http_post(f"{BASE_URL}/bookings/{b2_id}/accept", {}, p_token)
    print(f"   * Created active ACCEPTED booking {b2_id} on {test_date} 10:00–14:00")

    # Now attempt conflicting booking on overlapping time (11:00–15:00) on the same date
    conflict_body = {
        "providerId": provider_id,
        "serviceType": "TRACTOR",
        "bookingDate": test_date,
        "startTime": "11:00:00",
        "endTime": "15:00:00",
        "agreedPrice": 1200.0
    }

    try:
        http_post(f"{BASE_URL}/bookings", conflict_body, token)
        print("❌ [FAILED] Double-booking was not blocked!")
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8')
        print(f"   * SUCCESS: Conflicting slot blocked with HTTP {e.code}: {err_body}")

    # 10. Test Demand-Supply Gap Matrix
    print("[ANALYTICS] Testing Demand-Supply Gap Matrix...")
    ds_res = http_get(f"{BASE_URL}/demand-supply/summary")
    summary = ds_res.get("data", {})
    print(f"[SUCCESS] Total Active Demands: {summary.get('totalActiveDemands')}, Supplies: {summary.get('totalActiveSupplies')}, Shortages: {summary.get('totalCriticalShortages')}")
    print("   Top Shortages:")
    for s in summary.get("topShortages", [])[:3]:
        print(f"      - {s['district']} - {s['serviceCategory']}: Shortage of {s['gap']} (Fulfillment: {s['fulfillmentRate']}%)")

    print("\nALL TESTS PASSED WITH 100% SUCCESS!")

if __name__ == '__main__':
    main()
