"""
Lease Document Parser & Metadata Extractor.
Extracts raw text from PDF or direct upload and parses financial / tenure parameters.
"""

import io
import re
from typing import Dict, Any, Optional

def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    """
    Extracts text from PDF binary data using pypdf.
    """
    try:
        from pypdf import PdfReader
        reader = PdfReader(io.BytesIO(pdf_bytes))
        extracted_text = []
        for idx, page in enumerate(reader.pages):
            page_text = page.extract_text()
            if page_text:
                extracted_text.append(page_text)
        return "\n\n".join(extracted_text)
    except Exception as e:
        # Fallback to UTF-8 decoding if plain text was sent
        try:
            return pdf_bytes.decode('utf-8')
        except Exception:
            raise ValueError(f"Unable to parse document format: {str(e)}")


def extract_metadata(text: str) -> Dict[str, Any]:
    """
    Extracts high-level key parameters from lease text (Rent, Deposit, Dates, Parties).
    """
    metadata: Dict[str, Any] = {
        "monthly_rent_inr": None,
        "security_deposit_inr": None,
        "tenure_months": 11,
        "lessor_name": None,
        "lessee_name": None
    }

    # Rent pattern: e.g. INR 25,000 or Rs. 25000 or 25,000/-
    rent_match = re.search(r'(?:rent(?:\s+of|\s+is|\s+shall\s+be)?\s*(?:inr|rs\.?|₹)?\s*([\d,]+))', text, re.IGNORECASE)
    if rent_match:
        clean_num = rent_match.group(1).replace(',', '')
        try:
            val = int(clean_num)
            if 1000 <= val <= 500000:
                metadata["monthly_rent_inr"] = val
        except ValueError:
            pass

    # Deposit pattern: e.g. deposit of INR 75,000
    deposit_match = re.search(r'(?:security\s+deposit(?:\s+of|\s+is)?\s*(?:inr|rs\.?|₹)?\s*([\d,]+))', text, re.IGNORECASE)
    if deposit_match:
        clean_num = deposit_match.group(1).replace(',', '')
        try:
            val = int(clean_num)
            if 1000 <= val <= 2000000:
                metadata["security_deposit_inr"] = val
        except ValueError:
            pass

    # Names pattern
    lessor_match = re.search(r'(?:between|mr\.|mrs\.|ms\.)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})\s*\((?:hereinafter\s+referred\s+to\s+as\s+the\s+)?[\'\"]?(?:LESSOR|LANDLORD)', text, re.IGNORECASE)
    if lessor_match:
        metadata["lessor_name"] = lessor_match.group(1)

    lessee_match = re.search(r'(?:and|mr\.|mrs\.|ms\.)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})\s*\((?:hereinafter\s+referred\s+to\s+as\s+the\s+)?[\'\"]?(?:LESSEE|TENANT)', text, re.IGNORECASE)
    if lessee_match:
        metadata["lessee_name"] = lessee_match.group(1)

    return metadata
