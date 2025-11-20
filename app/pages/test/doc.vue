<script setup lang="ts">
const md = `
Here’s a strong **written statement** you can use when submitting business documents for verification. It explains the purpose of each document and affirms your company’s legitimacy. This is useful when dealing with **banks, payment processors, international partners, suppliers, or government agencies**.

---

# 🏢 **Company Verification & Compliance Documentation Statement**

We, **[Company Name]**, are pleased to provide the following official documents to verify the legal existence, operational status, and tax compliance of our business. These documents are issued or recognized by U.S. federal and state authorities and demonstrate that our company is authorized to conduct business in full compliance with applicable laws and regulations.

---

## 📁 **1. Certificate of Formation / Articles of Incorporation**

This document, issued by the **Secretary of State**, confirms the official establishment of our business entity, including its legal name, date of registration, and entity type (LLC, Corporation, Partnership, etc.).

---

## 🏛️ **2. Certificate of Good Standing**

This certificate confirms that our company:

* Is **active and compliant** with state filing requirements
* Has **no outstanding penalties or administrative issues**
* Is legally authorized to operate within the state

✔ Issued directly by the Secretary of State

---

## 🧾 **3. Business License / Permit**

Depending on jurisdiction and business activity, we maintain all required business licenses or permits. These may include:

* Local city or county business license
* Industry-specific regulatory permit (if applicable)

This demonstrates our authorization to operate within our professional field.

---

## 🧾 **4. IRS EIN Confirmation (Tax ID) / W-9 Form**

We provide our **Federal Employer Identification Number (EIN)** as assigned by the **Internal Revenue Service (IRS)**, along with a completed **Form W-9** for tax identification purposes.
This verifies our company’s tax status and eligibility to receive payments in the United States.

---

## 🏦 **5. Company Address & Banking Verification (If Required)**

To support operational verification, we may also provide:

* Official business address documentation
* Utility bill, lease agreement, or banking letter (if requested)

---

## ✍️ **6. Authorized Signatory Declaration**

A signed statement from an officer or authorized representative is included to certify the accuracy of all records and confirm our authority to enter into business contracts and financial agreements.

---

# ✅ **Purpose of Submission**

These documents are being provided for the sole purpose of:

* Business verification
* Vendor, partner, or supplier onboarding
* Financial account or payment processing compliance
* Regulatory due diligence (KYC / AML)

---

# 📌 **Company Contact for Verification**

**Name:** __________________________\r\n\r\n
**Title:** __________________________\r\n\r\n
**Email:** __________________________\r\n\r\n
**Phone:** __________________________\r\n\r\n

---

We affirm that all submitted documents are true, accurate, and issued by the appropriate authorities. Should additional documentation or verification be required, we are ready to provide timely support.

**Sincerely,**\r\n\r\n
**[Company Name]**\r\n\r\n
**Authorized Representative**\r\n\r\n

---

Would you like me to format this into a **PDF letter** or **professional Word document** with your logo and signature area? I can generate it instantly.

`
</script>

<template>
  <MDC :value="md"
       tag="article" />
</template>
<style lang="postcss">
article p {
  line-height: 1.6;
  @apply mb-4;
}
</style>