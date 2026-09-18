"""
Unit & Integration Tests for HarmonyMatch (Pillar 2).
Validates multi-dimensional lifestyle vector mathematics, cosine similarity,
friction detection, and Roommate Living Charter API endpoints.
"""

import pytest
from fastapi.testclient import TestClient
from main import app
from services.harmony_service import (
    LifestyleVector,
    calculate_compatibility,
    BENCHMARK_ROOMMATES
)

client = TestClient(app)

def test_get_harmony_candidates_endpoint():
    res = client.get("/api/harmony/candidates")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert len(data["candidates"]) >= 4
    for cand in data["candidates"]:
        assert "name" in cand
        assert "lifestyle_vector" in cand
        assert "cleanliness" in cand["lifestyle_vector"]

def test_harmony_match_benchmark_candidate():
    res = client.post("/api/harmony/match", json={
        "user_name": "Arjun",
        "user_vector": {
            "cleanliness": 8,
            "sleep_schedule": 4,
            "guest_policy": 4,
            "bill_discipline": 9,
            "noise_tolerance": 4,
            "dietary_kitchen": 6
        },
        "candidate_id": "priya_sde"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["candidate_name"] == "Priya Sharma"
    assert data["match"]["compatibility_score"] >= 90
    assert data["match"]["verdict"] == "HIGH_COMPATIBILITY"

def test_harmony_match_custom_vector():
    res = client.post("/api/harmony/match", json={
        "user_name": "Arjun",
        "user_vector": {
            "cleanliness": 7,
            "sleep_schedule": 3,
            "guest_policy": 3,
            "bill_discipline": 8,
            "noise_tolerance": 3,
            "dietary_kitchen": 5
        },
        "candidate_name": "Custom Candidate",
        "candidate_vector": {
            "cleanliness": 6,
            "sleep_schedule": 4,
            "guest_policy": 5,
            "bill_discipline": 7,
            "noise_tolerance": 4,
            "dietary_kitchen": 5
        }
    })
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert 70 <= data["match"]["compatibility_score"] <= 100

def test_harmony_match_missing_candidate_404():
    res = client.post("/api/harmony/match", json={
        "user_vector": {
            "cleanliness": 5, "sleep_schedule": 5, "guest_policy": 5,
            "bill_discipline": 5, "noise_tolerance": 5, "dietary_kitchen": 5
        },
        "candidate_id": "non_existent_profile_id"
    })
    assert res.status_code == 404

def test_identical_vectors_high_score():
    vec = LifestyleVector(
        cleanliness=8, sleep_schedule=3, guest_policy=4,
        bill_discipline=9, noise_tolerance=4, dietary_kitchen=5
    )
    result = calculate_compatibility(vec, vec)
    assert result["compatibility_score"] >= 95
    assert result["verdict"] == "HIGH_COMPATIBILITY"
    assert len(result["friction_points"]) == 0
    assert len(result["synergies"]) >= 4

def test_diametrically_opposed_vectors_friction():
    vec_a = LifestyleVector(
        cleanliness=10, sleep_schedule=1, guest_policy=1,
        bill_discipline=10, noise_tolerance=1, dietary_kitchen=1
    )
    vec_b = LifestyleVector(
        cleanliness=1, sleep_schedule=10, guest_policy=10,
        bill_discipline=1, noise_tolerance=10, dietary_kitchen=10
    )
    result = calculate_compatibility(vec_a, vec_b)
    assert result["compatibility_score"] < 50
    assert result["verdict"] == "HIGH_FRICTION_RISK"
    assert len(result["friction_points"]) >= 3

def test_charter_generation_endpoint():
    vec_a = {"cleanliness": 8, "sleep_schedule": 4, "guest_policy": 4, "bill_discipline": 9, "noise_tolerance": 4, "dietary_kitchen": 6}
    vec_b = {"cleanliness": 8, "sleep_schedule": 3, "guest_policy": 3, "bill_discipline": 9, "noise_tolerance": 3, "dietary_kitchen": 6}
    
    res = client.post("/api/harmony/charter", json={
        "user_name": "Arjun",
        "candidate_name": "Priya",
        "user_vector": vec_a,
        "candidate_vector": vec_b,
        "match_result": {
            "compatibility_score": 88,
            "friction_points": []
        }
    })
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "charter" in data
    assert len(data["charter"]["house_rules"]) >= 5
    assert "whatsapp_summary" in data["charter"]
