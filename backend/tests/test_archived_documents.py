"""
Tests verifying that all archived test documents in archive/test_documents/
are fully readable and auditable through RentFair AI API endpoints.
"""

import os
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ARCHIVE_DIR = os.path.join(BASE_DIR, "archive", "test_documents")

def test_archive_directory_structure():
    assert os.path.exists(ARCHIVE_DIR), "Archive test_documents directory must exist"
    for sub in ["pdf", "text", "markdown", "edge_cases"]:
        assert os.path.isdir(os.path.join(ARCHIVE_DIR, sub)), f"Subdirectory {sub} must exist"

def test_audit_archived_text_files():
    txt_dir = os.path.join(ARCHIVE_DIR, "text")
    txt_files = [f for f in os.listdir(txt_dir) if f.endswith(".txt")]
    assert len(txt_files) >= 7, "Must have at least 7 benchmark text contracts"

    for fname in txt_files:
        path = os.path.join(txt_dir, fname)
        with open(path, "r", encoding="utf-8") as f:
            raw_text = f.read()
        
        res = client.post("/api/audit/text", json={"raw_text": raw_text})
        assert res.status_code == 200, f"Failed auditing text file: {fname}"
        data = res.json()
        assert data["success"] is True
        assert "audit" in data
        assert "safety_score" in data["audit"]
        assert "verdict" in data["audit"]
        assert 0 <= data["audit"]["safety_score"] <= 100

def test_audit_archived_pdf_files():
    pdf_dir = os.path.join(ARCHIVE_DIR, "pdf")
    pdf_files = [f for f in os.listdir(pdf_dir) if f.endswith(".pdf")]
    assert len(pdf_files) >= 7, "Must have at least 7 benchmark PDF contracts"

    for fname in pdf_files:
        path = os.path.join(pdf_dir, fname)
        with open(path, "rb") as f:
            pdf_bytes = f.read()

        res = client.post(
            "/api/audit/upload",
            files={"file": (fname, pdf_bytes, "application/pdf")}
        )
        assert res.status_code == 200, f"Failed auditing PDF file: {fname}"
        data = res.json()
        assert data["success"] is True
        assert "audit" in data
        assert "safety_score" in data["audit"]
        assert "verdict" in data["audit"]
        assert 0 <= data["audit"]["safety_score"] <= 100

def test_archived_edge_cases_rejection():
    edge_dir = os.path.join(ARCHIVE_DIR, "edge_cases")
    
    # 1. Zero-byte PDF must be rejected with 400
    zero_pdf = os.path.join(edge_dir, "corrupted_zero_byte.pdf")
    with open(zero_pdf, "rb") as f:
        res = client.post("/api/audit/upload", files={"file": ("corrupted_zero_byte.pdf", f.read(), "application/pdf")})
    assert res.status_code == 400

    # 2. Empty TXT must be rejected with 400
    empty_txt = os.path.join(edge_dir, "empty_file.txt")
    with open(empty_txt, "rb") as f:
        res = client.post("/api/audit/upload", files={"file": ("empty_file.txt", f.read(), "text/plain")})
    assert res.status_code == 400
