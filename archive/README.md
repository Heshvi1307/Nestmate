# RentFair AI — Test Document Archive 📂
> **Benchmark Legal Agreements & Edge Cases for Lease Auditing & Dispute Shield**

This directory archives verified, standardized test documents across multiple Indian residential leasing formats, designed for automated CI/CD validation, manual file upload testing, and hackathon demonstrations.

---

## 📑 Test Document Catalogue

| # | Document File | Jurisdiction / Model | Expected Verdict | Score Range | Key Statutory Violation / Protection |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **01** | `01_Bangalore_Metro_Trap_Lease` | Bengaluru (Outer Ring Road) | `HIGH_RISK_PREDATORY` | `50–60` | 8-month deposit lockup, arbitrary painting deduction, 11-month lock-in forfeiture, zero-notice entry. |
| **02** | `02_MoHUA_Official_Model_Tenancy_Agreement` | Central MoHUA Benchmark | `SAFE` | `95–100` | Section 11 MTA 2-month deposit limit, 30-day refund window, Section 15 24h entry notice, structural repair division. |
| **03** | `03_Unlawful_Lockout_High_Court_Precedent` | Landmark Judicial Dispute | `HIGH_RISK_PREDATORY` | `25–35` | 3-day utility cutoff, door padlock change without court decree, shifting 100% structural repairs to tenant. |
| **04** | `04_Student_CoLiving_PG_Residency_Pact` | Student Hub / PG | `MODERATE_CAUTION` | `68–75` | Mandatory non-refundable checkout fees, surprise warden room searches, curfew violation fines. |
| **05** | `05_Mumbai_Leave_and_License_Agreement` | Mumbai MMRDA (MRCA 1999) | `SAFE` | `90–95` | Standard Leave & License, 2-month deposit, society maintenance by owner, 1-month notice termination. |
| **06** | `06_Ahmedabad_Model_Tenancy_Deed` | Ahmedabad (Vastrapur) | `SAFE` | `92–96` | Verified 2BHK deed, 5% annual escalation ceiling, 7-day refund turnaround, 48h prior inspection notice. |
| **07** | `07_Delhi_NCR_Corporate_Executive_Lease` | Gurugram Cyber City / DLF | `SAFE` | `88–92` | Corporate executive duplex lease, dual power billing, diplomatic relocation exit clause. |

---

## 📁 Directory Structure

```text
archive/
├── test_documents/
│   ├── pdf/               # Ready-to-upload PDF lease deeds (formatted with headers & signature blocks)
│   ├── text/              # Plain text lease contracts (.txt) for text paste & API testing
│   ├── markdown/          # Formatted Markdown versions (.md) for reading & GitHub preview
│   └── edge_cases/        # Negative test files (zero-byte, scanned mock, empty, whitespace)
├── hackathon_guidelines/  # Technofora '26 Hackathon Rulebooks & Technical Directives
│   ├── Hackathon_rulebook.pdf
│   └── Hackathon_Technical_Rules.pdf
├── generate_archive.py    # Standalone script to regenerate all benchmark documents
└── README.md              # This inventory and documentation guide
```

---

## 🚀 How to Test with These Documents

### 1. Web UI File Upload:
1. Open the **RentFair AI** web app (`http://localhost:5173`).
2. Go to the **LeasePulse AI / FairLease Guard** tab.
3. Drag & drop any `.pdf` from `archive/test_documents/pdf/` or `.txt` from `archive/test_documents/text/`.
4. Observe the instant statutory audit score, plain-English breakdown, and deposit recovery timeline.

### 2. cURL / REST API Test:
```bash
curl -X POST "http://127.0.0.1:8000/api/audit/file" \
  -H "accept: application/json" \
  -F "file=@archive/test_documents/pdf/01_Bangalore_Metro_Trap_Lease.pdf"
```

### 3. Automated Pytest Execution:
```bash
pytest backend/tests/test_lease_analyzer.py -v
pytest backend/tests/test_edge_cases.py -v
```
