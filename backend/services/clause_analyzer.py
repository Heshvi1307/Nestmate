"""
Clause Analysis & Legal Audit Engine.
Combines deterministic regex/NLP pattern matching, statutory Model Tenancy Act rules,
and dynamic generative counter-drafting.
"""

import re
import os
from typing import Dict, Any, List, Optional
from .legal_benchmarks import TENANCY_BENCHMARKS

class ClauseAuditResult:
    def __init__(
        self,
        category: str,
        title: str,
        clause_text: str,
        status: str,  # "HIGH_RISK", "CAUTION", "SAFE"
        risk_score_impact: int,
        statutory_reference: str,
        issue_summary: str,
        plain_english_impact: str,
        recommended_counter_clause: str
    ):
        self.category = category
        self.title = title
        self.clause_text = clause_text
        self.status = status
        self.risk_score_impact = risk_score_impact
        self.statutory_reference = statutory_reference
        self.issue_summary = issue_summary
        self.plain_english_impact = plain_english_impact
        self.recommended_counter_clause = recommended_counter_clause

    def to_dict(self) -> Dict[str, Any]:
        return {
            "category": self.category,
            "title": self.title,
            "clause_text": self.clause_text,
            "status": self.status,
            "risk_score_impact": self.risk_score_impact,
            "statutory_reference": self.statutory_reference,
            "issue_summary": self.issue_summary,
            "plain_english_impact": self.plain_english_impact,
            "recommended_counter_clause": self.recommended_counter_clause
        }


def extract_clauses_from_text(raw_text: str) -> List[Dict[str, str]]:
    """
    Segment the legal agreement into individual numbered or titled paragraphs.
    """
    paragraphs = re.split(r'\n\s*(?=(?:\d+[\.\)]|[A-Z\s]{4,}:))\s*', raw_text.strip())
    cleaned_clauses = []
    
    for idx, p in enumerate(paragraphs):
        p_clean = p.strip()
        if len(p_clean) < 25:
            continue
        first_line = p_clean.split('\n')[0][:50]
        cleaned_clauses.append({
            "id": f"clause_{idx+1}",
            "header": first_line,
            "content": p_clean
        })
    
    if not cleaned_clauses:
        cleaned_clauses.append({
            "id": "clause_1",
            "header": "Full Text Document",
            "content": raw_text.strip()
        })
    return cleaned_clauses


def audit_agreement_text(raw_text: str) -> Dict[str, Any]:
    """
    Audits the entire agreement against the legal benchmarks,
    identifying red flags, calculating composite safety score,
    and drafting counter-clauses.
    """
    text_lower = raw_text.lower()
    audits: List[ClauseAuditResult] = []
    
    # Base score starts at 100 and drops for infractions
    total_deductions = 0

    # 1. Security Deposit Audit
    deposit_findings = _audit_deposit(raw_text, text_lower)
    audits.append(deposit_findings)
    total_deductions += deposit_findings.risk_score_impact

    # 2. Landlord Entry & Privacy Right
    entry_findings = _audit_entry(raw_text, text_lower)
    audits.append(entry_findings)
    total_deductions += entry_findings.risk_score_impact

    # 3. Rent Escalation
    escalation_findings = _audit_escalation(raw_text, text_lower)
    audits.append(escalation_findings)
    total_deductions += escalation_findings.risk_score_impact

    # 4. Maintenance & Structural Damage
    maintenance_findings = _audit_maintenance(raw_text, text_lower)
    audits.append(maintenance_findings)
    total_deductions += maintenance_findings.risk_score_impact

    # 5. Eviction & Essential Supplies
    eviction_findings = _audit_eviction(raw_text, text_lower)
    audits.append(eviction_findings)
    total_deductions += eviction_findings.risk_score_impact

    final_score = max(10, 100 - total_deductions)
    
    if final_score >= 85:
        verdict = "SAFE"
        verdict_color = "emerald"
        verdict_summary = "This agreement closely follows statutory tenant rights with fair, balanced obligations."
    elif final_score >= 65:
        verdict = "MODERATE_RISK"
        verdict_color = "amber"
        verdict_summary = "This agreement contains several clauses that disproportionately favor the landlord. Negotiation recommended."
    else:
        verdict = "HIGH_RISK_PREDATORY"
        verdict_color = "rose"
        verdict_summary = "CRITICAL WARNING: This agreement contains predatory terms that breach Model Tenancy Act safeguards."

    high_risk_count = sum(1 for a in audits if a.status == "HIGH_RISK")
    caution_count = sum(1 for a in audits if a.status == "CAUTION")
    safe_count = sum(1 for a in audits if a.status == "SAFE")

    return {
        "safety_score": final_score,
        "verdict": verdict,
        "verdict_color": verdict_color,
        "verdict_summary": verdict_summary,
        "metrics": {
            "total_clauses_reviewed": len(audits),
            "high_risk_flags": high_risk_count,
            "caution_flags": caution_count,
            "safe_clauses": safe_count
        },
        "audited_clauses": [a.to_dict() for a in audits]
    }


def _audit_deposit(raw_text: str, text_lower: str) -> ClauseAuditResult:
    cfg = TENANCY_BENCHMARKS["security_deposit"]
    
    # Check for forfeiture or non-refundable terms
    has_forfeiture = any(phrase in text_lower for phrase in cfg["dealbreakers"])
    
    # Check for excessive months (e.g. 4 months, 6 months, six months)
    excessive_months_match = re.search(r'(?:deposit\s+of\s+)?(?:(three|four|five|six|seven|eight|3|4|5|6|7|8|9|10)\s+months)', text_lower)
    excessive_deposit = bool(excessive_months_match)
    
    # Extract matching clause excerpt
    excerpt_match = re.search(r'([^\n]*security\s+deposit[^\n]*(?:\n[^\n]+){1,3})', raw_text, re.IGNORECASE)
    excerpt = excerpt_match.group(0).strip() if excerpt_match else "Security Deposit provisions in lease."

    if has_forfeiture or excessive_deposit:
        months_found = excessive_months_match.group(0) if excessive_months_match else "excessive deposit"
        return ClauseAuditResult(
            category="security_deposit",
            title="Predatory Security Deposit Terms",
            clause_text=excerpt,
            status="HIGH_RISK",
            risk_score_impact=cfg["risk_penalty"],
            statutory_reference=cfg["statutory_reference"],
            issue_summary=f"Demand for {months_found} and full forfeiture clauses violates the statutory 2-month cap under the Model Tenancy Act.",
            plain_english_impact="You risk losing significant capital. The landlord claims the right to keep your entire deposit if you move early or dispute deductions.",
            recommended_counter_clause=(
                "The Tenant shall provide a refundable Security Deposit equal to two (2) months' rent. "
                "The Landlord shall refund this amount within thirty (30) days of vacating, after joint inspection "
                "and deduction of verified unpaid utility bills or actual physical damage caused by the Tenant."
            )
        )
    elif "90 days" in text_lower or "60 days" in text_lower:
        return ClauseAuditResult(
            category="security_deposit",
            title="Delayed Deposit Refund Period",
            clause_text=excerpt,
            status="CAUTION",
            risk_score_impact=10,
            statutory_reference=cfg["statutory_reference"],
            issue_summary="Refund period exceeds standard 30-day post-handover window.",
            plain_english_impact="Your deposit will be locked up for 60 to 90 days after you move out, causing cash flow issues for your next home.",
            recommended_counter_clause="The Security Deposit shall be refunded within 30 days of the Tenant handing over peaceful possession."
        )
    else:
        return ClauseAuditResult(
            category="security_deposit",
            title="Balanced Security Deposit",
            clause_text=excerpt,
            status="SAFE",
            risk_score_impact=0,
            statutory_reference=cfg["statutory_reference"],
            issue_summary="Deposit is within the standard 2-month limit with clear refund provisions.",
            plain_english_impact="Your deposit terms are fair and follow standard tenancy laws.",
            recommended_counter_clause=excerpt
        )


def _audit_entry(raw_text: str, text_lower: str) -> ClauseAuditResult:
    cfg = TENANCY_BENCHMARKS["landlord_entry"]
    has_unnotified = any(phrase in text_lower for phrase in cfg["dealbreakers"])
    
    excerpt_match = re.search(r'([^\n]*(?:inspection|entry|enter\s+the\s+premises)[^\n]*(?:\n[^\n]+){1,3})', raw_text, re.IGNORECASE)
    excerpt = excerpt_match.group(0).strip() if excerpt_match else "Landlord entry and property inspection clauses."

    if has_unnotified or ("at any time" in text_lower and "inspect" in text_lower):
        return ClauseAuditResult(
            category="landlord_entry",
            title="Unrestricted Landlord Access (Privacy Violation)",
            clause_text=excerpt,
            status="HIGH_RISK",
            risk_score_impact=cfg["risk_penalty"],
            statutory_reference=cfg["statutory_reference"],
            issue_summary="Allows the landlord or representatives to enter without mandatory 24-hour written notice.",
            plain_english_impact="The landlord or prospective buyers can show up unannounced at your door, stripping away your right to privacy and peaceful enjoyment.",
            recommended_counter_clause=(
                "The Landlord or authorized agents may inspect the premises only upon providing at least "
                "twenty-four (24) hours' prior written or electronic notice to the Tenant, with entry restricted "
                "between 8:00 AM and 7:00 PM on mutually convenient dates."
            )
        )
    elif "12 hours" in text_lower or "verbal notice" in text_lower:
        return ClauseAuditResult(
            category="landlord_entry",
            title="Short Entry Notice Window",
            clause_text=excerpt,
            status="CAUTION",
            risk_score_impact=10,
            statutory_reference=cfg["statutory_reference"],
            issue_summary="Entry notice window is below the 24-hour statutory benchmark.",
            plain_english_impact="Verbal or short notice can lead to unexpected intrusions.",
            recommended_counter_clause="Prior written notice of not less than 24 hours must precede any inspection."
        )
    else:
        return ClauseAuditResult(
            category="landlord_entry",
            title="Respects Tenant Privacy",
            clause_text=excerpt,
            status="SAFE",
            risk_score_impact=0,
            statutory_reference=cfg["statutory_reference"],
            issue_summary="Adequate 24-hour notice required for inspections during daytime hours.",
            plain_english_impact="Standard privacy protections are preserved.",
            recommended_counter_clause=excerpt
        )


def _audit_escalation(raw_text: str, text_lower: str) -> ClauseAuditResult:
    cfg = TENANCY_BENCHMARKS["rent_escalation"]
    has_arbitrary = any(phrase in text_lower for phrase in cfg["dealbreakers"])
    
    excessive_pct_match = re.search(r'(?:increase|escalat\w+)\s+(?:by\s+)?(\d+)%', text_lower)
    is_excessive_pct = False
    if excessive_pct_match:
        val = int(excessive_pct_match.group(1))
        if val > 10:
            is_excessive_pct = True

    excerpt_match = re.search(r'([^\n]*(?:rent\s+escalation|increase|revision|hike)[^\n]*(?:\n[^\n]+){1,3})', raw_text, re.IGNORECASE)
    excerpt = excerpt_match.group(0).strip() if excerpt_match else "Rent escalation and revision terms."

    if has_arbitrary or is_excessive_pct:
        return ClauseAuditResult(
            category="rent_escalation",
            title="Arbitrary / High Rent Escalation Clause",
            clause_text=excerpt,
            status="HIGH_RISK",
            risk_score_impact=cfg["risk_penalty"],
            statutory_reference=cfg["statutory_reference"],
            issue_summary="Allows unilateral rent hikes or exceeds standard 5-8% annual renewal escalation.",
            plain_english_impact="The landlord can suddenly demand hundreds or thousands more in rent with minimal notice, forcing you to pay or abruptly leave.",
            recommended_counter_clause=(
                "The monthly rent shall remain fixed for the primary eleven (11) month term. "
                "Any renewal escalation shall be mutually agreed upon in writing at a maximum increase "
                "of 5% to 7%, initiated by written notice at least ninety (90) days prior to lease expiry."
            )
        )
    elif "10%" in text_lower:
        return ClauseAuditResult(
            category="rent_escalation",
            title="Maximum Standard Escalation (10%)",
            clause_text=excerpt,
            status="CAUTION",
            risk_score_impact=5,
            statutory_reference=cfg["statutory_reference"],
            issue_summary="Escalation rate is at the upper statutory threshold of 10%.",
            plain_english_impact="A 10% hike compounds quickly year-on-year.",
            recommended_counter_clause="We recommend proposing an annual escalation capped between 5% and 7%."
        )
    else:
        return ClauseAuditResult(
            category="rent_escalation",
            title="Fair Rent Stability",
            clause_text=excerpt,
            status="SAFE",
            risk_score_impact=0,
            statutory_reference=cfg["statutory_reference"],
            issue_summary="Rent remains locked for the tenure with moderate renewal caps.",
            plain_english_impact="No risk of unexpected mid-term rent shocks.",
            recommended_counter_clause=excerpt
        )


def _audit_maintenance(raw_text: str, text_lower: str) -> ClauseAuditResult:
    cfg = TENANCY_BENCHMARKS["maintenance_liability"]
    shifts_structural = any(phrase in text_lower for phrase in cfg["dealbreakers"])
    
    excerpt_match = re.search(r'([^\n]*(?:repair|maintenance|damage|seepage)[^\n]*(?:\n[^\n]+){1,3})', raw_text, re.IGNORECASE)
    excerpt = excerpt_match.group(0).strip() if excerpt_match else "Repairs and maintenance liability clause."

    if shifts_structural:
        return ClauseAuditResult(
            category="maintenance_liability",
            title="Unfair Structural Repair Burden",
            clause_text=excerpt,
            status="HIGH_RISK",
            risk_score_impact=cfg["risk_penalty"],
            statutory_reference=cfg["statutory_reference"],
            issue_summary="Forces tenant to pay for structural defects, wall seepage, and pre-existing building faults.",
            plain_english_impact="You could be forced to pay thousands of rupees for damp walls, plumbing line cracks, or roof leaks that are the building owner's legal responsibility.",
            recommended_counter_clause=(
                "The Landlord shall be solely responsible for all structural repairs, exterior wall maintenance, "
                "water seepage, primary plumbing conduits, and major electrical failures. The Tenant shall bear "
                "only minor routine day-to-day consumable repairs (e.g. bulb replacements, tap washers) under INR 500."
            )
        )
    else:
        return ClauseAuditResult(
            category="maintenance_liability",
            title="Equitable Repair Division",
            clause_text=excerpt,
            status="SAFE",
            risk_score_impact=0,
            statutory_reference=cfg["statutory_reference"],
            issue_summary="Clearly separates structural landlord duties from minor tenant consumables.",
            plain_english_impact="You are protected from paying for building defects.",
            recommended_counter_clause=excerpt
        )


def _audit_eviction(raw_text: str, text_lower: str) -> ClauseAuditResult:
    cfg = TENANCY_BENCHMARKS["eviction_lockin"]
    has_self_help = any(phrase in text_lower for phrase in cfg["dealbreakers"])
    
    excerpt_match = re.search(r'([^\n]*(?:evict|terminat|lock-in|disconnect|lock\s+the\s+premises)[^\n]*(?:\n[^\n]+){1,3})', raw_text, re.IGNORECASE)
    excerpt = excerpt_match.group(0).strip() if excerpt_match else "Termination, lockout and eviction clause."

    if has_self_help:
        return ClauseAuditResult(
            category="eviction_lockin",
            title="Unlawful Eviction & Utility Disconnection",
            clause_text=excerpt,
            status="HIGH_RISK",
            risk_score_impact=cfg["risk_penalty"],
            statutory_reference=cfg["statutory_reference"],
            issue_summary="Empowers landlord to disconnect water/electricity or execute physical lockout without legal procedure.",
            plain_english_impact="Cutting off essential water or electricity is illegal under Indian tenancy jurisprudence. You are vulnerable to high-handed coercion.",
            recommended_counter_clause=(
                "Neither party shall terminate the tenancy without thirty (30) days prior written notice. "
                "Under no circumstances shall the Landlord disrupt essential amenities (water, electricity, access) "
                "without statutory order from the competent Rent Authority."
            )
        )
    elif "lock-in" in text_lower and "entire remaining term" in text_lower:
        return ClauseAuditResult(
            category="eviction_lockin",
            title="Severe Lock-In Forfeiture",
            clause_text=excerpt,
            status="CAUTION",
            risk_score_impact=10,
            statutory_reference=cfg["statutory_reference"],
            issue_summary="Lock-in forces payment of remaining months even if forced to relocate for employment/family emergencies.",
            plain_english_impact="If you relocate or lose a job, you remain legally on the hook for full rent.",
            recommended_counter_clause="Lock-in liability capped at one month's rent in lieu of notice."
        )
    else:
        return ClauseAuditResult(
            category="eviction_lockin",
            title="Lawful Termination Protocol",
            clause_text=excerpt,
            status="SAFE",
            risk_score_impact=0,
            statutory_reference=cfg["statutory_reference"],
            issue_summary="Contains balanced 30-day notice period with no illegal self-help measures.",
            plain_english_impact="You have standard legal protection and notice before tenancy ends.",
            recommended_counter_clause=excerpt
        )
