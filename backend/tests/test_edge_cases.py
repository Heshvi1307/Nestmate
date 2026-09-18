"""
Comprehensive Edge-Case Test Suite for RentFair AI Backend.
Covers API validation, file uploads, PDF/text parsing, metadata extraction,
statutory boundary conditions, and hybrid engine failsafes.
"""

import io
import pytest
from fastapi.testclient import TestClient
from main import app
from services.lease_parser import extract_metadata, extract_text_from_pdf_bytes
from services.clause_analyzer import audit_agreement_text
from services.gemini_service import generate_counter_clause_hybrid

client = TestClient(app)

# ==========================================
# 1. API Endpoint & Validation Tests
# ==========================================

def test_health_check_endpoint():
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "online"
    assert "RentFair AI" in data["service"]

def test_samples_endpoint():
    res = client.get("/api/samples")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert len(data["samples"]) >= 4
    for sample in data["samples"]:
        assert "id" in sample
        assert "title" in sample
        assert "text" in sample
        assert len(sample["text"]) > 100

def test_audit_text_empty_and_short_payload():
    # Empty string
    res = client.post("/api/audit/text", json={"raw_text": ""})
    assert res.status_code == 400

    # Whitespace only
    res = client.post("/api/audit/text", json={"raw_text": "                    "})
    assert res.status_code == 400

    # Less than 30 characters
    res = client.post("/api/audit/text", json={"raw_text": "Short lease text."})
    assert res.status_code == 400

def test_audit_text_gibberish_and_non_alphanumeric():
    # 50 periods
    res = client.post("/api/audit/text", json={"raw_text": ".................................................."})
    assert res.status_code == 400
    assert "alphanumeric" in res.json()["detail"]

def test_audit_text_oversized_payload():
    huge_text = "Standard rental agreement text paragraph for testing. " * 12000
    assert len(huge_text) > 500000
    res = client.post("/api/audit/text", json={"raw_text": huge_text})
    assert res.status_code == 413
    assert "exceeds" in res.json()["detail"].lower()

def test_audit_upload_unsupported_extension():
    fake_file = io.BytesIO(b"malicious or binary content")
    res = client.post(
        "/api/audit/upload",
        files={"file": ("exploit.exe", fake_file, "application/octet-stream")}
    )
    assert res.status_code == 400
    assert "unsupported file format" in res.json()["detail"].lower()

def test_audit_upload_empty_file():
    empty_file = io.BytesIO(b"")
    res = client.post(
        "/api/audit/upload",
        files={"file": ("empty_deed.txt", empty_file, "text/plain")}
    )
    assert res.status_code == 400
    assert "empty" in res.json()["detail"].lower()

def test_audit_upload_valid_text_file():
    valid_text = (
        "RESIDENTIAL LEASE AGREEMENT\n\n"
        "This agreement is made between Mr. Suresh Patel and Mr. Amit Shah.\n"
        "1. Monthly rent is INR 25,000/-.\n"
        "2. Security deposit is INR 50,000/- refundable within 30 days.\n"
        "3. Landlord must give 24 hours prior written notice before entry."
    )
    file_bytes = io.BytesIO(valid_text.encode("utf-8"))
    res = client.post(
        "/api/audit/upload",
        files={"file": ("valid_lease.txt", file_bytes, "text/plain")}
    )
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["metadata"]["monthly_rent_inr"] == 25000
    assert data["metadata"]["security_deposit_inr"] == 50000
    assert data["audit"]["safety_score"] >= 85

def test_counter_clause_tones():
    tones = ["diplomatic", "firm", "statutory"]
    for tone in tones:
        res = client.post("/api/counter-clause", json={
            "category": "security_deposit",
            "original_clause": "Tenant pays 8 months deposit, non-refundable.",
            "concern_tone": tone
        })
        assert res.status_code == 200
        data = res.json()
        assert data["success"] is True
        assert "recommended_text" in data
        assert "sharing_message" in data
        assert len(data["recommended_text"]) > 20

def test_counter_clause_unknown_category_fallback():
    res = client.post("/api/counter-clause", json={
        "category": "unusual_custom_amenity_fee",
        "original_clause": "Tenant must pay monthly gym fee.",
        "concern_tone": "diplomatic"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "Model Tenancy Act" in data["recommended_text"]

# ==========================================
# 2. Metadata Extraction Edge Cases
# ==========================================

def test_metadata_extraction_variations():
    # Colon and currency variations
    t1 = "Monthly rent: INR 28,500/-. Security deposit: Rs. 57,000."
    m1 = extract_metadata(t1)
    assert m1["monthly_rent_inr"] == 28500
    assert m1["security_deposit_inr"] == 57000

    # Worded deposit and symbols
    t2 = "The Lessee shall pay ₹ 35,000 per month as rent and furnished INR 70,000 as refundable security deposit."
    m2 = extract_metadata(t2)
    assert m2["monthly_rent_inr"] == 35000
    assert m2["security_deposit_inr"] == 70000

    # Custom tenure extraction
    t3 = "The tenancy shall be for a minimum 6-month lock-in period."
    m3 = extract_metadata(t3)
    assert m3["tenure_months"] == 6

    t4 = "This agreement is executed for a period of 24 months."
    m4 = extract_metadata(t4)
    assert m4["tenure_months"] == 24

    t5 = "The term of this lease shall be 2 years."
    m5 = extract_metadata(t5)
    assert m5["tenure_months"] == 24

    # Indian honorifics in names
    t6 = "This agreement is executed between Smt. Radhika Mehta (Landlord) and Shri Aarav Deshmukh (Tenant)."
    m6 = extract_metadata(t6)
    assert m6["lessor_name"] == "Radhika Mehta"
    assert m6["lessee_name"] == "Aarav Deshmukh"

# ==========================================
# 3. PDF Parsing Error Handling
# ==========================================

def test_pdf_parsing_empty_bytes():
    with pytest.raises(ValueError, match="empty"):
        extract_text_from_pdf_bytes(b"")

def test_pdf_parsing_corrupt_bytes():
    with pytest.raises(ValueError, match="Corrupted or invalid"):
        extract_text_from_pdf_bytes(b"%PDF-1.4 completely corrupt garbage data that cannot parse")

# ==========================================
# 4. Statutory Heuristics & Boundary Tests
# ==========================================

def test_escalation_boundary_ten_percent():
    # Exactly 10% is the upper limit -> should trigger CAUTION (5 pt deduction), not HIGH_RISK
    text = (
        "RESIDENTIAL LEASE\n\n"
        "Rent is INR 20,000 per month. Security deposit is 2 months rent.\n"
        "Rent escalation shall be capped at 10% upon annual renewal.\n"
        "Landlord requires 24 hours written notice for inspection."
    )
    result = audit_agreement_text(text)
    esc_clause = next(c for c in result["audited_clauses"] if c["category"] == "rent_escalation")
    assert esc_clause["status"] == "CAUTION"
    assert esc_clause["risk_score_impact"] == 5

def test_escalation_boundary_fifteen_percent():
    # 15% exceeds statutory cap -> should trigger HIGH_RISK
    text = (
        "RESIDENTIAL LEASE\n\n"
        "Rent is INR 20,000 per month.\n"
        "The Lessor may hike rent by 15% at any time.\n"
    )
    result = audit_agreement_text(text)
    esc_clause = next(c for c in result["audited_clauses"] if c["category"] == "rent_escalation")
    assert esc_clause["status"] == "HIGH_RISK"
    assert esc_clause["risk_score_impact"] == 15

def test_deposit_delayed_refund_caution():
    # 60 days refund -> CAUTION
    text = (
        "LEAVE AND LICENSE AGREEMENT\n\n"
        "Deposit of INR 40,000/- (two months rent). "
        "The deposit shall be refunded 60 days after tenant vacates."
    )
    result = audit_agreement_text(text)
    dep_clause = next(c for c in result["audited_clauses"] if c["category"] == "security_deposit")
    assert dep_clause["status"] == "CAUTION"
    assert dep_clause["risk_score_impact"] == 10

def test_silent_agreement_baseline_preservation():
    # Simple silent contract should not raise false alarms
    text = (
        "SIMPLE AGREEMENT\n\n"
        "Tenant agrees to pay monthly rent of INR 20,000 on the 1st of each month. "
        "Security deposit of INR 40,000 paid to owner."
    )
    result = audit_agreement_text(text)
    assert 10 <= result["safety_score"] <= 100
    assert result["verdict"] in ["SAFE", "MODERATE_RISK", "HIGH_RISK_PREDATORY"]
    assert len(result["audited_clauses"]) == 5
