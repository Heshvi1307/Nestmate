"""
RentFair AI - Test Document Generator and Archiver
Creates standardized, realistic Indian tenancy agreements in PDF, TXT, and MD formats
for automated testing, manual evaluation, and hackathon demonstration.
"""

import os
from fpdf import FPDF

# Color definitions
COLOR_NAVY = (15, 23, 42)
COLOR_TEAL = (13, 148, 136)
COLOR_MUTED = (100, 116, 139)
COLOR_TEXT = (30, 41, 59)
COLOR_BORDER = (226, 232, 240)

TEST_DOCUMENTS = [
    {
        "id": "01_Bangalore_Metro_Trap_Lease",
        "title": "Public Case 1: Metro Capital Trap (Bengaluru Corridor)",
        "jurisdiction": "Bengaluru, Karnataka (Outer Ring Road / Tech Corridor)",
        "verdict_expected": "HIGH_RISK_PREDATORY",
        "expected_score": "50-60 / 100",
        "summary": "Classic predatory urban tenancy: 8-month security deposit lockup (INR 2,56,000), arbitrary 1-month rent deduction for painting, 11-month lock-in forfeiture, and unannounced landlord entry.",
        "text": """RESIDENTIAL LEASE AGREEMENT (URBAN METRO FORM)

This Tenancy Agreement is entered into on 1st October 2025, between Landlord Mr. V. Narayanan and Tenant Mr. Kunal Joshi.

1. RENT & OCCUPANCY:
The Lessee agrees to pay a monthly rent of INR 32,000/- for Flat 804, Silicon Heights, Outer Ring Road. Rent is due on or before the 1st day of each month.

2. SECURITY DEPOSIT & MANDATORY DEDUCTIONS:
The Lessee has deposited an interest-free Security Deposit of INR 2,56,000/- (representing eight months' rent).
Upon termination of the tenancy, the Lessor shall automatically deduct one full month's rent (INR 32,000/-) towards mandatory repainting and deep sanitization, regardless of the condition of the walls or tenure of stay.
The remaining deposit balance will be refunded 90 days after vacant possession is handed over.

3. LOCK-IN PERIOD & FORFEITURE:
This agreement has a mandatory 11-month lock-in period. If the Lessee vacates prior to 11 months, the Lessor reserves the absolute right to forfeit the entire security deposit.

4. INSPECTION:
The Lessor or his representatives may enter the flat at any time without prior notice to inspect the premises or show it to future occupants."""
    },
    {
        "id": "02_MoHUA_Official_Model_Tenancy_Agreement",
        "title": "Public Case 2: MoHUA Model Tenancy Benchmark (MTA 2021)",
        "jurisdiction": "Central Statutory Benchmark (Ministry of Housing & Urban Affairs)",
        "verdict_expected": "SAFE",
        "expected_score": "95-100 / 100",
        "summary": "Standard government benchmark agreement compliant with Model Tenancy Act, 2021: 2-month deposit cap (INR 48,000), 30-day refund window, 24-hour advance written daylight entry notice, and clear maintenance division.",
        "text": """MODEL TENANCY AGREEMENT (MINISTRY OF HOUSING & URBAN AFFAIRS BENCHMARK)

This Tenancy Agreement is executed on 1st November 2025, between Smt. Radhika Mehta (LANDLORD) and Shri Aarav Deshmukh (TENANT).

1. PREMISES & RENT:
The Landlord lets out Residential Unit 14B, Green Avenue, Ahmedabad. The agreed monthly rent is INR 24,000/- payable on or before the 7th of each month.

2. SECURITY DEPOSIT:
In compliance with Section 11 of the Model Tenancy Act, 2021, the Tenant has deposited INR 48,000/- (equivalent to two months' rent) as refundable security deposit. The Landlord shall refund this deposit within 30 days of handover of vacant possession, subject to joint inspection for actual tenant-caused damage excluding normal wear and tear.

3. ENTRY & INSPECTION NOTICE:
As per Section 15 of the MTA, the Landlord or authorized agent shall provide at least twenty-four (24) hours' prior written or electronic notice specifying the day, time, and reason for entry. All entries shall occur during daylight hours (between 8:00 AM and 7:00 PM).

4. MAINTENANCE OBLIGATIONS:
In accordance with the Second Schedule of the Model Tenancy Act, structural repairs, exterior maintenance, major plumbing lines, and external whitewashing shall be the responsibility of the Landlord. The Tenant shall bear only minor routine consumable repairs under INR 500.

5. RENT REVISION & TERMINATION:
Rent shall remain fixed during the 11-month term. Any renewal revision requires at least 90 days prior written notice. Either party may terminate the tenancy with one month (30 days) written notice."""
    },
    {
        "id": "03_Unlawful_Lockout_High_Court_Precedent",
        "title": "Public Case 3: High Court Precedent on Unlawful Eviction",
        "jurisdiction": "Supreme Court & High Court Precedent Benchmark",
        "verdict_expected": "HIGH_RISK_PREDATORY",
        "expected_score": "25-35 / 100",
        "summary": "Severe predatory clauses violating constitutional rights: essential water/electricity cutoff after 3 days, changing physical locks without court decree, shifting 100% structural repair liability to tenant, and 15% rent hike on 7 days notice.",
        "text": """RESIDENTIAL LEASE DEED

This Deed is made between Mr. H. R. Singhania (Lessor) and Deepak Sharma (Lessee).

1. PREMISES:
Flat 201, Shanti Nagar, SG Highway, Ahmedabad. Monthly rent: INR 26,000/-.

2. REPAIR AND MAINTENANCE:
The Lessee agrees that he shall be responsible for all repairs of every nature, including structural cracks, external roof seepage, wall plastering, and main drainage blockages, and the Lessor shall have no obligation to spend on repairs.

3. DEFAULT, DISCONNECTION & EVICTION:
In the event of a delay in the payment of rent exceeding 3 days, the Lessor retains the unconditional power to disconnect water and electricity supplies immediately, and to change the physical door lock to resume possession without initiating proceedings before any court or Rent Authority.

4. RENT ESCALATION:
The Lessor reserves the right to increase rent by 15% at any time upon giving 7 days verbal notice."""
    },
    {
        "id": "04_Student_CoLiving_PG_Residency_Pact",
        "title": "Public Case 4: Student Co-Living & PG Residency Contract",
        "jurisdiction": "Student University Hubs & Private Hostels",
        "verdict_expected": "MODERATE_CAUTION",
        "expected_score": "68-75 / 100",
        "summary": "Common student housing pact: Non-refundable checkout fees (INR 6,000), surprise room searches by hostel wardens, INR 1,500 automatic curfew fines past 10 PM, and 6-month lock-in forfeiture.",
        "text": """STUDENT CO-LIVING OCCUPANCY CONTRACT

Between Campus Living Ventures (Operator) and Siddharth Rao (Student Resident).

1. MONTHLY FEE:
Twin sharing room: INR 16,000/- per month including Wi-Fi and common electricity up to 80 units.

2. SECURITY DEPOSIT:
Deposit of INR 32,000/-. A mandatory non-refundable maintenance fee of INR 6,000/- will be deducted at checkout.

3. CURFEW & SURPRISE INSPECTION:
Hostel warden may enter rooms at any time without notice for surprise discipline audits. Entry past 10:00 PM incurs an automatic fine of INR 1,500/-.

4. VACATING TERMS:
Minimum 6-month lock-in. Early vacating requires complete forfeiture of deposit."""
    },
    {
        "id": "05_Mumbai_Leave_and_License_Agreement",
        "title": "Public Case 5: Mumbai Standard Leave & License Agreement",
        "jurisdiction": "Mumbai, Maharashtra (Maharashtra Rent Control Act, 1999)",
        "verdict_expected": "SAFE",
        "expected_score": "90-95 / 100",
        "summary": "Standard registered Leave & License agreement: 2-month deposit (INR 90,000), society maintenance paid by owner, 24-hour advance daylight inspection notice, and mutual 1-month notice termination.",
        "text": """LEAVE AND LICENSE AGREEMENT (MAHARASHTRA RENT CONTROL ACT FORMAT)

This Agreement is made at Mumbai on this 15th day of December 2025, between Mr. Anish Kulkarni (hereinafter called the "LICENSOR") and Ms. Tanya Deshmukh (hereinafter called the "LICENSEE").

1. PREMISES & TENURE:
The Licensor grants license to use Flat No. 1202, Sea Crest Towers, Andheri West, Mumbai for a temporary residential tenure of 11 (eleven) months.

2. LICENSE FEE & CHARGES:
The Licensee shall pay a monthly License Fee of INR 45,000/- (Rupees Forty Five Thousand only) payable in advance on or before the 5th day of every calendar month. Society maintenance charges shall be borne by the Licensor.

3. SECURITY DEPOSIT:
The Licensee has paid an interest-free refundable Security Deposit of INR 90,000/- (equivalent to two months' license fee). The Licensor shall refund the entire deposit simultaneously with the handover of key upon expiry of the license, subject to settlement of electricity bills.

4. INSPECTION & VISIT:
The Licensor shall be entitled to inspect the licensed premises at reasonable daylight hours after giving prior notice of at least twenty-four (24) hours.

5. TERMINATION & NOTICE:
Either party may terminate this agreement at any time by giving one month's written notice to the other party without penalty."""
    },
    {
        "id": "06_Ahmedabad_Model_Tenancy_Deed",
        "title": "Public Case 6: Ahmedabad Standard Tenancy Deed",
        "jurisdiction": "Ahmedabad, Gujarat (Vastrapur / SG Highway Corridor)",
        "verdict_expected": "SAFE",
        "expected_score": "92-96 / 100",
        "summary": "Verified residential deed for The Solitaire Terraces: INR 24,000 rent, 2-month deposit (INR 48,000), 5% annual escalation ceiling, 7-day refund turnaround, and 48-hour prior written inspection notice.",
        "text": """RESIDENTIAL TENANCY DEED (AHMEDABAD MUNICIPAL JURISDICTION)

This Tenancy Deed is made on 10th January 2026, by and between Shri Vikramaditya Sanghavi (LANDLORD) and Het Patel (TENANT).

1. PREMISES & MONTHLY RENT:
The Landlord hereby demises to the Tenant Residential Apartment No. 402, The Solitaire Terraces, Vastrapur, Ahmedabad. Monthly rent is agreed at INR 24,000/- (Rupees Twenty Four Thousand only) payable on or before the 1st day of each English calendar month.

2. SECURITY DEPOSIT & TIMELINES:
The Tenant has handed over an interest-free refundable Security Deposit of INR 48,000/- (representing two months' rent). The Landlord covenants to refund the full security deposit within seven (7) business days upon peaceful handover of possession, with deductions restricted solely to unpaid utility invoices or documented physical damage excluding reasonable wear and tear.

3. RENT ESCALATION CAP:
Upon completion of the initial 11-month term, mutual renewal shall be subject to an escalation of no more than 5% (five percent), fixing renewed rent at INR 25,200/- per month.

4. MAINTENANCE LIABILITIES:
Structural upkeep, whitewashing, and main plumbing lines shall be maintained by the Landlord. Routine consumable electrical fixtures (bulbs, fuses) shall be replaced by the Tenant.

5. ACCESS AND ENTRY:
The Landlord or his authorized estate agent may inspect the property only upon delivering forty-eight (48) hours prior electronic or written notice during daylight hours."""
    },
    {
        "id": "07_Delhi_NCR_Corporate_Executive_Lease",
        "title": "Public Case 7: Delhi NCR Corporate Executive Lease",
        "jurisdiction": "Gurugram, Haryana / Delhi NCR (Golf Course Road Corridor)",
        "verdict_expected": "SAFE",
        "expected_score": "88-92 / 100",
        "summary": "Executive furnished duplex lease: INR 55,000 rent, 2-month deposit, diplomatic relocation clause allowing penalty-free exit on official corporate transfer, and 24-hour advance inspection notice.",
        "text": """CORPORATE EXECUTIVE RESIDENTIAL LEASE DEED (DELHI NCR / GURUGRAM)

This Lease Deed is executed on 1st February 2026, between Col. R. S. Bakshi (Retd.) (LESSOR) and Mr. Varun Kapoor (LESSEE).

1. DEMISED PROPERTY & CONSIDERATION:
The Lessor lets out Penthouse 18A, DLF Phase 5, Golf Course Road, Gurugram. Monthly rent is INR 55,000/- inclusive of dual-grid power backup and club access.

2. SECURITY DEPOSIT:
The Lessee has deposited INR 1,10,000/- (equivalent to two months' rent). The Lessor shall refund the complete deposit within fifteen (15) days of checkout following a joint checklist verification.

3. DIPLOMATIC & CORPORATE EXIT CLAUSE:
In the event of official corporate relocation or international transfer exceeding 100 kilometers, the Lessee shall be entitled to terminate this lease with thirty (30) days notice without forfeiture of the security deposit or lock-in penalties.

4. ENTRY PRIVILEGES:
The Lessor covenants to grant unhindered peaceful possession to the Lessee. Any essential maintenance inspection shall require a minimum of 24 hours prior mutual confirmation in writing."""
    }
]

def sanitize_for_pdf(text: str) -> str:
    if not text:
        return ""
    replacements = {
        "—": "--",
        "–": "-",
        "‘": "'",
        "’": "'",
        "“": '"',
        "”": '"',
        "₹": "INR ",
        "•": "-",
        "…": "...",
    }
    for k, v in replacements.items():
        text = text.replace(k, v)
    # Ensure all chars are in latin-1 range
    return text.encode('latin-1', 'replace').decode('latin-1')

class LegalDocPDF(FPDF):
    def __init__(self, doc_title, doc_jurisdiction, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.doc_title = sanitize_for_pdf(doc_title)
        self.doc_jurisdiction = sanitize_for_pdf(doc_jurisdiction)

    def header(self):
        # Top banner
        self.set_font('Helvetica', 'B', 8)
        self.set_text_color(*COLOR_TEAL)
        self.cell(0, 5, 'RENTFAIR AI - STATUTORY TEST BENCHMARK DOCUMENT', align='L')
        self.set_font('Helvetica', '', 8)
        self.set_text_color(*COLOR_MUTED)
        self.cell(0, 5, f'Jurisdiction: {self.doc_jurisdiction}', align='R', new_x='LMARGIN', new_y='NEXT')
        self.set_draw_color(*COLOR_BORDER)
        self.set_line_width(0.3)
        self.line(self.l_margin, self.get_y(), self.w - self.r_margin, self.get_y())
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_draw_color(*COLOR_BORDER)
        self.set_line_width(0.3)
        self.line(self.l_margin, self.get_y(), self.w - self.r_margin, self.get_y())
        self.set_font('Helvetica', '', 8)
        self.set_text_color(*COLOR_MUTED)
        self.cell(0, 10, f'Page {self.page_no()}/{{nb}} - RentFair AI Archive (Model Tenancy Act Validation Suite)', align='C')


def generate_pdf(doc_meta, target_path):
    pdf = LegalDocPDF(
        doc_title=doc_meta["title"],
        doc_jurisdiction=doc_meta["jurisdiction"]
    )
    pdf.set_auto_page_break(auto=True, margin=20)
    pdf.add_page()

    title_clean = sanitize_for_pdf(doc_meta["title"])
    verdict_clean = sanitize_for_pdf(f"Expected RentFair Verdict: {doc_meta['verdict_expected']}  |  Target Score: {doc_meta['expected_score']}")
    summary_clean = sanitize_for_pdf(f"Analysis: {doc_meta['summary'][:110]}...")

    # Document Header Box
    box_y = pdf.get_y()
    box_w = pdf.epw
    box_h = 24
    pdf.set_fill_color(248, 250, 252)
    pdf.set_draw_color(226, 232, 240)
    pdf.rect(pdf.l_margin, box_y, box_w, box_h, 'FD')
    
    pdf.set_xy(pdf.l_margin + 4, box_y + 3)
    pdf.set_font('Helvetica', 'B', 10.5)
    pdf.set_text_color(*COLOR_NAVY)
    pdf.cell(box_w - 8, 5.5, title_clean)
    
    pdf.set_xy(pdf.l_margin + 4, box_y + 9)
    pdf.set_font('Helvetica', '', 8.5)
    pdf.set_text_color(*COLOR_MUTED)
    pdf.cell(box_w - 8, 5, verdict_clean)
    
    pdf.set_xy(pdf.l_margin + 4, box_y + 15)
    pdf.set_font('Helvetica', 'I', 8)
    pdf.cell(box_w - 8, 5, summary_clean)
    
    pdf.set_xy(pdf.l_margin, box_y + box_h + 6)

    # Document Legal Content
    clean_text = sanitize_for_pdf(doc_meta["text"])
    lines = clean_text.split("\n")
    for line in lines:
        stripped = line.strip()
        pdf.set_x(pdf.l_margin)
        if not stripped:
            pdf.ln(2.5)
            continue
        
        # Section titles or headers
        if stripped.isupper() and len(stripped) < 70:
            pdf.set_font('Helvetica', 'B', 10.5)
            pdf.set_text_color(*COLOR_NAVY)
            pdf.multi_cell(pdf.epw, 6, stripped)
            pdf.ln(1)
        elif any(stripped.startswith(f"{i}.") for i in range(1, 10)):
            pdf.set_font('Helvetica', 'B', 9.5)
            pdf.set_text_color(*COLOR_TEAL)
            pdf.multi_cell(pdf.epw, 5.5, stripped)
            pdf.ln(0.5)
        else:
            pdf.set_font('Helvetica', '', 9)
            pdf.set_text_color(*COLOR_TEXT)
            pdf.multi_cell(pdf.epw, 5, stripped)

    # Execution Signatures block
    pdf.ln(6)
    pdf.set_x(pdf.l_margin)
    pdf.set_font('Helvetica', 'B', 9)
    pdf.set_text_color(*COLOR_NAVY)
    pdf.cell(pdf.epw, 6, 'IN WITNESS WHEREOF, the parties sign:')
    pdf.ln(8)
    
    pdf.set_x(pdf.l_margin)
    pdf.set_font('Helvetica', '', 8.5)
    pdf.set_text_color(*COLOR_TEXT)
    half_w = pdf.epw / 2
    pdf.cell(half_w, 5, '__________________________________', align='L')
    pdf.cell(half_w, 5, '__________________________________', align='R')
    pdf.ln(5)
    pdf.set_x(pdf.l_margin)
    pdf.cell(half_w, 5, 'FIRST PARTY (Lessor / Landlord)', align='L')
    pdf.cell(half_w, 5, 'SECOND PARTY (Lessee / Tenant)', align='R')

    pdf.output(target_path)


def generate_markdown(doc_meta, target_path):
    md_content = f"""# {doc_meta['title']}
> **Jurisdiction:** {doc_meta['jurisdiction']}  
> **Expected RentFair Verdict:** `{doc_meta['verdict_expected']}`  
> **Target Safety Score:** `{doc_meta['expected_score']}`  

---

### Benchmark Case Summary
{doc_meta['summary']}

---

### Agreement Full Text
```text
{doc_meta['text']}
```

---
*RentFair AI Test Document Archive — Conforming to Model Tenancy Act (MTA), 2021 Benchmarks.*
"""
    with open(target_path, "w", encoding="utf-8") as f:
        f.write(md_content)


def generate_edge_cases(base_dir):
    edge_dir = os.path.join(base_dir, "edge_cases")
    os.makedirs(edge_dir, exist_ok=True)

    # 1. Zero-byte PDF
    with open(os.path.join(edge_dir, "corrupted_zero_byte.pdf"), "wb") as f:
        f.write(b"")

    # 2. Empty text file
    with open(os.path.join(edge_dir, "empty_file.txt"), "w", encoding="utf-8") as f:
        f.write("")

    # 3. Whitespace-only text file
    with open(os.path.join(edge_dir, "whitespace_only.txt"), "w", encoding="utf-8") as f:
        f.write("            \n\n\t\t   \n   \n")

    # 4. Short gibberish
    with open(os.path.join(edge_dir, "short_gibberish.txt"), "w", encoding="utf-8") as f:
        f.write("A tiny text lease deed.")

    # 5. Scanned image mock PDF (PDF with 1 blank/raster page and zero text layer)
    pdf = FPDF()
    pdf.add_page()
    # Draw a rectangle mimicking a scanned photocopied deed
    pdf.set_fill_color(240, 240, 240)
    pdf.rect(10, 10, 190, 270, 'F')
    pdf.output(os.path.join(edge_dir, "scanned_image_mock.pdf"))


def generate_archive_readme(archive_dir):
    readme_path = os.path.join(archive_dir, "README.md")
    content = """# RentFair AI — Test Document Archive 📂
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
curl -X POST "http://127.0.0.1:8000/api/audit/file" \\
  -H "accept: application/json" \\
  -F "file=@archive/test_documents/pdf/01_Bangalore_Metro_Trap_Lease.pdf"
```

### 3. Automated Pytest Execution:
```bash
pytest backend/tests/test_lease_analyzer.py -v
pytest backend/tests/test_edge_cases.py -v
```
"""
    with open(readme_path, "w", encoding="utf-8") as f:
        f.write(content)


def main():
    base_dir = "archive/test_documents"
    pdf_dir = os.path.join(base_dir, "pdf")
    txt_dir = os.path.join(base_dir, "text")
    md_dir = os.path.join(base_dir, "markdown")

    os.makedirs(pdf_dir, exist_ok=True)
    os.makedirs(txt_dir, exist_ok=True)
    os.makedirs(md_dir, exist_ok=True)

    print(f"Generating {len(TEST_DOCUMENTS)} benchmark test documents...")

    for doc in TEST_DOCUMENTS:
        doc_id = doc["id"]
        
        # 1. PDF
        pdf_path = os.path.join(pdf_dir, f"{doc_id}.pdf")
        generate_pdf(doc, pdf_path)
        print(f"  [PDF] Generated: {pdf_path}")

        # 2. Text
        txt_path = os.path.join(txt_dir, f"{doc_id}.txt")
        with open(txt_path, "w", encoding="utf-8") as f:
            f.write(doc["text"])
        print(f"  [TXT] Generated: {txt_path}")

        # 3. Markdown
        md_path = os.path.join(md_dir, f"{doc_id}.md")
        generate_markdown(doc, md_path)
        print(f"  [MD]  Generated: {md_path}")

    # Generate edge cases
    print("Generating edge-case test files...")
    generate_edge_cases(base_dir)

    # Generate README
    print("Generating archive/README.md...")
    generate_archive_readme("archive")

    print("\n[OK] Successfully created complete test document archive.")


if __name__ == "__main__":
    main()
