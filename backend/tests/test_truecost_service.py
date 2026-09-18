"""
Comprehensive Unit Tests for Pillar 4: TrueCost Index Engine.
Validates:
1. True monthly living cost calculation & hidden overhead calculation.
2. Deposit opportunity cost (7.1% liquid benchmark formula).
3. Commute burnout multiplier and monthly time loss.
4. Hyper-local corridor benchmark comparisons (Ahmedabad, Bengaluru, Mumbai).
5. Flat A vs. Flat B TCO comparison and winner declaration.
6. WhatsApp negotiation generation and link encoding.
7. Full API endpoints on FastAPI gateway.
"""

import pytest
from fastapi.testclient import TestClient
from main import app
from services.truecost_service import (
    PropertyCostInput,
    calculate_single_true_cost,
    compare_two_properties,
    generate_whatsapp_negotiation,
    CORRIDOR_BENCHMARKS
)

client = TestClient(app)


def test_corridor_benchmarks_structure():
    assert "ahmedabad" in CORRIDOR_BENCHMARKS
    assert "bengaluru" in CORRIDOR_BENCHMARKS
    assert "mumbai" in CORRIDOR_BENCHMARKS
    
    ahmedabad = CORRIDOR_BENCHMARKS["ahmedabad"]
    assert "vastrapur" in ahmedabad["corridors"]
    assert "sg_highway" in ahmedabad["corridors"]
    assert "prahlad_nagar" in ahmedabad["corridors"]
    assert "bopal_south_bopal" in ahmedabad["corridors"]
    assert "gift_city_gandhinagar" in ahmedabad["corridors"]


def test_calculate_single_true_cost_standard():
    prop = PropertyCostInput(
        property_name="Vastrapur 2BHK Residency",
        city="ahmedabad",
        corridor_key="vastrapur",
        bhk_type="2BHK",
        base_rent_inr=24000.0,
        security_deposit_inr=48000.0,
        society_maintenance_inr=2500.0,
        dg_backup_units_kwh=50.0,
        dg_backup_rate_per_kwh=24.0,  # 50 * 24 = 1200 INR
        parking_fee_inr=500.0,
        one_time_brokerage_inr=12000.0,
        one_time_society_move_in_fee_inr=1000.0,
        tenure_months=11,
        daily_commute_km_one_way=10.0,
        daily_travel_cost_inr=100.0,
        one_way_commute_minutes=30.0
    )

    result = calculate_single_true_cost(prop)

    # Opportunity cost: 48000 * 0.071 / 12 = 284.0
    expected_opp_cost = round((48000.0 * 0.071) / 12.0, 2)
    assert result["deposit_analytics"]["monthly_lost_interest"] == expected_opp_cost

    # Amortized upfront: (12000 + 1000) / 11 = 1181.82
    expected_amortized = round(13000.0 / 11.0, 2)
    assert result["breakdown_monthly"]["amortized_brokerage_and_fees"] == expected_amortized

    # Commute cash: 100 * 22 working days = 2200
    assert result["commute_burnout"]["monthly_commute_cost"] == 2200.0

    # Hours lost: (30 * 2 * 22) / 60 = 22.0 hours
    assert result["commute_burnout"]["monthly_hours_lost_in_traffic"] == 22.0

    # Effective monthly cost should be significantly higher than base rent
    assert result["effective_monthly_cost"] > result["base_rent"]
    assert result["hidden_overhead_monthly"] > 0
    assert result["hidden_overhead_pct"] > 15.0

    # Corridor benchmark check
    assert result["corridor_analytics"]["corridor_name"] == "Vastrapur / IIM-A Corridor"
    assert result["corridor_analytics"]["benchmark_avg_rent"] == 24000.0
    assert result["corridor_analytics"]["deviation_pct"] == 0.0
    assert result["corridor_analytics"]["verdict"] == "FAIR_MARKET"


def test_corridor_overpriced_and_underpriced():
    # Overpriced property
    high_prop = PropertyCostInput(
        property_name="Overpriced Flat",
        city="ahmedabad",
        corridor_key="vastrapur",
        bhk_type="2BHK",
        base_rent_inr=32000.0,  # 24k benchmark -> +33.3%
        security_deposit_inr=64000.0
    )
    high_res = calculate_single_true_cost(high_prop)
    assert high_res["corridor_analytics"]["verdict"] == "PREDATORY_OVERPRICED"
    assert high_res["corridor_analytics"]["deviation_pct"] > 20.0

    # Underpriced property
    low_prop = PropertyCostInput(
        property_name="Underpriced Flat",
        city="ahmedabad",
        corridor_key="vastrapur",
        bhk_type="2BHK",
        base_rent_inr=18000.0,  # 24k benchmark -> -25%
        security_deposit_inr=36000.0
    )
    low_res = calculate_single_true_cost(low_prop)
    assert low_res["corridor_analytics"]["verdict"] == "UNDERPRICED_DEAL"
    assert low_res["corridor_analytics"]["deviation_pct"] < -10.0


def test_compare_two_properties_declares_winner():
    flat_near = PropertyCostInput(
        property_name="Flat A - Close to Work",
        city="ahmedabad",
        corridor_key="vastrapur",
        bhk_type="2BHK",
        base_rent_inr=25000.0,
        security_deposit_inr=50000.0,
        society_maintenance_inr=2000.0,
        daily_commute_km_one_way=2.0,
        daily_travel_cost_inr=20.0,
        one_way_commute_minutes=10.0
    )

    flat_far = PropertyCostInput(
        property_name="Flat B - Far Suburb",
        city="ahmedabad",
        corridor_key="bopal_south_bopal",
        bhk_type="2BHK",
        base_rent_inr=19000.0,
        security_deposit_inr=38000.0,
        society_maintenance_inr=2000.0,
        one_time_brokerage_inr=19000.0,
        daily_commute_km_one_way=18.0,
        daily_travel_cost_inr=250.0,
        one_way_commute_minutes=55.0
    )

    comparison = compare_two_properties(flat_near, flat_far)
    
    assert "winner" in comparison
    assert "monthly_savings_inr" in comparison
    assert comparison["total_tenure_savings_inr"] > 0
    assert "Flat A" in comparison["summary"] or "Flat B" in comparison["summary"]
    assert "flat_a" in comparison and "flat_b" in comparison


def test_whatsapp_negotiation_generator():
    res = generate_whatsapp_negotiation(
        property_name="Dev Aurum 2BHK",
        base_rent=25000.0,
        corridor_benchmark_rent=22000.0,
        maintenance=2500.0,
        deposit_months=2.0,
        landlord_name="Patel Sahab"
    )

    assert "negotiation_message" in res
    assert "Patel Sahab" in res["negotiation_message"]
    assert "Dev Aurum 2BHK" in res["negotiation_message"]
    assert "INR 22,000" in res["negotiation_message"]
    assert "whatsapp_link" in res
    assert res["whatsapp_link"].startswith("https://wa.me/?text=")
    assert res["proposed_rent"] < res["current_rent"]


def test_api_truecost_corridors_endpoint():
    response = client.get("/api/truecost/corridors")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "cities" in data
    assert "ahmedabad" in data["cities"]


def test_api_truecost_calculate_endpoint():
    payload = {
        "property_name": "SG Highway Premium Flat",
        "city": "ahmedabad",
        "corridor_key": "sg_highway",
        "bhk_type": "2BHK",
        "base_rent_inr": 20000,
        "security_deposit_inr": 40000,
        "society_maintenance_inr": 2200,
        "dg_backup_units_kwh": 30,
        "parking_fee_inr": 0,
        "one_time_brokerage_inr": 10000,
        "one_time_society_move_in_fee_inr": 0,
        "tenure_months": 11,
        "daily_commute_km_one_way": 8,
        "daily_travel_cost_inr": 80,
        "one_way_commute_minutes": 25
    }

    response = client.post("/api/truecost/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "report" in data
    assert data["report"]["base_rent"] == 20000.0
    assert data["report"]["effective_monthly_cost"] > 20000.0
    assert "deposit_analytics" in data["report"]
    assert "corridor_analytics" in data["report"]


def test_api_truecost_compare_endpoint():
    flat_a = {
        "property_name": "Flat Alpha",
        "city": "ahmedabad",
        "corridor_key": "vastrapur",
        "bhk_type": "2BHK",
        "base_rent_inr": 23000,
        "security_deposit_inr": 46000,
        "society_maintenance_inr": 2000
    }
    flat_b = {
        "property_name": "Flat Beta",
        "city": "ahmedabad",
        "corridor_key": "sg_highway",
        "bhk_type": "2BHK",
        "base_rent_inr": 21000,
        "security_deposit_inr": 42000,
        "society_maintenance_inr": 1800
    }

    response = client.post("/api/truecost/compare", json={"flat_a": flat_a, "flat_b": flat_b})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "comparison" in data
    assert data["comparison"]["winner"] in ["flat_a", "flat_b"]


def test_api_truecost_negotiate_endpoint():
    payload = {
        "property_name": "Shilp Aaron 3BHK",
        "base_rent": 36000,
        "corridor_benchmark_rent": 32000,
        "maintenance": 3500,
        "deposit_months": 2,
        "landlord_name": "Mehta Ji"
    }

    response = client.post("/api/truecost/negotiate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "negotiation" in data
    assert "whatsapp_link" in data["negotiation"]
    assert "Mehta Ji" in data["negotiation"]["negotiation_message"]
