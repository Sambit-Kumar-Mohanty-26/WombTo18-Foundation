# Donation Module

## Overview
The Donation module manages the entire lifecycle of a financial contribution. It bridges the gap between the frontend checkout form, the backend PostgreSQL database, and the external Razorpay payment gateway API. 

## Endpoints
- \`POST /api/donations/create\`: Initializes a Razorpay order before payment, persisting the intent into the database as a \`PENDING\` donation.
- \`POST /api/donations/verify\`: Validates the cryptographic Razorpay signature after payment success. Resolves the database status to \`SUCCESS\` and re-evaluates the individual donor's tier classification based on total contributions.

## Services
- **DonationService**: Configures Razorpay APIs using server-side \`.env\` credentials. Constructs highly-secure SHA256 signatures to verify payment authenticity.
