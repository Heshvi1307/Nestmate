"""



RentFair AI - Backend API Gateway
Provides legal document auditing, predatory clause identification,
deposit timeline calculation, and sample benchmark data.
"""

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import os
import uuid

from services.sample_agreements import SAMPLE_AGREEMENTS
from services.gemini_service import audit_with_hybrid_engine, generate_counter_clause_hybrid
from services.clause_analyzer import audit_agreement_text
from services.lease_parser import extract_text_from_pdf_bytes, extract_metadata

app = FastAPI(
    title="RentFair AI - PropTech API",
    description="Next-Gen Real Estate & Living Space Legal Guard API for Technofora '26 CodeCraft",
    version="1.0.0"
)

# Enable CORS for Frontend Dev Server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextAuditRequest(BaseModel):
    raw_text: str

class CounterClauseRequest(BaseModel):
    category: str
    original_clause: str
    concern_tone: Optional[str] = "diplomatic"  # diplomatic, firm, statutory

@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "RentFair AI - Legal Lease Guard",
        "version": "1.0.0",
        "hackathon": "Technofora '26 CodeCraft @ Nirma University"
    }

@app.get("/api/samples")
def get_sample_agreements():
    """
    Returns pre-loaded sample agreements for one-click testing and demonstration.
    """
    return {
        "success": True,
        "samples": [
            {
                "id": k,
                "title": v["title"],
                "description": v["description"],
                "text": v["text"]
            }
            for k, v in SAMPLE_AGREEMENTS.items()
        ]
    }

@app.post("/api/audit/text")
def audit_text(payload: TextAuditRequest):
    """
    Directly audits raw rental agreement text with hybrid AI and deterministic validation.
    """
    text = payload.raw_text.strip()
    if not text or len(text) < 30:
        raise HTTPException(status_code=400, detail="Text is too short to be a valid tenancy agreement (minimum 30 characters required).")

    if len(text) > 500_000:
        raise HTTPException(status_code=413, detail="Text payload exceeds maximum limit of 500KB.")

    if sum(c.isalnum() for c in text) < 20:
        raise HTTPException(status_code=400, detail="Text does not contain sufficient alphanumeric words to constitute a legal contract.")

    metadata = extract_metadata(text)
    audit_results = audit_with_hybrid_engine(text)

    return {
        "success": True,
        "metadata": metadata,
        "audit": audit_results
    }

@app.post("/api/audit/upload")
async def audit_upload(file: UploadFile = File(...)):
    """
    Accepts PDF or text file upload, extracts text with edge-case protection, and returns full legal audit.
    """
    if not file or not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded or missing filename.")

    filename = file.filename.lower().strip()
    allowed_exts = (".pdf", ".txt", ".text")
    if not any(filename.endswith(ext) for ext in allowed_exts):
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{file.filename}'. Please upload a PDF (.pdf) or text document (.txt)."
        )

    try:
        content = await file.read()
        max_size = 10 * 1024 * 1024  # 10 MB limit
        if len(content) == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty (0 bytes).")
        if len(content) > max_size:
            raise HTTPException(status_code=413, detail="Uploaded file exceeds 10MB size limit. Please upload a smaller document.")

        if filename.endswith(".pdf"):
            text = extract_text_from_pdf_bytes(content)
        else:
            text = content.decode("utf-8", errors="ignore").strip()

        if not text or len(text.strip()) < 30 or sum(c.isalnum() for c in text) < 20:
            raise HTTPException(
                status_code=400,
                detail="Unable to extract meaningful legal text from uploaded document. Ensure the file is not empty or a scanned image lacking OCR text."
            )

        metadata = extract_metadata(text)
        audit_results = audit_with_hybrid_engine(text)

        return {
            "success": True,
            "filename": file.filename,
            "file_size_bytes": len(content),
            "metadata": metadata,
            "audit": audit_results
        }
    except HTTPException:
        raise
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Document processing failed: {str(e)}")

@app.post("/api/counter-clause")
def generate_counter_clause(payload: CounterClauseRequest):
    """
    Generates an optimized, legally sound counter-clause with requested tone.
    """
    tone = payload.concern_tone or "diplomatic"
    result = generate_counter_clause_hybrid(
        category=payload.category,
        original_clause=payload.original_clause,
        tone=tone
    )
    return result

from services.harmony_service import (
    BENCHMARK_ROOMMATES,
    LifestyleVector,
    calculate_compatibility,
    generate_living_charter_hybrid
)

class HarmonyMatchRequest(BaseModel):
    user_name: Optional[str] = "You"
    user_vector: LifestyleVector
    candidate_id: Optional[str] = None
    candidate_name: Optional[str] = None
    candidate_vector: Optional[LifestyleVector] = None

class HarmonyCharterRequest(BaseModel):
    user_name: Optional[str] = "You"
    candidate_name: str
    user_vector: LifestyleVector
    candidate_vector: LifestyleVector
    match_result: Dict[str, Any]

@app.get("/api/harmony/candidates")
def get_harmony_candidates():
    """
    Returns pre-loaded roommate profiles with lifestyle vectors for instant matching.
    """
    return {
        "success": True,
        "candidates": [c.model_dump() for c in BENCHMARK_ROOMMATES]
    }

@app.post("/api/harmony/match")
def run_harmony_match(payload: HarmonyMatchRequest):
    """
    Computes multi-dimensional lifestyle compatibility and friction points.
    """
    candidate_profile = None
    if payload.candidate_id:
        match_prof = next((c for c in BENCHMARK_ROOMMATES if c.id == payload.candidate_id), None)
        if match_prof:
            candidate_profile = match_prof.model_dump()
            c_vec = match_prof.lifestyle_vector
            c_name = match_prof.name
        else:
            raise HTTPException(status_code=404, detail=f"Candidate profile '{payload.candidate_id}' not found.")
    elif payload.candidate_vector:
        c_vec = payload.candidate_vector
        c_name = payload.candidate_name or "Flatmate"
    else:
        raise HTTPException(status_code=400, detail="Must provide candidate_id or candidate_vector.")

    match_result = calculate_compatibility(payload.user_vector, c_vec)

    return {
        "success": True,
        "user_name": payload.user_name or "You",
        "candidate_name": c_name,
        "candidate_profile": candidate_profile,
        "match": match_result
    }

@app.post("/api/harmony/charter")
def get_living_charter(payload: HarmonyCharterRequest):
    """
    Generates an actionable Roommate Living Charter to eliminate domestic friction.
    """
    charter = generate_living_charter_hybrid(
        user_name=payload.user_name or "You",
        candidate_name=payload.candidate_name,
        user_vec=payload.user_vector,
        candidate_vec=payload.candidate_vector,
        match_result=payload.match_result
    )
    return {
        "success": True,
        "charter": charter
    }

# ==========================================
# 4. SnapFix Anti-Fraud & Triage Endpoints
# ==========================================

from services.snapfix_service import (
    generate_liveness_challenge,
    verify_photo_authenticity,
    triage_damage_and_estimate,
    create_inspection_certificate,
    MAINTENANCE_TAXONOMY
)

@app.get("/api/snapfix/challenge")
def get_snapfix_challenge():
    """
    Generates dynamic physical liveness challenge to eliminate screenshot and stock-photo fraud.
    """
    return {
        "success": True,
        "challenge": generate_liveness_challenge()
    }

@app.get("/api/snapfix/taxonomy")
def get_snapfix_taxonomy():
    """
    Returns statutory maintenance benchmarks conforming to Model Tenancy Act Second Schedule.
    """
    return {
        "success": True,
        "categories": MAINTENANCE_TAXONOMY
    }

@app.post("/api/snapfix/verify-and-triage")
async def verify_and_triage_photo(
    file: UploadFile = File(...),
    issue_type: str = Form("plumbing_pipe_leak"),
    description: Optional[str] = Form(None),
    challenge_code: Optional[str] = Form(None),
    expected_lat: Optional[float] = Form(None),
    expected_lon: Optional[float] = Form(None),
    property_address: Optional[str] = Form("Flat 402, Green Residency, Vastrapur, Ahmedabad"),
    tenant_name: Optional[str] = Form("Het Patel"),
    landlord_name: Optional[str] = Form("Vikramaditya Sanghavi")
):
    """
    Anti-Fraud verification and statutory damage triage on live-captured condition photos:
    1. Cryptographic SHA-256 baseline seal
    2. EXIF camera telemetry & tamper check
    3. GPS geofence validation
    4. MTA repair liability & fair INR cost estimate
    5. Bilateral WhatsApp counter-sign certificate package
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Missing file attachment.")

    # Read binary
    image_bytes = await file.read()
    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded photo is empty (0 bytes).")
    if len(image_bytes) > 15 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Photo exceeds maximum size limit of 15MB.")

    try:
        auth_report = verify_photo_authenticity(
            image_bytes=image_bytes,
            expected_lat=expected_lat,
            expected_lon=expected_lon,
            challenge_code=challenge_code
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image forensics failed: {str(e)}")

    triage_report = triage_damage_and_estimate(
        issue_type=issue_type,
        description=description
    )

    ticket_id = f"TICK-{uuid.uuid4().hex[:6].upper()}"
    certificate = create_inspection_certificate(
        ticket_id=ticket_id,
        property_address=property_address or "Residential Premises",
        tenant_name=tenant_name or "Tenant",
        landlord_name=landlord_name or "Property Owner",
        authenticity_report=auth_report,
        triage_report=triage_report
    )

    return {
        "success": True,
        "ticket_id": ticket_id,
        "filename": file.filename,
        "authenticity": auth_report,
        "triage": triage_report,
        "certificate": certificate
    }

# ==========================================
# 5. TrueCost Index Endpoints (Pillar 4)
# ==========================================

from services.truecost_service import (
    CORRIDOR_BENCHMARKS,
    PropertyCostInput,
    calculate_single_true_cost,
    compare_two_properties,
    generate_whatsapp_negotiation
)

class ComparePropertiesRequest(BaseModel):
    flat_a: PropertyCostInput
    flat_b: PropertyCostInput

class NegotiationRequest(BaseModel):
    property_name: str
    base_rent: float
    corridor_benchmark_rent: float
    maintenance: float = 0.0
    deposit_months: float = 2.0
    landlord_name: Optional[str] = "Owner"

@app.get("/api/truecost/corridors")
def get_truecost_corridors():
    """
    Returns hyper-local micro-corridor rent and maintenance benchmarks.
    """
    return {
        "success": True,
        "cities": CORRIDOR_BENCHMARKS
    }

@app.post("/api/truecost/calculate")
def calculate_truecost(payload: PropertyCostInput):
    """
    Calculates 11-month Total Cost of Occupancy (TCO), hidden overheads,
    deposit opportunity cost, and corridor market position.
    """
    report = calculate_single_true_cost(payload)
    return {
        "success": True,
        "report": report
    }

@app.post("/api/truecost/compare")
def compare_properties(payload: ComparePropertiesRequest):
    """
    Direct side-by-side financial and lifestyle comparison between two properties.
    """
    comparison = compare_two_properties(payload.flat_a, payload.flat_b)
    return {
        "success": True,
        "comparison": comparison
    }

@app.post("/api/truecost/negotiate")
def get_whatsapp_negotiation(payload: NegotiationRequest):
    """
    Generates a courteous, data-backed WhatsApp negotiation draft and direct link.
    """
    draft = generate_whatsapp_negotiation(
        property_name=payload.property_name,
        base_rent=payload.base_rent,
        corridor_benchmark_rent=payload.corridor_benchmark_rent,
        maintenance=payload.maintenance,
        deposit_months=payload.deposit_months,
        landlord_name=payload.landlord_name
    )
    return {
        "success": True,
        "negotiation": draft
    }

if __name__ == "__main__":
    import uvicorn
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host=host, port=port)
