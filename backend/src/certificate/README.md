# Certificate Module

## Overview
The Certificate module generates fully customized, premium PDF documents representing Donation Receipts and 80G Tax Exemption Certificates. This module leverages \`pdfkit\` to construct pixel-perfect layouts mirroring the frontend UI design aesthetics.

## Endpoints
- \`GET /api/donor/receipts/download/:id\`: Generates and streams a Donation Receipt PDF based on the specific donation ID.
- \`GET /api/certificates/download/:id\`: Generates and streams an 80G Tax Exemption Certificate PDF. Only applicable for valid donations >= ₹5,000.

## Core Dependencies
- **PDFKit**: Used for programmatic PDF construction from node buffers to HTTP responses.
