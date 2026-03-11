# Donor Module

## Overview
The Donor module serves data exclusively meant for an authenticated donor. It controls access to the personal donor dashboard containing metrics, program impact tracking, and chronological history of their personal contributions.

## Endpoints
- \`GET /api/donors/dashboard\`: Fetches the donor's impact metrics and tier. Secured by the AuthGuard.
- \`GET /api/donors/donations\`: Retrieves a detailed chronological list of all \`SUCCESS\` donations made by the specific donor.

## Security Practices
This component heavily integrates with the \`AuthModule\` by demanding a valid HTTP-Only JWT cookie for data retrieval, enforcing strict authorization barriers.
