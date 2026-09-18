"""
Comprehensive Unit Tests for SnapFix Anti-Fraud & Triage Engine.
Validates:
1. Dynamic physical liveness challenges.
2. Hardware EXIF analysis, SHA-256 cryptographic hashing, and fraud heuristics.
3. GPS geofence distance verification.
4. Model Tenancy Act (MTA) Second Schedule liability classification.
5. Fair repair cost bounds in INR.
6. Full API endpoint roundtrips.
"""

import io
import pytest
from PIL import Image
from fastapi.testclient import TestClient
from main import app
from services.snapfix_service import (
    generate_liveness_challenge,
    verify_photo_authenticity,
    triage_damage_and_estimate,
    create_inspection_certificate,
    _haversine_distance_meters
)

client = TestClient(app)

def _create_dummy_image_bytes(width=800, height=600, color=(100, 150, 200)) -> bytes:
    img = Image.new("RGB", (width, height), color=color)
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()

def test_liveness_challenge_generation():
    ch = generate_liveness_challenge()
    assert "challenge_code" in ch
    assert ch["challenge_code"].startswith("RF-")
    assert "timestamp_iso" in ch
    assert ch["expires_in_seconds"] == 600
    assert len(ch["instructions"]) > 10

def test_photo_authenticity_clean_live_capture():
    img_bytes = _create_dummy_image_bytes(width=1024, height=768)
    ch = generate_liveness_challenge()
    
    auth = verify_photo_authenticity(img_bytes, challenge_code=ch["challenge_code"])
    assert len(auth["sha256_hash"]) == 64
    assert auth["trust_score"] >= 80
    assert auth["verdict"] == "AUTHENTIC_LIVE_CAPTURE"
    assert auth["dimensions"] == "1024x768"
    assert auth["is_admissible_evidence"] is True
    assert auth["challenge_verified"] is True

def test_photo_authenticity_empty_image_rejected():
    with pytest.raises(ValueError, match="empty"):
        verify_photo_authenticity(b"")

def test_photo_authenticity_suspicious_dimensions():
    # Low resolution thumbnail (<400px)
    tiny_bytes = _create_dummy_image_bytes(width=150, height=150)
    auth = verify_photo_authenticity(tiny_bytes)
    assert any("low" in flag.lower() for flag in auth["fraud_flags"])
    assert auth["trust_score"] < 80

def test_haversine_geofence_calculation():
    # Vastrapur, Ahmedabad: (23.0350, 72.5293)
    # Location 100m away
    d_close = _haversine_distance_meters(23.0350, 72.5293, 23.0355, 72.5298)
    assert d_close < 150  # within 150m

    # Delhi (28.6139, 77.2090) vs Ahmedabad (23.0350, 72.5293) -> ~770 km
    d_far = _haversine_distance_meters(23.0350, 72.5293, 28.6139, 77.2090)
    assert d_far > 700000

def test_damage_triage_plumbing_pipe_leak_landlord_duty():
    triage = triage_damage_and_estimate("plumbing_pipe_leak")
    assert triage["category"] == "PLUMBING"
    assert triage["statutory_liability"] == "LANDLORD"
    assert "Second Schedule, Part A" in triage["mta_legal_basis"]
    assert triage["estimated_cost_inr"]["min"] == 800
    assert triage["estimated_cost_inr"]["max"] == 2500

def test_damage_triage_tap_washer_tenant_duty():
    triage = triage_damage_and_estimate("plumbing_tap_washer")
    assert triage["category"] == "PLUMBING"
    assert triage["statutory_liability"] == "TENANT"
    assert "Part B" in triage["mta_legal_basis"]
    assert triage["estimated_cost_inr"]["fair_market_average"] == 250

def test_damage_triage_electrical_mcb_emergency():
    triage = triage_damage_and_estimate("electrical_mcb_short")
    assert triage["category"] == "ELECTRICAL"
    assert triage["severity"] == "CRITICAL_EMERGENCY"
    assert triage["statutory_liability"] == "LANDLORD"
    assert triage["statutory_turnaround_hours"] == 12

def test_damage_triage_wall_seepage():
    triage = triage_damage_and_estimate("wall_seepage_dampness")
    assert triage["category"] == "STRUCTURAL_SEEPAGE"
    assert triage["statutory_liability"] == "LANDLORD"
    assert triage["estimated_cost_inr"]["fair_market_average"] == 4800

def test_certificate_creation_and_whatsapp_link():
    img_bytes = _create_dummy_image_bytes()
    auth = verify_photo_authenticity(img_bytes)
    triage = triage_damage_and_estimate("plumbing_pipe_leak")

    cert = create_inspection_certificate(
        ticket_id="TICK-TEST-123",
        property_address="Flat 402, Green Residency, Ahmedabad",
        tenant_name="Het Patel",
        landlord_name="Vikramaditya Sanghavi",
        authenticity_report=auth,
        triage_report=triage
    )

    assert cert["certificate_id"].startswith("CERT-SNAPFIX-")
    assert cert["status"] == "AWAITING_LANDLORD_COUNTERSIGN"
    assert "wa.me" in cert["whatsapp_counter_sign_link"]
    assert "Het Patel" in cert["whatsapp_preview_text"]
    assert auth["sha256_hash"][:16] in cert["whatsapp_preview_text"]

def test_snapfix_api_challenge_endpoint():
    res = client.get("/api/snapfix/challenge")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "challenge" in data
    assert data["challenge"]["challenge_code"].startswith("RF-")

def test_snapfix_api_taxonomy_endpoint():
    res = client.get("/api/snapfix/taxonomy")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "plumbing_pipe_leak" in data["categories"]
    assert "wall_seepage_dampness" in data["categories"]

def test_snapfix_api_verify_and_triage_endpoint():
    img_bytes = _create_dummy_image_bytes(width=900, height=900)
    ch_res = client.get("/api/snapfix/challenge").json()
    ch_code = ch_res["challenge"]["challenge_code"]

    res = client.post(
        "/api/snapfix/verify-and-triage",
        files={"file": ("move_in_crack.jpg", img_bytes, "image/jpeg")},
        data={
            "issue_type": "wall_seepage_dampness",
            "description": "Visible water seepage and plaster efflorescence near living room window",
            "challenge_code": ch_code,
            "property_address": "The Solitaire Terraces Flat 402",
            "tenant_name": "Het Patel",
            "landlord_name": "Vikramaditya Sanghavi"
        }
    )

    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "ticket_id" in data
    assert "authenticity" in data
    assert len(data["authenticity"]["sha256_hash"]) == 64
    assert data["triage"]["statutory_liability"] == "LANDLORD"
    assert "certificate" in data
    assert "wa.me" in data["certificate"]["whatsapp_counter_sign_link"]
