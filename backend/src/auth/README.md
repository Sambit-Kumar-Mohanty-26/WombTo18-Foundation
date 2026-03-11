# Auth Module

## Overview
The Auth module provides authentication mechanisms to secure APIs. The primary flow focuses on donor login and OTP verification. By integrating JWT (JSON Web Tokens), this module issues secure, HTTP-only cookies to verified donors, managing their sessions safely.

## Endpoints
- \`POST /api/donor/login\`: Initiates login, verifying the donor's email and issuing an OTP. Checks for \`₹5000+\` donation eligibility before allowing dashboard access.
- \`POST /api/donor/verify-otp\`: Verifies the provided OTP. If valid, issues a secure JWT cookie holding the session state.

## Concepts
- **JWT Strategy**: Validates the incoming JWT cookie on protected routes.
- **Auth Guard**: Applies the JWT strategy as a route guardian, locking down dashboard access.
