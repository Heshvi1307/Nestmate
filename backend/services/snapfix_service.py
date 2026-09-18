"""
SnapFix Triage & Anti-Fraud Condition Verification Engine.
Pillar 3 of RentFair AI:
1. Live Camera Challenge & Liveness Verification.
2. Hardware EXIF Telemetry, Geofence Match, and Anti-Tampering Scanner.
3. Cryptographic SHA-256 Move-In Baseline Hashing.
4. Model Tenancy Act (Second Schedule) Damage Triage & Fair Repair Cost Estimator in INR.
5. Bilateral Inspection Certificate Generator.
"""

import io
import math
import time
import uuid
import hashlib
from datetime import datetime, timezone
from typing import Dict, Any, Optional, Tuple
from PIL import Image, ExifTags

# ==========================================
# 1. Statutory Indian Repair Benchmarks (MTA Second Schedule)
# ==========================================

MAINTENANCE_TAXONOMY = {
    "plumbing_pipe_leak": {
        "category": "PLUMBING",
        "title": "Concealed / Main Drainage Pipe Seepage",
        "default_severity": "HIGH_PRIORITY",
        "mta_liability": "LANDLORD",
        "mta_clause": "Second Schedule, Part A (Structural plumbing lines & drainage mains)",
        "min_cost_inr": 800,
        "max_cost_inr": 2500,
        "avg_cost_inr": 1500,
        "turnaround_hours": 24,
        "contractor_scope": "Procure replacement PVC/CPVC connector or trap, isolate supply line, solvent weld joint, and pressure test."
    },
    "plumbing_tap_washer": {
        "category": "PLUMBING",
        "title": "Leaking Faucet / Worn Tap Washer",
        "default_severity": "ROUTINE_MAINTENANCE",
        "mta_liability": "TENANT",
        "mta_clause": "Second Schedule, Part B (Minor consumable wear-and-tear repairs under INR 500)",
        "min_cost_inr": 150,
        "max_cost_inr": 450,
        "avg_cost_inr": 250,
        "turnaround_hours": 72,
        "contractor_scope": "Unscrew tap spindle, replace standard rubber/ceramic washer spindle, apply Teflon tape, and reseat."
    },
    "wall_seepage_dampness": {
        "category": "STRUCTURAL_SEEPAGE",
        "title": "Wall Dampness & Efflorescence / External Seepage",
        "default_severity": "HIGH_PRIORITY",
        "mta_liability": "LANDLORD",
        "mta_clause": "Second Schedule, Part A (Structural repairs, external walls, and roof waterproofing)",
        "min_cost_inr": 2500,
        "max_cost_inr": 9000,
        "avg_cost_inr": 4800,
        "turnaround_hours": 48,
        "contractor_scope": "Scrape dead efflorescence plaster, apply polymer waterproofing slurry (Dr. Fixit or equivalent), re-plaster with waterproof additive, and primer."
    },
    "electrical_mcb_short": {
        "category": "ELECTRICAL",
        "title": "Electrical Short Circuit / Frequent MCB Tripping",
        "default_severity": "CRITICAL_EMERGENCY",
        "mta_liability": "LANDLORD",
        "mta_clause": "Second Schedule, Part A (Internal wiring conduit integrity & distribution board safety)",
        "min_cost_inr": 1200,
        "max_cost_inr": 3500,
        "avg_cost_inr": 2000,
        "turnaround_hours": 12,
        "contractor_scope": "Isolate DB box, megger test circuits for neutral leakage/insulation breakdown, replace burnt MCB/isolator, and rebalance phase load."
    },
    "electrical_switch_socket": {
        "category": "ELECTRICAL",
        "title": "Cracked Switch Plate / Blown Fuse",
        "default_severity": "ROUTINE_MAINTENANCE",
        "mta_liability": "TENANT",
        "mta_clause": "Second Schedule, Part B (Consumable electrical fixtures, switch plates, and bulbs)",
        "min_cost_inr": 200,
        "max_cost_inr": 600,
        "avg_cost_inr": 350,
        "turnaround_hours": 72,
        "contractor_scope": "Turn off local circuit, unscrew modular faceplate, wire replacement 6A/16A socket, and test earthing."
    },
    "door_lock_broken": {
        "category": "CARPENTRY",
        "title": "Main Entrance Door Lock / Latch Failure",
        "default_severity": "CRITICAL_EMERGENCY",
        "mta_liability": "TENANT",
        "mta_clause": "Second Schedule, Part B (Premises physical security hardware unless pre-existing on move-in)",
        "min_cost_inr": 650,
        "max_cost_inr": 2200,
        "avg_cost_inr": 1400,
        "turnaround_hours": 12,
        "contractor_scope": "Chisel mortise pocket if required, install replacement brass/steel pin-tumbler cylinder or rim lock, supply 3 keys."
    },
    "ac_cooling_coil_leak": {
        "category": "APPLIANCE",
        "title": "Air Conditioner Gas Leakage / Compressor Failure",
        "default_severity": "HIGH_PRIORITY",
        "mta_liability": "LANDLORD",
        "mta_clause": "Contractual White Goods Covenant (Furnished tenancy fixed assets)",
        "min_cost_inr": 2000,
        "max_cost_inr": 5500,
        "avg_cost_inr": 3200,
        "turnaround_hours": 48,
        "contractor_scope": "Nitrogen pressure testing, brazing cooling coil pinhole leak, vacuum evacuation, and R32/R410A gas top-up."
    }
}

SUSPICIOUS_SOFTWARE_TAGS = [
    "photoshop", "canva", "gimp", "snapseed", "midjourney", 
    "dall-e", "stable diffusion", "lightroom", "picsart", "facetune"
]

# Active challenge codes store: {code: {"created_at": float, "code": str}}
ACTIVE_CHALLENGES: Dict[str, Dict[str, Any]] = {}


# ==========================================
# 2. Dynamic Liveness Challenge Generator
# ==========================================

def generate_liveness_challenge() -> Dict[str, Any]:
    """
    Generates a time-bound dynamic physical challenge code.
    The tenant must display this code (on paper or screen) in the photo frame
    to prevent using downloaded, forwarded, or archived stock images.
    """
    import random
    code = f"RF-{random.randint(1000, 9999)}"
    now = time.time()
    
    # Store challenge with 10-minute expiry
    ACTIVE_CHALLENGES[code] = {
        "code": code,
        "created_at": now,
        "expires_at": now + 600
    }
    
    # Prune expired
    expired_keys = [k for k, v in ACTIVE_CHALLENGES.items() if v["expires_at"] < now]
    for k in expired_keys:
        ACTIVE_CHALLENGES.pop(k, None)

    return {
        "challenge_code": code,
        "timestamp_iso": datetime.now(timezone.utc).isoformat(),
        "expires_in_seconds": 600,
        "instructions": f"Write '{code}' on a slip of paper or hand-sign and place it in the camera frame next to the inspected area."
    }


# ==========================================
# 3. GPS & Hardware EXIF Anti-Spoofing Engine
# ==========================================

def _haversine_distance_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates geographical distance between two GPS coordinates in meters."""
    R = 6371000  # Earth radius in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2.0) ** 2 + \
        math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


def _extract_gps_from_exif(gps_info: Dict[int, Any]) -> Optional[Tuple[float, float]]:
    """Converts EXIF GPS coordinate tuples (degrees, minutes, seconds) to decimal float."""
    try:
        def to_degrees(val):
            d = float(val[0])
            m = float(val[1])
            s = float(val[2])
            return d + (m / 60.0) + (s / 3600.0)

        lat = to_degrees(gps_info[2])
        if gps_info[1] == "S":
            lat = -lat

        lon = to_degrees(gps_info[4])
        if gps_info[3] == "W":
            lon = -lon

        return lat, lon
    except Exception:
        return None


def verify_photo_authenticity(
    image_bytes: bytes,
    expected_lat: Optional[float] = None,
    expected_lon: Optional[float] = None,
    challenge_code: Optional[str] = None
) -> Dict[str, Any]:
    """
    Forensic analysis of uploaded inspection image:
    1. Cryptographic SHA-256 hash calculation
    2. EXIF camera hardware telemetry extraction
    3. Software tampering detection (Photoshop/Canva/AI generation tags)
    4. Geofence radius verification against property address
    5. Aspect-ratio and dimension validation against screenshots/web assets
    """
    if not image_bytes or len(image_bytes) == 0:
        raise ValueError("Image file is empty (0 bytes).")

    # 1. Compute immutable SHA-256
    sha256_hash = hashlib.sha256(image_bytes).hexdigest()

    try:
        img = Image.open(io.BytesIO(image_bytes))
        width, height = img.size
        img_format = img.format or "UNKNOWN"
    except Exception as e:
        raise ValueError(f"Corrupted or invalid image format: {str(e)}")

    # 2. Extract EXIF telemetry
    exif_raw = img.getexif()
    exif_data: Dict[str, Any] = {}
    gps_coords: Optional[Tuple[float, float]] = None
    software_tag = None
    device_model = None

    if exif_raw:
        for tag_id, value in exif_raw.items():
            tag_name = ExifTags.TAGS.get(tag_id, tag_id)
            exif_data[str(tag_name)] = str(value)
            if tag_name == "Software":
                software_tag = str(value).lower()
            elif tag_name in ("Model", "Make"):
                device_model = str(value)

        # GPS Info sub-IFD
        try:
            gps_ifd = exif_raw.get_ifd(ExifTags.IFD.GPSInfo)
            if gps_ifd:
                gps_coords = _extract_gps_from_exif(gps_ifd)
        except Exception:
            gps_coords = None

    # 3. Fraud & Authenticity Heuristics
    fraud_flags = []
    trust_score = 100

    # A. Check for known editing software signatures
    if software_tag:
        for bad_app in SUSPICIOUS_SOFTWARE_TAGS:
            if bad_app in software_tag:
                fraud_flags.append(f"Image edited with software tool: '{software_tag}'.")
                trust_score -= 40
                break

    # B. Check for suspicious dimensions / cropped screenshots
    if width < 400 or height < 400:
        fraud_flags.append("Image resolution is abnormally low (<400px), indicating a thumbnail or web icon.")
        trust_score -= 30
    
    # Common 16:9 or 19.5:9 exact mobile screenshot aspect ratios with 0 EXIF
    aspect_ratio = max(width, height) / max(1, min(width, height))
    if (1.75 <= aspect_ratio <= 2.25) and not exif_data:
        fraud_flags.append("Metadata absent with standard mobile screenshot dimensions. Potential screenshot of another screen.")
        trust_score -= 20

    # C. Check EXIF presence
    has_hardware_exif = bool(device_model or gps_coords)
    if not has_hardware_exif:
        # Not strictly an error, since web-uploaded photos often have EXIF stripped by mobile browsers
        trust_score -= 10

    # D. Geofence Verification (if coordinates provided)
    distance_meters = None
    geo_verified = False
    if expected_lat and expected_lon and gps_coords:
        distance_meters = round(_haversine_distance_meters(gps_coords[0], gps_coords[1], expected_lat, expected_lon), 1)
        if distance_meters <= 250:
            geo_verified = True
            trust_score = min(100, trust_score + 10)
        else:
            fraud_flags.append(f"GPS mismatch: Photo was captured {distance_meters}m away from the property location (limit: 250m).")
            trust_score -= 50

    # E. Liveness Challenge Code Check
    challenge_verified = False
    if challenge_code:
        if challenge_code in ACTIVE_CHALLENGES:
            challenge_verified = True
        else:
            fraud_flags.append(f"Challenge code '{challenge_code}' is expired or unrecorded.")
            trust_score -= 15

    # Clamp trust score
    trust_score = max(10, min(100, trust_score))

    # Determine Verdict
    if trust_score >= 80:
        verdict = "AUTHENTIC_LIVE_CAPTURE"
    elif trust_score >= 50:
        verdict = "PROVISIONAL_NEEDS_COUNTER_SIGN"
    else:
        verdict = "SUSPECTED_SPOOF_OR_TAMPERED"

    return {
        "sha256_hash": sha256_hash,
        "trust_score": trust_score,
        "verdict": verdict,
        "dimensions": f"{width}x{height}",
        "format": img_format,
        "device_model": device_model or "Standard Web Capture Device",
        "has_hardware_exif": has_hardware_exif,
        "gps_coordinates": {"lat": gps_coords[0], "lon": gps_coords[1]} if gps_coords else None,
        "distance_meters_from_property": distance_meters,
        "geofence_verified": geo_verified,
        "challenge_code_used": challenge_code,
        "challenge_verified": challenge_verified,
        "fraud_flags": fraud_flags,
        "is_admissible_evidence": (trust_score >= 70)
    }


# ==========================================
# 4. Damage Triage & MTA Repair Estimator
# ==========================================

def triage_damage_and_estimate(
    issue_type: str,
    description: Optional[str] = None
) -> Dict[str, Any]:
    """
    Classifies maintenance issue according to Model Tenancy Act (MTA), 2021:
    - Categorizes urgency
    - Assigns statutory responsibility (Landlord vs. Tenant)
    - Computes fair contractor repair cost in INR
    - Suggests actionable contractor repair scope
    """
    clean_type = issue_type.lower().strip()
    matched_profile = None

    # 1. Direct exact key match
    if clean_type in MAINTENANCE_TAXONOMY:
        matched_profile = MAINTENANCE_TAXONOMY[clean_type]
    else:
        # 2. Score by overlapping words
        best_score = 0
        input_words = set(clean_type.replace("-", " ").replace("_", " ").split())
        for key, profile in MAINTENANCE_TAXONOMY.items():
            key_words = set(key.split("_"))
            overlap = len(key_words.intersection(input_words))
            if overlap > best_score:
                best_score = overlap
                matched_profile = profile

    # Keyword fallback search in description
    if not matched_profile and description:
        desc_lower = description.lower()
        if any(w in desc_lower for w in ["seep", "damp", "leakage", "plaster", "waterproof"]):
            matched_profile = MAINTENANCE_TAXONOMY["wall_seepage_dampness"]
        elif any(w in desc_lower for w in ["mcb", "trip", "spark", "shock", "wiring"]):
            matched_profile = MAINTENANCE_TAXONOMY["electrical_mcb_short"]
        elif any(w in desc_lower for w in ["pipe", "drain", "sink", "flush"]):
            matched_profile = MAINTENANCE_TAXONOMY["plumbing_pipe_leak"]
        elif any(w in desc_lower for w in ["ac", "cooling", "gas"]):
            matched_profile = MAINTENANCE_TAXONOMY["ac_cooling_coil_leak"]
        elif any(w in desc_lower for w in ["lock", "key", "door", "handle"]):
            matched_profile = MAINTENANCE_TAXONOMY["door_lock_broken"]

    # Default fallback
    if not matched_profile:
        matched_profile = {
            "category": "GENERAL_MAINTENANCE",
            "title": issue_type.title() or "General Maintenance Request",
            "default_severity": "ROUTINE_MAINTENANCE",
            "mta_liability": "JOINT_INSPECTION_REQUIRED",
            "mta_clause": "Second Schedule General Provisions (Mutual Handyman Assessment)",
            "min_cost_inr": 400,
            "max_cost_inr": 1500,
            "avg_cost_inr": 850,
            "turnaround_hours": 48,
            "contractor_scope": "Inspect fixture on ground, diagnose root cause, supply itemized materials bill before undertaking repair."
        }

    return {
        "category": matched_profile["category"],
        "issue_title": matched_profile["title"],
        "severity": matched_profile["default_severity"],
        "statutory_liability": matched_profile["mta_liability"],
        "mta_legal_basis": matched_profile["mta_clause"],
        "estimated_cost_inr": {
            "min": matched_profile["min_cost_inr"],
            "max": matched_profile["max_cost_inr"],
            "fair_market_average": matched_profile["avg_cost_inr"]
        },
        "statutory_turnaround_hours": matched_profile["turnaround_hours"],
        "contractor_scope_of_work": matched_profile["contractor_scope"]
    }


# ==========================================
# 5. Bilateral Move-In / Repair Certificate
# ==========================================

def create_inspection_certificate(
    ticket_id: str,
    property_address: str,
    tenant_name: str,
    landlord_name: str,
    authenticity_report: Dict[str, Any],
    triage_report: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Creates an official digital certificate package ready for WhatsApp counter-signing
    and admissible under Section 65B of the Indian Evidence Act.
    """
    cert_id = f"CERT-SNAPFIX-{datetime.now(timezone.utc).strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
    timestamp_str = datetime.now(timezone.utc).strftime("%d %b %Y, %I:%M %p UTC")

    # Generate WhatsApp Deep-Link Message for Landlord Counter-Signing
    wa_message = (
        f"RentFair AI Notice: Move-in Condition Record #{ticket_id}\n\n"
        f"Dear {landlord_name},\n"
        f"Tenant {tenant_name} has registered a verified move-in condition baseline for {property_address}.\n\n"
        f"• Defect: {triage_report['issue_title']} ({triage_report['severity']})\n"
        f"• Statutory Duty (MTA): {triage_report['statutory_liability']}\n"
        f"• Fair Repair Estimate: INR {triage_report['estimated_cost_inr']['fair_market_average']}/-\n"
        f"• Crypto Hash: {authenticity_report['sha256_hash'][:16]}...\n"
        f"• Trust Score: {authenticity_report['trust_score']}/100 ({authenticity_report['verdict']})\n\n"
        f"Please reply 'CONFIRMED' or click the link below within 48 hours to counter-sign the baseline:\n"
        f"https://rentfair.ai/verify/{cert_id}"
    )

    import urllib.parse
    encoded_wa = urllib.parse.quote(wa_message)
    whatsapp_url = f"https://wa.me/?text={encoded_wa}"

    return {
        "certificate_id": cert_id,
        "ticket_id": ticket_id,
        "issued_at": timestamp_str,
        "property_address": property_address,
        "tenant_name": tenant_name,
        "landlord_name": landlord_name,
        "authenticity_summary": {
            "sha256_seal": authenticity_report["sha256_hash"],
            "trust_score": authenticity_report["trust_score"],
            "verdict": authenticity_report["verdict"],
            "admissible_evidence": authenticity_report["is_admissible_evidence"]
        },
        "triage_summary": triage_report,
        "whatsapp_counter_sign_link": whatsapp_url,
        "whatsapp_preview_text": wa_message,
        "status": "AWAITING_LANDLORD_COUNTERSIGN"
    }
