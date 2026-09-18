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

from services.sample_agreements import SAMPLE_AGREEMENTS
from services.gemini_service import audit_with_hybrid_engine, generate_counter_clause_hybrid
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
    Directly audits raw rental agreement text.
    """
    text = payload.raw_text.strip()
    if not text or len(text) < 30:
        raise HTTPException(status_code=400, detail="Text is too short to be a valid tenancy agreement.")

    metadata = extract_metadata(text)
    audit_results = audit_agreement_text(text)

    return {
        "success": True,
        "metadata": metadata,
        "audit": audit_results
    }

@app.post("/api/audit/upload")
async def audit_upload(file: UploadFile = File(...)):
    """
    Accepts PDF or text file upload, extracts text, and returns full legal audit.
    """
    try:
        content = await file.read()
        filename = file.filename.lower()
        
        if filename.endswith(".pdf"):
            text = extract_text_from_pdf_bytes(content)
        else:
            text = content.decode("utf-8", errors="ignore")

        if not text or len(text.strip()) < 30:
            raise HTTPException(status_code=400, detail="Unable to extract meaningful text from uploaded document.")

        metadata = extract_metadata(text)
        audit_results = audit_agreement_text(text)

        return {
            "success": True,
            "filename": file.filename,
            "file_size_bytes": len(content),
            "metadata": metadata,
            "audit": audit_results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

@app.post("/api/counter-clause")
def generate_counter_clause(payload: CounterClauseRequest):
    """
    Generates an optimized, legally sound counter-clause based on tone preference.
    """
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
        payload.category,
        "Both parties agree to adhere to standard equitable terms under the Model Tenancy Act."
    )

    return {
        "success": True,
        "category": payload.category,
        "recommended_text": template,
        "sharing_message": f"Hi, I reviewed our draft lease agreement. Regarding the {payload.category.replace('_', ' ')} clause, standard tenancy norms recommend: \"{template}\" Could we kindly update the draft accordingly?"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
