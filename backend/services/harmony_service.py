"""
HarmonyMatch - Multi-Dimensional Flatmate Compatibility & Living Charter Engine.
Pillar 2: Uses weighted lifestyle vector mathematics, cosine similarity,
friction-gap diagnostics, and Gemini hybrid living charter generation.
"""

import math
import os
import json
import logging
import requests
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

logger = logging.getLogger("rentfair.harmony_engine")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
GEMINI_MODEL = "gemini-2.5-flash"
BASE_GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"

# Dimension Weights reflecting real-world co-living conflict frequency
# (Cleanliness and Sleep differences are the #1 & #2 reasons urban flatmates break leases)
VECTOR_WEIGHTS: Dict[str, float] = {
    "cleanliness": 1.30,
    "sleep_schedule": 1.25,
    "guest_policy": 1.15,
    "bill_discipline": 1.10,
    "noise_tolerance": 1.00,
    "dietary_kitchen": 0.90,
}

DIMENSION_METADATA: Dict[str, Dict[str, str]] = {
    "cleanliness": {
        "title": "Cleanliness & Chores",
        "low_label": "Casual / Weekend Pass",
        "high_label": "Daily Sanitize / Strict Dishes"
    },
    "sleep_schedule": {
        "title": "Circadian Sleep Rhythm",
        "low_label": "Early Bird (Sleeps by 10 PM)",
        "high_label": "Night Owl (Up past 2 AM)"
    },
    "guest_policy": {
        "title": "Social & Guest Boundaries",
        "low_label": "Quiet Sanctuary / No Parties",
        "high_label": "Open House / Frequent Friends"
    },
    "bill_discipline": {
        "title": "Expense Splitting Discipline",
        "low_label": "Casual / Month-End",
        "high_label": "Instant UPI / Splitwise Strict"
    },
    "noise_tolerance": {
        "title": "Noise & Focus Tolerance",
        "low_label": "Library Quiet / Headphones",
        "high_label": "Lively / Speakers & TV"
    },
    "dietary_kitchen": {
        "title": "Kitchen & Dietary Synergy",
        "low_label": "Strict Veg / Separate Cookware",
        "high_label": "Shared Kitchen / Non-Veg Open"
    }
}

class LifestyleVector(BaseModel):
    cleanliness: int = Field(5, ge=1, le=10)
    sleep_schedule: int = Field(5, ge=1, le=10)
    guest_policy: int = Field(5, ge=1, le=10)
    bill_discipline: int = Field(5, ge=1, le=10)
    noise_tolerance: int = Field(5, ge=1, le=10)
    dietary_kitchen: int = Field(5, ge=1, le=10)

class RoommateProfile(BaseModel):
    id: str
    name: str
    avatar_url: Optional[str] = None
    age: int
    occupation: str
    city: str
    budget_range_inr: str
    work_style: str  # "Remote WFH", "Hybrid", "In-Office"
    bio: str
    lifestyle_vector: LifestyleVector

# Pre-Loaded Benchmark Profiles for Instant Testing
BENCHMARK_ROOMMATES: List[RoommateProfile] = [
    RoommateProfile(
        id="priya_sde",
        name="Priya Sharma",
        age=24,
        occupation="Senior Software Engineer @ FinTech",
        city="Bengaluru / Outer Ring Road",
        budget_range_inr="₹18,000 - ₹24,000",
        work_style="Hybrid (3 Days WFH)",
        bio="Organized, calm coder. Sleep by 11:30 PM, love weekend chai brewing. Looking for tidy flatmate who settles bills on Splitwise promptly.",
        lifestyle_vector=LifestyleVector(
            cleanliness=8,
            sleep_schedule=4,
            guest_policy=4,
            bill_discipline=9,
            noise_tolerance=4,
            dietary_kitchen=6
        )
    ),
    RoommateProfile(
        id="rohan_upsc",
        name="Rohan Narayanan",
        age=26,
        occupation="Civil Services / UPSC Aspirant",
        city="Ahmedabad / SG Highway",
        budget_range_inr="₹12,000 - ₹16,000",
        work_style="Full-Time Study / Library",
        bio="Early riser (5:30 AM). Need dedicated quiet hours after 9 PM. Strictly vegetarian kitchen preferences, very disciplined with common chores.",
        lifestyle_vector=LifestyleVector(
            cleanliness=9,
            sleep_schedule=2,
            guest_policy=2,
            bill_discipline=10,
            noise_tolerance=2,
            dietary_kitchen=2
        )
    ),
    RoommateProfile(
        id="kabir_creative",
        name="Kabir Sen",
        age=23,
        occupation="Creative Art Director & Musician",
        city="Mumbai / Bandra West",
        budget_range_inr="₹25,000 - ₹32,000",
        work_style="Remote WFH",
        bio="Night owl designer working on European client hours. Play guitar with headphones, enjoy occasional weekend jam sessions. Laid back and friendly.",
        lifestyle_vector=LifestyleVector(
            cleanliness=5,
            sleep_schedule=9,
            guest_policy=8,
            bill_discipline=7,
            noise_tolerance=8,
            dietary_kitchen=8
        )
    ),
    RoommateProfile(
        id="ananya_medic",
        name="Dr. Ananya Roy",
        age=27,
        occupation="Resident Physician",
        city="Pune / Kothrud",
        budget_range_inr="₹16,000 - ₹22,000",
        work_style="Hospital Shift Rotation",
        bio="Unpredictable emergency hospital shifts. Need uninterrupted sleep when post-call. Quiet, respectful, happy to share kitchen and split groceries equally.",
        lifestyle_vector=LifestyleVector(
            cleanliness=8,
            sleep_schedule=6,
            guest_policy=3,
            bill_discipline=9,
            noise_tolerance=3,
            dietary_kitchen=7
        )
    )
]


def calculate_compatibility(user_vec: LifestyleVector, candidate_vec: LifestyleVector) -> Dict[str, Any]:
    """
    Computes weighted multi-dimensional lifestyle compatibility:
    1. Weighted Cosine Similarity between vector angles.
    2. Normalized Euclidean distance penalty for large dimension gaps.
    3. Categorizes High Synergy vs Critical Friction warnings.
    """
    u_dict = user_vec.model_dump()
    c_dict = candidate_vec.model_dump()

    dot_product = 0.0
    u_norm_sq = 0.0
    c_norm_sq = 0.0
    weighted_diff_sum = 0.0
    total_weight = sum(VECTOR_WEIGHTS.values())

    dimension_breakdown = []
    friction_points = []
    synergies = []

    for dim, weight in VECTOR_WEIGHTS.items():
        u_val = float(u_dict[dim])
        c_val = float(c_dict[dim])
        diff = abs(u_val - c_val)

        # Dot product and norms for Cosine component
        dot_product += weight * u_val * c_val
        u_norm_sq += weight * (u_val ** 2)
        c_norm_sq += weight * (c_val ** 2)

        # Distance penalty
        weighted_diff_sum += weight * diff

        # Dimension match percentage (10 = identical, 1 = maximum 9-point gap)
        dim_match_pct = max(10, int(100 - (diff / 9.0 * 100)))

        meta = DIMENSION_METADATA.get(dim, {"title": dim.replace('_', ' ').title()})
        dimension_breakdown.append({
            "dimension": dim,
            "title": meta["title"],
            "user_val": int(u_val),
            "candidate_val": int(c_val),
            "diff": int(diff),
            "match_pct": dim_match_pct,
            "weight": weight
        })

        # Check for Critical Friction (gap >= 4 on high-impact lifestyle habits)
        if diff >= 4:
            if dim == "sleep_schedule":
                friction_points.append(
                    "Circadian Clash: One flatmate sleeps early while the other works late, risking nocturnal light and noise disruptions."
                )
            elif dim == "cleanliness":
                friction_points.append(
                    "Chore Friction: Differing thresholds for dishwashing, kitchen counters, and weekend cleaning rotations."
                )
            elif dim == "guest_policy":
                friction_points.append(
                    "Social Boundary Gap: One party prefers a quiet private home, while the other welcomes frequent guests or gatherings."
                )
            elif dim == "dietary_kitchen":
                friction_points.append(
                    "Kitchen Synergy Alert: Differing expectations regarding non-vegetarian cooking or cookware segregation."
                )
            elif dim == "noise_tolerance":
                friction_points.append(
                    "Noise Sensitivity: Differing tolerance for speaker playback, phone calls, or daytime WFH focus."
                )
            else:
                friction_points.append(f"Lifestyle divergence on {meta['title']}.")
        elif diff <= 1:
            # High Synergy (gap <= 1)
            synergies.append(f"Strong alignment on {meta['title']} ({dim_match_pct}% match).")

    # Cosine Similarity metric
    cosine_sim = dot_product / (math.sqrt(u_norm_sq) * math.sqrt(c_norm_sq)) if u_norm_sq > 0 and c_norm_sq > 0 else 0.5
    
    # Normalized penalty metric (max possible weighted diff is 9.0 * total_weight)
    max_possible_diff = 9.0 * total_weight
    distance_score = 1.0 - (weighted_diff_sum / max_possible_diff)

    # Composite Score: 60% distance alignment + 40% angular cosine direction
    composite_raw = (0.60 * distance_score + 0.40 * cosine_sim) * 100.0
    final_score = max(15, min(99, int(round(composite_raw))))

    if final_score >= 82:
        compatibility_badge = "Excellent Co-Living Synergy"
        verdict = "HIGH_COMPATIBILITY"
        color = "emerald"
        summary = "You share closely aligned lifestyle rhythms and domestic expectations. Minimal risk of roommate friction."
    elif final_score >= 65:
        compatibility_badge = "Moderate Alignment (Charter Recommended)"
        verdict = "MODERATE_COMPATIBILITY"
        color = "amber"
        summary = "Compatible on foundational values with minor schedule or social differences. Setting up a mutual Living Charter will resolve potential friction."
    else:
        compatibility_badge = "High Friction Potential"
        verdict = "HIGH_FRICTION_RISK"
        color = "rose"
        summary = "Substantial lifestyle divergence in sleep or cleanliness habits. Cohabitation may lead to frequent disputes without firm ground rules."

    return {
        "compatibility_score": final_score,
        "verdict": verdict,
        "badge": compatibility_badge,
        "badge_color": color,
        "summary": summary,
        "friction_points": friction_points,
        "synergies": synergies,
        "dimension_breakdown": dimension_breakdown
    }


def generate_living_charter_hybrid(
    user_name: str,
    candidate_name: str,
    user_vec: LifestyleVector,
    candidate_vec: LifestyleVector,
    match_result: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Generates a legally aligned, comprehensive 'Roommate Living Charter'
    customized to both lifestyles to prevent domestic disputes before moving in.
    """
    prompt = (
        f"You are RentFair AI's Co-Living Mediator drafting a Roommate Living Charter.\n"
        f"Roommate 1: {user_name}\n"
        f"Roommate 2: {candidate_name}\n"
        f"Compatibility Score: {match_result['compatibility_score']}%\n"
        f"Identified Friction Warnings: {json.dumps(match_result['friction_points'])}\n"
        f"Draft 5 concise, legally sound, actionable house rules covering:\n"
        f"1. Quiet Hours & Sleep Respect\n"
        f"2. Kitchen & Dishwashing Protocol\n"
        f"3. Guest & Overnight Notice\n"
        f"4. Utility & Common Expense Splitting (Splitwise/UPI deadline)\n"
        f"5. Dispute Resolution & Mediation\n"
        f"Output ONLY valid JSON with keys 'title', 'house_rules' (list of 5 objects with 'category', 'rule_text'), 'whatsapp_summary'."
    )

    if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here":
        try:
            url = f"{BASE_GEMINI_URL.format(model=GEMINI_MODEL)}?key={GEMINI_API_KEY}"
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.2,
                    "responseMimeType": "application/json",
                    "thinkingConfig": {"thinkingBudget": 0}
                }
            }
            res = requests.post(url, json=payload, timeout=3.0)
            if res.status_code == 200:
                content = res.json()["candidates"][0]["content"]["parts"][0]["text"]
                # Clean JSON
                clean = content.strip()
                if "{" in clean and "}" in clean:
                    clean = clean[clean.find("{"):clean.rfind("}")+1]
                data = json.loads(clean)
                data["engine_used"] = GEMINI_MODEL
                data["engine_badge"] = "Gemini 2.5 Flash (Synthesized Charter)"
                return data
        except Exception as ex:
            logger.info(f"Charter LLM timed out or failed: {str(ex)}. Using deterministic charter.")

    # Deterministic Statutory Fallback Charter
    quiet_start = "11:00 PM" if user_vec.sleep_schedule <= 5 else "12:30 AM"
    rules = [
        {
            "category": "Quiet Hours & Sleep Sanctuary",
            "rule_text": f"Mandatory quiet hours begin at {quiet_start} through 7:30 AM on weekdays. Instrumental music, speaker calls, and bright common-area lighting must transition to private bedrooms with headphones."
        },
        {
            "category": "Kitchen & Dish Sanitation",
            "rule_text": "Common sink must be cleared within 3 hours of cooking. No overnight soaking of dirty pans. Groceries in shared refrigerator must be labeled with owner initials; shared staples (oil, salt, spices) split 50/50."
        },
        {
            "category": "Guest Policy & Social Hosting",
            "rule_text": "Any guest staying past 10:00 PM requires at least 4 hours advance WhatsApp notice. Overnight stays are limited to a maximum of two consecutive nights per week unless mutually agreed in writing."
        },
        {
            "category": "Bill Splitting & UPI Timelines",
            "rule_text": "Electricity, Wi-Fi, and society maintenance invoices shall be logged on Splitwise within 24 hours of receipt. All roommates agree to settle outstanding dues within 48 hours of invoice posting."
        },
        {
            "category": "Dispute Mediation Protocol",
            "rule_text": "Disagreements over common cleanliness or noise shall be discussed directly in a monthly house check-in over tea rather than passive-aggressive notes. If unresolved, parties agree to mutually divide chores on a fixed weekly roster."
        }
    ]

    whatsapp_msg = (
        f"Hey {candidate_name}! 👋 I ran our lifestyle vectors through RentFair AI's HarmonyMatch. "
        f"We scored a {match_result['compatibility_score']}% co-living synergy! 🎯 "
        f"To keep things smooth and dispute-free before we sign the lease, here is our proposed 5-point Living Charter: "
        f"\n1. Quiet hours from {quiet_start}\n2. Clean sink daily\n3. Advance guest notice\n4. 48hr UPI bill settlement\n"
        f"Take a look and let me know if you'd like to adjust anything!"
    )

    return {
        "title": f"Mutual Co-Living Living Charter: {user_name} & {candidate_name}",
        "engine_used": "deterministic-harmony-engine",
        "engine_badge": "RentFair Statutory Charter Engine (Offline Failsafe)",
        "house_rules": rules,
        "whatsapp_summary": whatsapp_msg
    }
