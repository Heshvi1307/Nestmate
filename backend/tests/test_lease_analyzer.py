"""
Unit Tests for RentFair AI - Legal Lease Analyzer
Validates scoring against real-world public domain test cases and statutory benchmarks.
"""

import pytest
from services.clause_analyzer import audit_agreement_text
from services.sample_agreements import SAMPLE_AGREEMENTS

def test_mohua_official_benchmark_case():
    """
    Public Case 2: Ministry of Housing & Urban Affairs (MoHUA) Model Lease
    Must score >= 85 and receive a 'SAFE' verdict.
    """
    text = SAMPLE_AGREEMENTS["mohua_official_mta"]["text"]
    result = audit_agreement_text(text)

    assert result["safety_score"] >= 85, f"Expected safe score, got {result['safety_score']}"
    assert result["verdict"] == "SAFE"
    assert result["metrics"]["high_risk_flags"] == 0
    assert result["metrics"]["safe_clauses"] >= 4

def test_bangalore_metro_deposit_trap_case():
    """
    Public Case 1: Bengaluru Metro 8-month deposit lockup & painting deduction
    Must be identified as high risk with deposit and entry violations.
    """
    text = SAMPLE_AGREEMENTS["bangalore_metro_trap"]["text"]
    result = audit_agreement_text(text)

    assert result["safety_score"] < 65
    assert result["metrics"]["high_risk_flags"] >= 2
    
    categories = [c["category"] for c in result["audited_clauses"] if c["status"] == "HIGH_RISK"]
    assert "security_deposit" in categories
    assert "landlord_entry" in categories

def test_unlawful_lockout_dispute_case():
    """
    Public Case 3: High Court & Consumer Forum precedent on essential utilities cutoff
    Must flag unlawful eviction and unfair structural repair shifting.
    """
    text = SAMPLE_AGREEMENTS["unlawful_lockout_dispute"]["text"]
    result = audit_agreement_text(text)

    assert result["safety_score"] < 50
    assert result["verdict"] == "HIGH_RISK_PREDATORY"

    categories = [c["category"] for c in result["audited_clauses"] if c["status"] == "HIGH_RISK"]
    assert "eviction_lockin" in categories
    assert "maintenance_liability" in categories

def test_student_pg_coliving_case():
    """
    Public Case 4: Student PG agreement with non-refundable deductions & curfew audits.
    """
    text = SAMPLE_AGREEMENTS["student_pg_coliving"]["text"]
    result = audit_agreement_text(text)

    assert result["safety_score"] <= 75
    assert result["metrics"]["total_clauses_reviewed"] == 5
