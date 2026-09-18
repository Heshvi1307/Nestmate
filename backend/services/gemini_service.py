"""
Hybrid Intelligence Engine: Gemini 2.0 Flash + Deterministic Statutory Fallback
Designed to ensure 100% demo reliability under congested hackathon venue Wi-Fi or API hiccups.

1. Primary: Google Gemini 2.0 Flash (Fast, context-rich reasoning, customized negotiation drafts).
2. Fallback: Embedded Deterministic Model Tenancy Act (MTA) Heuristic Parser.
"""

import os
import json
import logging
import requests
from typing import Dict, Any, Optional
from dotenv import load_dotenv
from .clause_analyzer import audit_agreement_text

load_dotenv()

logger = logging.getLogger("rentfair.hybrid_engine")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

LEGAL_SYSTEM_PROMPT = """You are RentFair AI's Senior Tenancy Law Auditor, evaluating a residential lease against the Indian Model Tenancy Act (MTA), 2021.
Audit the following rental agreement text and return ONLY valid raw JSON (no markdown fences, no backticks) with this exact schema:
{
  "safety_score": <integer 10-100>,
  "verdict": "<SAFE | MODERATE_RISK | HIGH_RISK_PREDATORY>",
  "verdict_color": "<emerald | amber | rose>",
  "verdict_summary": "<1-2 sentence executive legal assessment>",
  "metrics": {
    "total_clauses_reviewed": <int>,
    "high_risk_flags": <int>,
    "caution_flags": <int>,
    "safe_clauses": <int>
  },
  "audited_clauses": [
    {
      "category": "<security_deposit | landlord_entry | rent_escalation | maintenance_liability | eviction_lockin>",
      "title": "<Concise clause title>",
      "clause_text": "<verbatim excerpt from agreement>",
      "status": "<HIGH_RISK | CAUTION | SAFE>",
      "risk_score_impact": <int deduction>,
      "statutory_reference": "<e.g. Model Tenancy Act Section 11 / 15 / 20>",
      "issue_summary": "<Why this breaches standard law>",
      "plain_english_impact": "<What this means for the tenant's wallet/privacy>",
      "recommended_counter_clause": "<Diplomatic, legally sound replacement clause>"
    }
  ]
}"""

def audit_with_hybrid_engine(raw_text: str) -> Dict[str, Any]:
    """
    Attempts Gemini 2.0 Flash primary audit with a 4.5s timeout.
    Seamlessly falls back to local deterministic MTA heuristics if API is missing or fails.
    """
    # 1. Check if Gemini API Key is configured
    if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here":
        try:
            url = f"{GEMINI_ENDPOINT}?key={GEMINI_API_KEY}"
            payload = {
                "contents": [
                    {
                        "role": "user",
                        "parts": [
                            {"text": f"{LEGAL_SYSTEM_PROMPT}\n\nAGREEMENT TEXT TO AUDIT:\n{raw_text}"}
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.2,
                    "responseMimeType": "application/json"
                }
            }

            # 4.5-second fail-fast timeout to prevent live demo UI freeze
            response = requests.post(url, json=payload, timeout=4.5)
            
            if response.status_code == 200:
                data = response.json()
                content_text = data["candidates"][0]["content"]["parts"][0]["text"]
                # Clean up any residual markdown backticks if returned
                clean_json_str = content_text.strip()
                if clean_json_str.startswith("```json"):
                    clean_json_str = clean_json_str[7:]
                if clean_json_str.startswith("```"):
                    clean_json_str = clean_json_str[3:]
                if clean_json_str.endswith("```"):
                    clean_json_str = clean_json_str[:-3]
                
                parsed_audit = json.loads(clean_json_str.strip())
                parsed_audit["engine_used"] = "gemini-2.0-flash"
                parsed_audit["engine_badge"] = "Gemini 2.0 Flash (Active AI)"
                return parsed_audit
            else:
                logger.warning(f"Gemini API returned status {response.status_code}. Using statutory fallback.")
        except Exception as ex:
            logger.warning(f"Gemini primary failed or timed out ({str(ex)}). Using statutory fallback.")

    # 2. Deterministic Fallback Engine (Runs locally in <10ms)
    fallback_result = audit_agreement_text(raw_text)
    fallback_result["engine_used"] = "deterministic-mta-engine"
    fallback_result["engine_badge"] = "MTA Statutory Rule Engine (Offline Failsafe)"
    return fallback_result


def generate_counter_clause_hybrid(category: str, original_clause: str, tone: str = "diplomatic") -> Dict[str, Any]:
    """
    Generates tailored counter-clauses with Gemini 2.0 Flash or local statutory templates.
    """
    if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here":
        try:
            url = f"{GEMINI_ENDPOINT}?key={GEMINI_API_KEY}"
            prompt = (
                f"You are a legal assistant drafting a counter-clause for a residential tenant in India.\n"
                f"Category: {category}\n"
                f"Original Clause: {original_clause}\n"
                f"Requested Tone: {tone} (diplomatic / firm / statutory)\n"
                f"Reference: Indian Model Tenancy Act, 2021.\n"
                f"Output JSON with keys 'recommended_text' and 'sharing_message' (ready for WhatsApp)."
            )
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.4,
                    "responseMimeType": "application/json"
                }
            }
            res = requests.post(url, json=payload, timeout=3.5)
            if res.status_code == 200:
                result = res.json()["candidates"][0]["content"]["parts"][0]["text"]
                clean_json = json.loads(result)
                return {
                    "success": True,
                    "category": category,
                    "engine_used": "gemini-2.0-flash",
                    "recommended_text": clean_json.get("recommended_text", ""),
                    "sharing_message": clean_json.get("sharing_message", "")
                }
        except Exception:
            pass

    # Deterministic Fallback Templates
    base_templates = {
        "security_deposit": (
            "The Tenant agrees to furnish a security deposit equivalent to two (2) months' rent. "
            "The Landlord shall refund the full deposit within thirty (30) days of vacating, "
            "subject only to mutually verified deductions for unpaid utility charges or actual structural damage."
        ),
        "landlord_entry": (
            "The Landlord or designated agents shall provide a minimum of twenty-four (24) hours' prior written "
            "notice before carrying out any inspection, with visits restricted between 8:00 AM and 7:00 PM."
        ),
        "rent_escalation": (
            "The monthly rent shall remain fixed for the duration of the 11-month agreement. Any subsequent "
            "renewal escalation shall not exceed 5% and must be communicated in writing at least 90 days prior to expiry."
        ),
        "maintenance_liability": (
            "The Landlord shall bear sole responsibility for structural repairs, major plumbing lines, and external "
            "wall seepage. The Tenant shall only be responsible for routine consumable repairs (bulbs, tap washers) under INR 500."
        ),
        "eviction_lockin": (
            "Either party may terminate the lease by serving thirty (30) days written notice. Under no circumstances "
            "shall the Landlord disrupt essential amenities (water, electricity) or execute physical lockout without due process."
        )
    }

    template = base_templates.get(
        category,
        "Both parties agree to adhere to standard equitable terms under the Model Tenancy Act."
    )

    return {
        "success": True,
        "category": category,
        "engine_used": "deterministic-mta-engine",
        "recommended_text": template,
        "sharing_message": f"Hi, I reviewed our draft lease agreement. Regarding the {category.replace('_', ' ')} clause, standard tenancy norms recommend: \"{template}\" Could we kindly update the draft accordingly?"
    }
