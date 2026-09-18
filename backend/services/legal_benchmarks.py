"""
Legal Benchmarks & Statutory Tenancy Standards
Referenced against the Model Tenancy Act (MTA), 2021 & standard Indian Tenancy jurisprudence.
Designed to audit residential lease agreements for predatory clauses and fairness.
"""

from typing import Dict, Any, List

TENANCY_BENCHMARKS: Dict[str, Dict[str, Any]] = {
    "security_deposit": {
        "title": "Security Deposit Quantum & Refund",
        "statutory_reference": "Model Tenancy Act (MTA) Section 11",
        "standard_rule": "Security deposit for residential premises shall not exceed two months' rent, refundable on vacating after deducting actual unpaid dues.",
        "max_residential_months": 2,
        "max_refund_days": 30,
        "risk_penalty": 25,
        "dealbreakers": [
            "non-refundable",
            "forfeit entirely",
            "forfeiture of full deposit",
            "forfeit the entire deposit",
            "forfeit the entire security deposit",
            "forfeiture of deposit",
            "no refund under any circumstance",
            "non-refundable maintenance fee",
            "deducted at checkout",
            "mandatory repainting and deep sanitization"
        ]
    },
    "landlord_entry": {
        "title": "Landlord Inspection & Privacy Right",
        "statutory_reference": "Model Tenancy Act (MTA) Section 15",
        "standard_rule": "Landlord must provide at least 24 hours prior written/electronic notice before entering the premises, and entry must be between 7:00 AM and 8:00 PM.",
        "min_notice_hours": 24,
        "risk_penalty": 20,
        "dealbreakers": [
            "at any time without notice",
            "at any time without prior notice",
            "enter at will",
            "without prior notice",
            "without notice",
            "no notice required for inspection",
            "unrestricted access without notification",
            "surprise discipline audits",
            "enter rooms at any time",
            "enter at any time"
        ]
    },
    "rent_escalation": {
        "title": "Rent Escalation & Revision",
        "statutory_reference": "Model Tenancy Act (MTA) Section 9 & 10",
        "standard_rule": "Rent revision can only occur as agreed upon in writing, requiring at least 90 days notice before the revised rate takes effect. Mid-term arbitrary hikes are void.",
        "standard_max_annual_increase_pct": 10.0,
        "risk_penalty": 15,
        "dealbreakers": [
            "arbitrary increase",
            "increase rent at sole discretion",
            "hike rent at any time",
            "increase rent at any time",
            "increase rent by 15%",
            "increase above 15%",
            "without tenant consent",
            "at sole discretion",
            "verbal notice"
        ]
    },
    "maintenance_liability": {
        "title": "Repairs & Maintenance Division",
        "statutory_reference": "Model Tenancy Act (MTA) Section 13 & Second Schedule",
        "standard_rule": "Landlord is statutorily responsible for structural repairs, major plumbing, external electrical faults, and whitewashing. Tenant is responsible only for minor routine wear (changing bulbs, tap washers).",
        "risk_penalty": 20,
        "dealbreakers": [
            "tenant responsible for all repairs",
            "lessee agrees that he shall be responsible for all repairs",
            "responsible for all repairs of every nature",
            "responsible for all repairs",
            "tenant bears all structural damages",
            "landlord shall not carry out any repairs",
            "lessor shall have no obligation to spend on repairs",
            "no obligation to spend on repairs",
            "structural cracks",
            "external roof seepage",
            "roof seepage",
            "wall plastering",
            "main drainage blockages",
            "including seepage and plumbing",
            "all maintenance regardless of fault"
        ]
    },
    "eviction_lockin": {
        "title": "Termination, Lock-In & Eviction",
        "statutory_reference": "Model Tenancy Act (MTA) Section 21",
        "standard_rule": "No tenant can be evicted without due legal process. Standard mutual notice period is 30 days. Lock-in penalties cannot exceed the actual rent of the unexpired notice period.",
        "risk_penalty": 20,
        "dealbreakers": [
            "immediate eviction without notice",
            "cut off electricity or water",
            "disconnect water and electricity",
            "disconnect essential supplies",
            "lock the premises upon delay",
            "change the physical door lock",
            "resume possession without initiating proceedings",
            "without initiating proceedings before any court or rent authority",
            "pay rent for entire remaining lease term upon early exit",
            "early vacating requires complete forfeiture of deposit",
            "forfeit the entire security deposit"
        ]
    }
}
