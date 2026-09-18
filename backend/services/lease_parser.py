"""
Lease Document Parser & Metadata Extractor.
Extracts raw text from PDF or direct upload and parses financial / tenure parameters.
"""

import io
import re
from typing import Dict, Any, Optional

def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    """
    Extracts text from PDF binary data using pypdf with comprehensive edge-case handling:
    - 0-byte / empty uploads
    - Encrypted / password-protected files
    - Scanned PDFs without OCR text layers
    - CRLF / CR / LF newline normalization
    """
    if not pdf_bytes or len(pdf_bytes.strip()) == 0:
        raise ValueError("Uploaded file is empty (0 bytes).")

    try:
        from pypdf import PdfReader
        from pypdf.errors import PdfReadError
    except ImportError:
        raise RuntimeError("pypdf library is required for PDF parsing.")

    try:
        reader = PdfReader(io.BytesIO(pdf_bytes))
    except Exception as e:
        # Fallback to UTF-8 decoding only if user uploaded a plain text file misnamed with .pdf extension
        if not pdf_bytes.startswith(b"%PDF-"):
            try:
                decoded = pdf_bytes.decode('utf-8').strip()
                if len(decoded) >= 30 and sum(c.isalnum() for c in decoded) >= 20:
                    return decoded
            except Exception:
                pass
        raise ValueError(f"Corrupted or invalid PDF file structure: {str(e)}")

    if reader.is_encrypted:
        try:
            # Try empty password default
            reader.decrypt("")
        except Exception:
            raise ValueError("The uploaded PDF is password-protected. Please upload an unencrypted document.")

    if not reader.pages or len(reader.pages) == 0:
        raise ValueError("Corrupted or invalid PDF file structure: document contains no readable pages.")

    extracted_text = []
    for idx, page in enumerate(reader.pages):
        try:
            page_text = page.extract_text()
            if page_text and page_text.strip():
                extracted_text.append(page_text.strip())
        except Exception:
            continue

    full_text = "\n\n".join(extracted_text).strip()
    
    # Normalize CRLF and isolated carriage returns to standard newlines
    full_text = full_text.replace('\r\n', '\n').replace('\r', '\n')

    if not full_text or len(full_text) < 30:
        raise ValueError(
            "Unable to extract selectable text from this PDF. "
            "If this document is a scanned image or photograph, please upload a digital text document or paste the text directly."
        )

    return full_text


def extract_metadata(text: str) -> Dict[str, Any]:
    """
    Extracts high-level key parameters from lease text (Rent, Deposit, Dates, Parties).
    Handles real-world variations including colons, prefixes, Indian honorifics, and custom tenures.
    """
    metadata: Dict[str, Any] = {
        "monthly_rent_inr": None,
        "security_deposit_inr": None,
        "tenure_months": 11,
        "lessor_name": None,
        "lessee_name": None
    }

    if not text:
        return metadata

    # 1. Rent pattern: e.g. Monthly rent: INR 26,000/- or rent of INR 32,000 or 16,000/- per month
    rent_patterns = [
        r'(?:monthly\s+rent|rent|monthly\s+fee|monthly\s+charge|twin\s+sharing\s+room)(?:\s+of|\s+is|\s+shall\s+be|:)?\s*(?:inr|rs\.?|₹)?\s*([\d,]+)',
        r'(?:inr|rs\.?|₹)\s*([\d,]+)(?:\s*\/-)?\s*(?:per\s+month|\/-\s*monthly|monthly|as\s+monthly\s+rent)',
        r'(?:pay|paying)\s+(?:a\s+)?(?:monthly\s+)?(?:rent|fee)\s+of\s*(?:inr|rs\.?|₹)?\s*([\d,]+)'
    ]
    for pattern in rent_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            clean_num = match.group(1).replace(',', '')
            try:
                val = int(clean_num)
                if 1000 <= val <= 2000000:
                    metadata["monthly_rent_inr"] = val
                    break
            except ValueError:
                pass

    # 2. Deposit pattern: e.g. Security Deposit of INR 2,56,000 or deposited INR 48,000 as refundable deposit
    deposit_patterns = [
        r'(?:security\s+deposit|caution\s+deposit|refundable\s+deposit|advance\s+deposit|\bdeposit)(?:\s+of|\s+is|\s+shall\s+be|:)?\s*(?:inr|rs\.?|₹)?\s*([\d,]+)',
        r'(?:deposited|furnished|paid)\s*(?:an?\s+interest-free\s+)?(?:inr|rs\.?|₹)?\s*([\d,]+)(?:\s*\/-)?\s*(?:\([^\)]+\)\s*)?as\s+(?:refundable\s+)?security\s+deposit',
        r'(?:inr|rs\.?|₹)\s*([\d,]+)(?:\s*\/-)?\s*(?:\([^\)]+\)\s*)?as\s+(?:refundable\s+)?(?:security\s+)?deposit'
    ]
    for pattern in deposit_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            clean_num = match.group(1).replace(',', '')
            try:
                val = int(clean_num)
                if 1000 <= val <= 10000000:
                    metadata["security_deposit_inr"] = val
                    break
            except ValueError:
                pass

    # 3. Tenure pattern: e.g. 11-month term or minimum 6-month lock-in or period of 24 months
    tenure_patterns = [
        r'(\d+)\s*[- ]\s*months?\s+(?:term|tenure|period|lease|agreement|lock-in)',
        r'(?:term|tenure|period|duration)\s+(?:of\s+)?(?:about\s+)?(\d+)\s+months?',
        r'minimum\s+(\d+)\s*[- ]\s*month'
    ]
    for pattern in tenure_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            try:
                val = int(match.group(1))
                if 1 <= val <= 120:
                    metadata["tenure_months"] = val
                    break
            except ValueError:
                pass

    year_match = re.search(r'(?:term|tenure|period|duration|lease|agreement).{0,35}?\b(\d+)\s+years?\b', text, re.IGNORECASE)
    if not year_match:
        year_match = re.search(r'\b(\d+)\s+years?\b', text, re.IGNORECASE)
    if year_match:
        try:
            val = int(year_match.group(1))
            if 1 <= val <= 10:
                metadata["tenure_months"] = val * 12
        except ValueError:
            pass

    # 4. Lessor / Landlord Name pattern
    lessor_match = re.search(
        r'(?:between|by\s+and\s+between)\s+(?:(?:landlord|lessor)\s+)?(?:(?:mr\.|mrs\.|ms\.|smt\.|shri\.|shri|dr\.|adv\.)\s+)?([A-Z][a-zA-Z\.\s]{1,30}?)(?:\s*\(|\s*,|\s+hereinafter|\s+and\b)',
        text,
        re.IGNORECASE
    )
    if lessor_match:
        name = lessor_match.group(1).strip()
        if len(name) >= 3 and not name.lower().startswith(('the ', 'this ')):
            metadata["lessor_name"] = name
    else:
        lessor_match2 = re.search(r'between\s+([A-Z][a-zA-Z\s]{1,30}?)\s*\((?:operator|lessor|landlord)\)', text, re.IGNORECASE)
        if lessor_match2:
            metadata["lessor_name"] = lessor_match2.group(1).strip()

    # 5. Lessee / Tenant Name pattern
    lessee_match = re.search(
        r'(?:and|second\s+part)\s+(?:(?:tenant|lessee|resident|student\s+resident)\s+)?(?:(?:mr\.|mrs\.|ms\.|smt\.|shri\.|shri|dr\.|adv\.)\s+)?([A-Z][a-zA-Z\.\s]{1,30}?)(?:\s*\(|\s*,|\s+hereinafter|\.\s*\n)',
        text,
        re.IGNORECASE
    )
    if lessee_match:
        name = lessee_match.group(1).strip()
        if len(name) >= 3 and not name.lower().startswith(('the ', 'this ')):
            metadata["lessee_name"] = name

    return metadata
