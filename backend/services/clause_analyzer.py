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
    
    dep_match = re.search(r'([^\n]*(?:security\s+deposit|refundable\s+deposit|caution\s+deposit|deposit)[^\n]*(?:\n[^\n]+){0,3})', raw_text, re.IGNORECASE)
    excerpt = dep_match.group(0).strip() if dep_match else "Security Deposit provisions in lease."

    # Check for forfeiture or non-refundable terms
    has_forfeiture = (
        any(phrase in text_lower for phrase in cfg["dealbreakers"])
        or bool(re.search(r'\b(?:non[- ]refundable|forfeit(?:ure)?\s+(?:the\s+)?(?:entire\s+)?(?:security\s+)?deposit|forfeit\s+entirely|no\s+refund|mandatory\s+(?:repainting|sanitization))\b', text_lower))
    )
    
    # Check for excessive months (e.g. 3 to 12 months)
    excessive_months_match = re.search(r'(?:deposit\s+(?:of|is|equal\s+to)?\s*)?(?:(three|four|five|six|seven|eight|nine|ten|eleven|twelve|3|4|5|6|7|8|9|10|11|12)\s+months?)', text_lower)
    if not excessive_months_match:
        rent_months_match = re.search(r'(\d+)\s+months[\'’]?\s+rent', text_lower)
        if rent_months_match and int(rent_months_match.group(1)) > 2:
            excessive_months_match = rent_months_match
            
    excessive_deposit = bool(excessive_months_match)

    if has_forfeiture or excessive_deposit:
        months_found = excessive_months_match.group(0) if excessive_months_match else "excessive / non-refundable terms"
        return ClauseAuditResult(
            category="security_deposit",
            title="Predatory Security Deposit Terms",
            clause_text=excerpt,
            status="HIGH_RISK",
            risk_score_impact=cfg["risk_penalty"],
            statutory_reference=cfg["statutory_reference"],
            issue_summary=f"Demand for {months_found} violates the statutory 2-month cap and fair refund safeguards under Section 11 of the Model Tenancy Act.",
            plain_english_impact="You risk losing significant capital. The landlord claims the right to keep your deposit or mandate excessive lockups beyond legal limits.",
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
            issue_summary="Deposit is within standard limits or governed by statutory rules with clear refund provisions.",
            plain_english_impact="Your deposit terms are fair and follow standard tenancy laws.",
            recommended_counter_clause=excerpt
        )


def _audit_entry(raw_text: str, text_lower: str) -> ClauseAuditResult:
    cfg = TENANCY_BENCHMARKS["landlord_entry"]
    
    entry_matches = re.findall(
        r'([^\n]*(?:\binspection\b|\bentry\b|\benter\s+(?:the|flat|premises|room|at)|\baccess\b|\bvisit\b|\bwarden\b)[^\n]*(?:\n[^\n]+){0,3})',
        raw_text,
        re.IGNORECASE
    )
    
    # Filter out contract execution lines ("entered into") and deposit walkthrough mentions
    valid_entry_matches = [
        m for m in entry_matches
        if not re.match(r'^\s*(?:this\s+.*)?entered\s+into\b', m, re.IGNORECASE)
        and not re.search(r'\b(?:security\s+deposit|refundable\s+deposit)\b', m, re.IGNORECASE)
    ]

    has_entry_section = bool(valid_entry_matches)
    if valid_entry_matches:
        excerpt = valid_entry_matches[-1].strip()
    elif entry_matches:
        excerpt = entry_matches[-1].strip()
    else:
        excerpt = "Landlord entry and property inspection provisions (Statutory MTA default)."

    entry_lower = excerpt.lower() if has_entry_section else ""

    # Check dealbreakers specifically in entry context
    has_unnotified = (
        any(phrase in entry_lower for phrase in cfg["dealbreakers"])
        or ("at any time" in entry_lower and any(w in entry_lower for w in ["inspect", "enter", "without", "visit", "flat", "premises", "room"]))
        or bool(re.search(r'\b(?:at\s+any\s+time\s+without\s+(?:prior\s+)?notice|enter\s+at\s+any\s+time|enter\s+rooms\s+at\s+any\s+time|without\s+(?:any\s+)?(?:prior\s+)?notice|enter\s+at\s+will|surprise\s+discipline)\b', entry_lower))
        or (has_entry_section and bool(re.search(r'\b(?:at\s+any\s+time\s+without\s+(?:prior\s+)?notice|without\s+(?:any\s+)?(?:prior\s+)?notice|enter\s+at\s+will)\b', text_lower)))
    )

    if has_unnotified:
        return ClauseAuditResult(
            category="landlord_entry",
            title="Unrestricted Landlord Access (Privacy Violation)",
            clause_text=excerpt,
            status="HIGH_RISK",
            risk_score_impact=cfg["risk_penalty"],
            statutory_reference=cfg["statutory_reference"],
            issue_summary="Allows the landlord or representatives to enter without mandatory 24-hour written notice.",
            plain_english_impact="The landlord or prospective occupants can show up unannounced at your door, stripping away your right to privacy and peaceful enjoyment.",
            recommended_counter_clause=(
                "The Landlord or authorized agents may inspect the premises only upon providing at least "
                "twenty-four (24) hours' prior written or electronic notice to the Tenant, with entry restricted "
                "between 8:00 AM and 7:00 PM on mutually convenient dates."
            )
        )
    elif has_entry_section and ("12 hours" in entry_lower or "verbal notice" in entry_lower):
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
            issue_summary="Adequate 24-hour notice required for inspections during daytime hours or statutory baseline preserved.",
            plain_english_impact="Standard privacy protections and peaceful quiet enjoyment are preserved.",
            recommended_counter_clause=excerpt
        )


def _audit_escalation(raw_text: str, text_lower: str) -> ClauseAuditResult:
    cfg = TENANCY_BENCHMARKS["rent_escalation"]
    
    esc_match = re.search(r'([^\n]*(?:rent\s+escalation|escalat\w+|rent\s+revision|increase|hike|revision)[^\n]*(?:\n[^\n]+){0,3})', raw_text, re.IGNORECASE)
    excerpt = esc_match.group(0).strip() if esc_match else "Rent escalation and revision terms."
    esc_lower = excerpt.lower() if esc_match else text_lower

    has_arbitrary = (
        any(phrase in text_lower for phrase in cfg["dealbreakers"])
        or bool(re.search(r'\b(?:at\s+any\s+time|sole\s+discretion|without\s+(?:tenant|lessee)\s+consent)\b', esc_lower))
    )
    
    # Check percentage hike (e.g. increase rent by 15%, 12% hike, escalation of 15%)
    excessive_pct_match = re.search(r'(?:increase|escalat\w+|hike)(?:\s+(?:the\s+)?rent)?\s*(?:by|of)?\s*(\d+)\s*%', text_lower)
    if not excessive_pct_match:
        excessive_pct_match = re.search(r'(\d+)\s*%\s*(?:increase|escalat\w+|hike)', text_lower)

    is_excessive_pct = False
    pct_val = None
    if excessive_pct_match:
        pct_val = int(excessive_pct_match.group(1))
        if pct_val > 10:
            is_excessive_pct = True

    if has_arbitrary or is_excessive_pct:
        pct_desc = f" ({pct_val}%)" if pct_val else ""
        return ClauseAuditResult(
            category="rent_escalation",
            title="Arbitrary / High Rent Escalation Clause",
            clause_text=excerpt,
            status="HIGH_RISK",
            risk_score_impact=cfg["risk_penalty"],
            statutory_reference=cfg["statutory_reference"],
            issue_summary=f"Allows unilateral rent hikes{pct_desc} or exceeds standard 5-8% annual renewal escalation without mandatory 90-day written notice.",
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
    
    maint_match = re.search(r'([^\n]*(?:repair|maintenance|damage|seepage|crack|drainage|plastering)\b[^\n]*(?:\n[^\n]+){0,3})', raw_text, re.IGNORECASE)
    excerpt = maint_match.group(0).strip() if maint_match else "Repairs and maintenance liability clause."

    shifts_structural = (
        any(phrase in text_lower for phrase in cfg["dealbreakers"])
        or bool(re.search(r'\b(?:tenant|lessee)\b.*\b(?:responsible|liable|bear)\b.*\b(?:all\s+repairs|structural|seepage|drainage)\b', text_lower, re.DOTALL))
        or bool(re.search(r'\b(?:landlord|lessor)\b.*\bno\s+obligation\s+to\s+spend\b', text_lower))
        or bool(re.search(r'\b(?:structural\s+cracks?|external\s+roof\s+seepage|wall\s+seepage|drainage\s+blockages?)\b', text_lower))
    )

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
    
    evict_match = re.search(r'([^\n]*(?:evict|terminat|lock-in|lockout|disconnect|door\s+lock|vacat)\b[^\n]*(?:\n[^\n]+){0,3})', raw_text, re.IGNORECASE)
    excerpt = evict_match.group(0).strip() if evict_match else "Termination, lockout and eviction clause."

    has_self_help = (
        any(phrase in text_lower for phrase in cfg["dealbreakers"])
        or bool(re.search(r'\b(?:disconnect|cut\s*off|terminate|disrupt)\s+(?:water|electricity|supplies|amenities|power|utilities)\b', text_lower))
        or bool(re.search(r'\b(?:change\s+(?:the\s+)?(?:physical\s+)?(?:door\s+)?lock|physical\s+lockout|lock\s+the\s+premises)\b', text_lower))
        or bool(re.search(r'\bresume\s+possession\s+without\s+(?:initiating\s+proceedings|due\s+process|court|rent\s+authority)\b', text_lower))
    )

    if has_self_help:
        return ClauseAuditResult(
            category="eviction_lockin",
            title="Unlawful Eviction & Utility Disconnection",
            clause_text=excerpt,
            status="HIGH_RISK",
            risk_score_impact=cfg["risk_penalty"],
            statutory_reference=cfg["statutory_reference"],
            issue_summary="Empowers landlord to disconnect water/electricity, execute physical lockout, or forfeit deposit upon early vacating without legal procedure.",
            plain_english_impact="Cutting off essential water/electricity or physical lockout is illegal under Indian tenancy jurisprudence. You are vulnerable to high-handed coercion.",
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
