"""
Hybrid Intelligence Engine: Gemini 2.5 Flash + Deterministic Statutory Fallback
Designed to ensure 100% demo reliability under congested hackathon venue Wi-Fi or API hiccups.

1. Primary: Google Gemini 2.5 Flash (Fast, context-rich reasoning, customized negotiation drafts).
2. Fallback: Embedded Deterministic Model Tenancy Act (MTA) Heuristic Parser.
"""

import os
import re
import json
import logging
import requests
from typing import Dict, Any, Optional
from dotenv import load_dotenv, find_dotenv
from .clause_analyzer import audit_agreement_text

# Load environment variables, searching upward for root .env
load_dotenv(find_dotenv())

logger = logging.getLogger("rentfair.hybrid_engine")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
GEMINI_MODEL = "gemini-2.5-flash"
BASE_GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"

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

def _extract_json_from_text(text: str) -> Optional[Dict[str, Any]]:
    """
    Safely extracts a JSON object from text, handling markdown fences and preambles.
    """
    if not text:
        return None
    cleaned = text.strip()
    match = re.search(r'\{[\s\S]*\}', cleaned)
    if match:
        try:
            return json.loads(match.group(0))
        except Exception:
            pass
    return None


def _sanitize_gemini_audit(data: Dict[str, Any], fallback: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validates and heals the Gemini output schema so the frontend never crashes on missing keys.
    """
    try:
        score = int(data.get("safety_score", fallback["safety_score"]))
        score = max(10, min(100, score))
    except (ValueError, TypeError):
        score = fallback["safety_score"]

    if score >= 85:
        verdict = "SAFE"
        verdict_color = "emerald"
    elif score >= 65:
        verdict = "MODERATE_RISK"
        verdict_color = "amber"
    else:
        verdict = "HIGH_RISK_PREDATORY"
        verdict_color = "rose"

    clauses = data.get("audited_clauses")
    if not isinstance(clauses, list) or len(clauses) == 0:
        clauses = fallback["audited_clauses"]
    else:
        # Validate individual clause dictionaries
        sanitized_clauses = []
        for c in clauses:
            if not isinstance(c, dict):
                continue
            status = c.get("status", "SAFE").upper()
            if status not in ["HIGH_RISK", "CAUTION", "SAFE"]:
                status = "CAUTION"
            sanitized_clauses.append({
                "category": str(c.get("category", "general")),
                "title": str(c.get("title", "Tenancy Term")),
                "clause_text": str(c.get("clause_text", "Clause text")),
                "status": status,
                "risk_score_impact": int(c.get("risk_score_impact", 0) or 0),
                "statutory_reference": str(c.get("statutory_reference", "Model Tenancy Act, 2021")),
                "issue_summary": str(c.get("issue_summary", "")),
                "plain_english_impact": str(c.get("plain_english_impact", "")),
                "recommended_counter_clause": str(c.get("recommended_counter_clause", ""))
            })
        if not sanitized_clauses:
            clauses = fallback["audited_clauses"]
        else:
            clauses = sanitized_clauses

    high_count = sum(1 for c in clauses if c["status"] == "HIGH_RISK")
    caution_count = sum(1 for c in clauses if c["status"] == "CAUTION")
    safe_count = sum(1 for c in clauses if c["status"] == "SAFE")

    return {
        "safety_score": score,
        "verdict": data.get("verdict") if data.get("verdict") in ["SAFE", "MODERATE_RISK", "HIGH_RISK_PREDATORY"] else verdict,
        "verdict_color": verdict_color,
        "verdict_summary": str(data.get("verdict_summary") or fallback["verdict_summary"]),
        "metrics": {
            "total_clauses_reviewed": len(clauses),
            "high_risk_flags": high_count,
            "caution_flags": caution_count,
            "safe_clauses": safe_count
        },
        "audited_clauses": clauses
    }


def audit_with_hybrid_engine(raw_text: str) -> Dict[str, Any]:
    """
    Attempts Gemini 2.5 Flash primary audit with a fast 2.5s timeout and zero thinking budget.
    Seamlessly falls back to local deterministic MTA heuristics in <5ms if API is unavailable.
    """
    fallback_result = audit_agreement_text(raw_text)
    fallback_result["engine_used"] = "deterministic-mta-engine"
    fallback_result["engine_badge"] = "MTA Statutory Rule Engine (Offline Failsafe)"

    if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here":
        try:
            url = f"{BASE_GEMINI_URL.format(model=GEMINI_MODEL)}?key={GEMINI_API_KEY}"
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
                    "temperature": 0.1,
                    "responseMimeType": "application/json",
                    "thinkingConfig": {"thinkingBudget": 0}
                }
            }

            # 2.5-second fail-fast timeout for instant demo responsiveness
            response = requests.post(url, json=payload, timeout=2.5)
            
            if response.status_code == 200:
                data = response.json()
                content_text = data["candidates"][0]["content"]["parts"][0]["text"]
                parsed_audit = _extract_json_from_text(content_text)
                if parsed_audit:
                    sanitized = _sanitize_gemini_audit(parsed_audit, fallback_result)
                    sanitized["engine_used"] = GEMINI_MODEL
                    sanitized["engine_badge"] = f"{GEMINI_MODEL.replace('-', ' ').title()} (Active AI)"
                    return sanitized
            else:
                logger.warning(f"Gemini model returned status {response.status_code}.")
        except Exception as ex:
            logger.info(f"Gemini API unavailable or timed out ({str(ex)}). Using statutory fallback.")

    # Deterministic Fallback Engine (Runs locally in <10ms)
    return fallback_result


def generate_counter_clause_hybrid(category: str, original_clause: str, tone: str = "diplomatic") -> Dict[str, Any]:
    """
    Generates tailored counter-clauses with Gemini or local statutory templates.
    """
    norm_category = category.strip().lower().replace(" ", "_").replace("-", "_")

    if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here":
        try:
            url = f"{BASE_GEMINI_URL.format(model=GEMINI_MODEL)}?key={GEMINI_API_KEY}"
            prompt = (
                f"You are a legal assistant drafting a counter-clause for a residential tenant in India.\n"
                f"Category: {norm_category}\n"
                f"Original Clause: {original_clause}\n"
                f"Requested Tone: {tone} (diplomatic / firm / statutory)\n"
                f"Reference: Indian Model Tenancy Act, 2021.\n"
                f"Output ONLY JSON with keys 'recommended_text' and 'sharing_message' (ready for WhatsApp)."
            )
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.2,
                    "responseMimeType": "application/json",
                    "thinkingConfig": {"thinkingBudget": 0}
                }
            }
            res = requests.post(url, json=payload, timeout=2.0)
            if res.status_code == 200:
                result = res.json()["candidates"][0]["content"]["parts"][0]["text"]
                clean_json = _extract_json_from_text(result)
                if clean_json and "recommended_text" in clean_json:
                    return {
                        "success": True,
                        "category": norm_category,
                        "engine_used": GEMINI_MODEL,
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
        norm_category,
        "Both parties agree to adhere to standard equitable terms under the Model Tenancy Act."
    )

    cat_display = norm_category.replace('_', ' ')
    if tone == "firm":
        sharing_message = (
            f"Dear Landlord,\n\n"
            f"Please note that the proposed {cat_display} clause does not align with statutory Model Tenancy Act safeguards. "
            f"We request updating it to the standard equitable provision:\n\n"
            f"\"{template}\"\n\n"
            f"Kindly share the revised draft. Thank you."
        )
    elif tone == "statutory":
        sharing_message = (
            f"Statutory Notice regarding {cat_display}:\n\n"
            f"Under the Model Tenancy Act, 2021, balanced tenancy standards require:\n\n"
            f"\"{template}\"\n\n"
            f"Please ensure our agreement reflects these statutory protections."
        )
    else:  # diplomatic default
        sharing_message = (
            f"Hi, I reviewed our draft lease agreement. Regarding the {cat_display} clause, "
            f"standard tenancy norms recommend: \"{template}\" "
            f"Could we kindly update the draft accordingly? Thank you!"
        )

    return {
        "success": True,
        "category": norm_category,
        "engine_used": "deterministic-mta-engine",
        "recommended_text": template,
        "sharing_message": sharing_message
    }

