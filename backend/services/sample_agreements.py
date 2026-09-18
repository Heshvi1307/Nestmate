"""
Public Domain Rental Agreement Test Cases & Statutory Benchmarks.
Sources:
1. Ministry of Housing & Urban Affairs (MoHUA) Model Tenancy Act, 2021 Model Lease.
2. Karnataka Rent Act / Bangalore Metro Rental Dispute Case Studies (Deposit & Painting Deductions).
3. Consumer Court / Civil Court precedents on Unlawful Eviction & Essential Utility Disconnection.
4. Student Housing & Co-Living standard operator agreements.
"""

SAMPLE_AGREEMENTS = {
    "bangalore_metro_trap": {
        "title": "Public Case 1: Metro Capital Trap (Bengaluru / High-Demand Corridor)",
        "description": "Real-world dispute pattern: 8-month deposit lockup, arbitrary 1-month rent deduction for painting, and forfeiture.",
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
    "mohua_official_mta": {
        "title": "Public Case 2: MoHUA Official Model Tenancy Agreement (Government Benchmark)",
        "description": "Standard tenancy contract published by the Ministry of Housing & Urban Affairs (MoHUA) following MTA 2021 safeguards.",
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
    "unlawful_lockout_dispute": {
        "title": "Public Case 3: High Court Precedent on Unlawful Eviction & Utility Cutoff",
        "description": "Dispute pattern based on Supreme Court & High Court rulings barring disconnection of essential water/electricity without due process.",
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
    "student_pg_coliving": {
        "title": "Public Case 4: Student Co-Living & PG Residency Pact",
        "description": "Common student co-living agreement with arbitrary curfew penalties, non-refundable admission fees, and surprise searches.",
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
    }
}
