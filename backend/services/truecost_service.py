"""
TrueCost Index: Anti-Deception Living Cost & Fair Value Engine.
Pillar 4 of RentFair AI:
1. Unbundles hidden society maintenance, DG backup power, parking, and move-in fees.
2. Quantifies security deposit opportunity cost (7.1% liquid benchmark).
3. Evaluates commute cost and time burnout multiplier.
4. Micro-corridor fair market benchmarks for Ahmedabad, Bengaluru, Mumbai, Pune, and Delhi-NCR.
5. Flat A vs. Flat B 11-month Total Cost of Occupancy (TCO) faceoff.
6. Data-backed WhatsApp rent negotiation drafter.
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

# ==========================================
# 1. Hyper-Local Indian Corridor Benchmarks
# ==========================================

CORRIDOR_BENCHMARKS = {
    "ahmedabad": {
        "city_name": "Ahmedabad",
        "corridors": {
            "vastrapur": {
                "name": "Vastrapur / IIM-A Corridor",
                "avg_rent": {"1BHK": 15000, "2BHK": 24000, "3BHK": 35000},
                "avg_maintenance": {"1BHK": 1500, "2BHK": 2500, "3BHK": 4000},
                "typical_deposit_months": 2,
                "demand_index": "High",
                "tier": "Premium Central"
            },
            "sg_highway": {
                "name": "SG Highway / Gota / Tragad",
                "avg_rent": {"1BHK": 13000, "2BHK": 20000, "3BHK": 28000},
                "avg_maintenance": {"1BHK": 1200, "2BHK": 2200, "3BHK": 3200},
                "typical_deposit_months": 2,
                "demand_index": "Very High",
                "tier": "Tech & Corporate Corridor"
            },
            "prahlad_nagar": {
                "name": "Prahlad Nagar / Anandnagar",
                "avg_rent": {"1BHK": 16000, "2BHK": 25000, "3BHK": 38000},
                "avg_maintenance": {"1BHK": 1800, "2BHK": 2800, "3BHK": 4500},
                "typical_deposit_months": 2,
                "demand_index": "High",
                "tier": "Premium Commercial & Residential"
            },
            "bopal_south_bopal": {
                "name": "Bopal / South Bopal (SoBo)",
                "avg_rent": {"1BHK": 11000, "2BHK": 17000, "3BHK": 24000},
                "avg_maintenance": {"1BHK": 1000, "2BHK": 1800, "3BHK": 2800},
                "typical_deposit_months": 2,
                "demand_index": "High",
                "tier": "Modern Suburban Residential"
            },
            "gift_city_gandhinagar": {
                "name": "GIFT City / Gandhinagar Corridor",
                "avg_rent": {"1BHK": 14000, "2BHK": 22000, "3BHK": 32000},
                "avg_maintenance": {"1BHK": 1500, "2BHK": 2500, "3BHK": 3800},
                "typical_deposit_months": 2,
                "demand_index": "Rapid Growth",
                "tier": "Global Financial Tech Hub"
            }
        }
    },
    "bengaluru": {
        "city_name": "Bengaluru",
        "corridors": {
            "koramangala": {
                "name": "Koramangala",
                "avg_rent": {"1BHK": 22000, "2BHK": 38000, "3BHK": 55000},
                "avg_maintenance": {"1BHK": 2500, "2BHK": 4500, "3BHK": 7000},
                "typical_deposit_months": 6,
                "demand_index": "Extreme",
                "tier": "Startup Hub"
            },
            "hsr_layout": {
                "name": "HSR Layout",
                "avg_rent": {"1BHK": 20000, "2BHK": 34000, "3BHK": 48000},
                "avg_maintenance": {"1BHK": 2000, "2BHK": 3800, "3BHK": 6000},
                "typical_deposit_months": 6,
                "demand_index": "Extreme",
                "tier": "Primary Tech Corridor"
            },
            "whitefield": {
                "name": "Whitefield / ITPL",
                "avg_rent": {"1BHK": 18000, "2BHK": 28000, "3BHK": 42000},
                "avg_maintenance": {"1BHK": 2500, "2BHK": 4000, "3BHK": 6500},
                "typical_deposit_months": 5,
                "demand_index": "High",
                "tier": "IT Hub"
            }
        }
    },
    "mumbai": {
        "city_name": "Mumbai",
        "corridors": {
            "andheri_west": {
                "name": "Andheri West",
                "avg_rent": {"1BHK": 32000, "2BHK": 52000, "3BHK": 78000},
                "avg_maintenance": {"1BHK": 3000, "2BHK": 5000, "3BHK": 8000},
                "typical_deposit_months": 3,
                "demand_index": "Very High",
                "tier": "Western Suburb Commercial"
            },
            "powai": {
                "name": "Powai / Hiranandani",
                "avg_rent": {"1BHK": 35000, "2BHK": 58000, "3BHK": 85000},
                "avg_maintenance": {"1BHK": 3500, "2BHK": 6000, "3BHK": 9500},
                "typical_deposit_months": 3,
                "demand_index": "High",
                "tier": "Tech & Academic Township"
            }
        }
    }
}

ANNUAL_INVESTMENT_BENCHMARK_RATE = 0.071  # 7.1% per annum (RBI / Conservative Liquid Mutual Fund)
DEFAULT_TENURE_MONTHS = 11
MONTHLY_WORKING_DAYS = 22


# ==========================================
# 2. Pydantic Models for TrueCost
# ==========================================

class PropertyCostInput(BaseModel):
    property_name: Optional[str] = "Property"
    city: str = "ahmedabad"
    corridor_key: str = "vastrapur"
    bhk_type: str = "2BHK"  # 1BHK, 2BHK, 3BHK
    
    # Financials
    base_rent_inr: float
    security_deposit_inr: float
    society_maintenance_inr: float = 0.0
    dg_backup_units_kwh: float = 0.0
    dg_backup_rate_per_kwh: float = 24.0  # Commercial DG generator rate
    parking_fee_inr: float = 0.0
    one_time_brokerage_inr: float = 0.0
    one_time_society_move_in_fee_inr: float = 0.0
    tenure_months: int = 11

    # Commute & Burnout
    daily_commute_km_one_way: float = 0.0
    daily_travel_cost_inr: float = 0.0
    one_way_commute_minutes: float = 0.0


# ==========================================
# 3. Calculation Engines
# ==========================================

def calculate_single_true_cost(data: PropertyCostInput) -> Dict[str, Any]:
    """
    Computes total real monthly living drain, deposit opportunity cost,
    and compares against micro-corridor averages.
    """
    tenure = max(1, data.tenure_months)
    
    # 1. Deposit Opportunity Cost (Lost Wealth)
    # Monthly lost return if deposit was invested at 7.1%
    deposit_opp_cost_monthly = (data.security_deposit_inr * ANNUAL_INVESTMENT_BENCHMARK_RATE) / 12.0
    deposit_opp_cost_total_tenure = deposit_opp_cost_monthly * tenure

    # 2. DG Generator Surcharge
    monthly_dg_cost = data.dg_backup_units_kwh * data.dg_backup_rate_per_kwh

    # 3. Upfront Non-Refundable Costs Amortization
    upfront_non_refundable = data.one_time_brokerage_inr + data.one_time_society_move_in_fee_inr
    amortized_upfront_monthly = upfront_non_refundable / tenure

    # 4. Monthly Direct Living Outflow (excluding commute)
    monthly_direct_outflow = (
        data.base_rent_inr
        + data.society_maintenance_inr
        + monthly_dg_cost
        + data.parking_fee_inr
        + amortized_upfront_monthly
        + deposit_opp_cost_monthly
    )

    # 5. Commute & Burnout Costs
    monthly_commute_cash = data.daily_travel_cost_inr * MONTHLY_WORKING_DAYS
    monthly_commute_hours = (data.one_way_commute_minutes * 2 * MONTHLY_WORKING_DAYS) / 60.0
    
    # True Cost including commute
    total_effective_monthly_drain = monthly_direct_outflow + monthly_commute_cash
    total_11_month_spend = (total_effective_monthly_drain * tenure) + data.security_deposit_inr

    # 6. Hidden Cost Overhead Percentage
    hidden_extra_monthly = total_effective_monthly_drain - data.base_rent_inr
    hidden_overhead_pct = (hidden_extra_monthly / max(1.0, data.base_rent_inr)) * 100.0

    # 7. Corridor Benchmark Comparison
    city_data = CORRIDOR_BENCHMARKS.get(data.city.lower(), CORRIDOR_BENCHMARKS["ahmedabad"])
    corridor_info = city_data["corridors"].get(data.corridor_key.lower())
    
    benchmark_rent = None
    deviation_pct = 0.0
    verdict = "FAIR_MARKET"
    verdict_badge = "Fair Market Price"

    if corridor_info:
        benchmark_rent = float(corridor_info["avg_rent"].get(data.bhk_type, 22000))
        deviation_pct = ((data.base_rent_inr - benchmark_rent) / benchmark_rent) * 100.0

        if deviation_pct < -10.0:
            verdict = "UNDERPRICED_DEAL"
            verdict_badge = "Below Market (Steal Deal)"
        elif -10.0 <= deviation_pct <= 8.0:
            verdict = "FAIR_MARKET"
            verdict_badge = "Fair Market Standard"
        elif 8.0 < deviation_pct <= 20.0:
            verdict = "MODERATE_OVERPRICED"
            verdict_badge = "Moderately Overpriced"
        else:
            verdict = "PREDATORY_OVERPRICED"
            verdict_badge = "Highly Overpriced"

    return {
        "property_name": data.property_name,
        "base_rent": round(data.base_rent_inr, 2),
        "breakdown_monthly": {
            "base_rent": round(data.base_rent_inr, 2),
            "society_maintenance": round(data.society_maintenance_inr, 2),
            "dg_power_backup": round(monthly_dg_cost, 2),
            "parking_fee": round(data.parking_fee_inr, 2),
            "amortized_brokerage_and_fees": round(amortized_upfront_monthly, 2),
            "deposit_opportunity_cost": round(deposit_opp_cost_monthly, 2),
            "commute_expenses": round(monthly_commute_cash, 2),
        },
        "effective_monthly_cost": round(total_effective_monthly_drain, 2),
        "direct_monthly_outflow": round(monthly_direct_outflow, 2),
        "hidden_overhead_monthly": round(hidden_extra_monthly, 2),
        "hidden_overhead_pct": round(hidden_overhead_pct, 1),
        "deposit_analytics": {
            "deposit_amount": round(data.security_deposit_inr, 2),
            "deposit_to_rent_ratio": round(data.security_deposit_inr / max(1.0, data.base_rent_inr), 1),
            "monthly_lost_interest": round(deposit_opp_cost_monthly, 2),
            "total_tenure_lost_wealth": round(deposit_opp_cost_total_tenure, 2)
        },
        "commute_burnout": {
            "daily_km_roundtrip": round(data.daily_commute_km_one_way * 2, 1),
            "monthly_commute_cost": round(monthly_commute_cash, 2),
            "monthly_hours_lost_in_traffic": round(monthly_commute_hours, 1)
        },
        "corridor_analytics": {
            "corridor_name": corridor_info["name"] if corridor_info else "Custom Locality",
            "benchmark_avg_rent": benchmark_rent,
            "deviation_pct": round(deviation_pct, 1),
            "verdict": verdict,
            "verdict_badge": verdict_badge
        },
        "total_tenure_cash_needed": round(total_11_month_spend, 2)
    }


def compare_two_properties(flat_a: PropertyCostInput, flat_b: PropertyCostInput) -> Dict[str, Any]:
    """
    Side-by-side 11-month Total Cost of Occupancy (TCO) faceoff between two prospective flats.
    Declares the true financial and lifestyle winner.
    """
    res_a = calculate_single_true_cost(flat_a)
    res_b = calculate_single_true_cost(flat_b)

    monthly_diff = res_b["effective_monthly_cost"] - res_a["effective_monthly_cost"]
    tenure_diff = (res_b["effective_monthly_cost"] * flat_b.tenure_months) - (res_a["effective_monthly_cost"] * flat_a.tenure_months)

    if monthly_diff > 0:
        cheaper = "flat_a"
        winner_name = flat_a.property_name or "Flat A"
        savings_monthly = abs(monthly_diff)
        savings_tenure = abs(tenure_diff)
    else:
        cheaper = "flat_b"
        winner_name = flat_b.property_name or "Flat B"
        savings_monthly = abs(monthly_diff)
        savings_tenure = abs(tenure_diff)

    # Time burnout trade-off analysis
    time_diff_hours = res_b["commute_burnout"]["monthly_hours_lost_in_traffic"] - res_a["commute_burnout"]["monthly_hours_lost_in_traffic"]

    summary_verdict = (
        f"{winner_name} is the true financial winner, saving INR {round(savings_monthly):,}/month "
        f"(INR {round(savings_tenure):,} over {flat_a.tenure_months} months)."
    )

    if cheaper == "flat_a" and time_diff_hours > 5:
        summary_verdict += f" Additionally, Flat A saves {round(time_diff_hours, 1)} hours of travel time every month."
    elif cheaper == "flat_b" and time_diff_hours < -5:
        summary_verdict += f" However, note that Flat B requires {round(abs(time_diff_hours), 1)} more hours of commuting each month."

    return {
        "winner": cheaper,
        "winner_name": winner_name,
        "monthly_savings_inr": round(savings_monthly, 2),
        "total_tenure_savings_inr": round(savings_tenure, 2),
        "summary": summary_verdict,
        "flat_a": res_a,
        "flat_b": res_b
    }


def generate_whatsapp_negotiation(
    property_name: str,
    base_rent: float,
    corridor_benchmark_rent: float,
    maintenance: float,
    deposit_months: float,
    landlord_name: Optional[str] = "Owner"
) -> Dict[str, Any]:
    """
    Synthesizes a courteous, data-backed counter-offer citing local market pricing
    to negotiate lower rent or bundle maintenance charges.
    """
    proposed_rent = round((base_rent * 0.90) / 500) * 500  # 10% discount rounded to nearest 500
    all_inclusive_target = round(base_rent + (maintenance * 0.4))

    diff_pct = round(((base_rent - corridor_benchmark_rent) / max(1.0, corridor_benchmark_rent)) * 100, 1)

    message = (
        f"Hi {landlord_name},\n\n"
        f"Thank you for showing me {property_name}. I really liked the flat and am keen to finalize it for a long-term stay.\n\n"
        f"I reviewed the financials with our tenancy advisory data. In this corridor, the typical market benchmark for similar units is around INR {round(corridor_benchmark_rent):,}/month. "
        f"With the unbundled society maintenance (INR {round(maintenance):,}) and {round(deposit_months, 1)}-month security deposit, the effective monthly outflow comes out higher than average.\n\n"
        f"To close the agreement smoothly this week, I'd like to propose either:\n"
        f"1. Base rent of INR {round(proposed_rent):,}/month (plus maintenance), OR\n"
        f"2. All-inclusive rent of INR {round(all_inclusive_target):,}/month with society maintenance bundled.\n\n"
        f"I am ready with the token advance and will ensure punctual rent payment on the 1st of every month. Please let me know if this works for you.\n\n"
        f"Best regards."
    )

    import urllib.parse
    encoded_wa = urllib.parse.quote(message)
    whatsapp_url = f"https://wa.me/?text={encoded_wa}"

    return {
        "property_name": property_name,
        "current_rent": base_rent,
        "corridor_benchmark": corridor_benchmark_rent,
        "proposed_rent": proposed_rent,
        "all_inclusive_target": all_inclusive_target,
        "negotiation_message": message,
        "whatsapp_link": whatsapp_url
    }
