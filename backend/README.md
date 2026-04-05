# Team Orion NGO - Backend API

Welcome to the backend API services for Team Orion. This repository houses a fully scalable, enterprise-grade NestJS application designed to securely manage donor interactions, financial transactions, and automated certificate generation for the NGO's transparency initiatives.

## 🚀 Architecture Highlights

- **Framework**: NestJS (v11) - Enforcing a strictly typed, highly modular architectural pattern.
- **Database ORM**: Prisma (v5.22) - Providing typesafe database queries.
- **Database Engine**: PostgreSQL (v15 via Docker) - Reliable relational data integrity.
- **Authentication**: JWT Strategy via \`@nestjs/passport\` using HTTP-only secure cookies.
- **Payment Gateway**: Razorpay Integration - Handling secure webhook verification and automated tier assignments.
- **Dynamic PDF Generation**: PDFKit - For constructing high-quality Donation Receipts and 80G Tax Certificates directly on the server stream.

## 📂 Project Structure & Domain Modules

The application applies Domain-Driven Design (DDD) principles. Every core entity lives entirely within its own folder containing specific controllers and services:

- **[\`src/admin\`](./src/admin/README.md)**: Secure endpoints for managing internal data (donors, programs, reports).
- **[\`src/auth\`](./src/auth/README.md)**: Donor authentication, OTP generation, and JWT issuing.
- **[\`src/blog\`](./src/blog/README.md)**: Public-facing news and NGO updates.
- **[\`src/certificate\`](./src/certificate/README.md)**: Dynamic PDF synthesis for 80G tax exemptions and receipts.
- **[\`src/donation\`](./src/donation/README.md)**: Order creation via Razorpay and payment signature cryptographic validation.
- **[\`src/donor\`](./src/donor/README.md)**: Authenticated donor dashboard, metrics, and historical transaction viewing.
- **[\`src/prisma\`](./src/prisma/README.md)**: Global database connection pooling logic.
- **[\`src/program\`](./src/program/README.md)**: Outlining the specific initiatives people can donate to (e.g., Child Health).

*Tip: Click any module link above to read its explicit design and endpoints.*

---

## 🛠 Local Environment Setup (Docker)

To run the backend locally, you only need Node.js and Docker Desktop installed.

### 1. Install Dependencies
Ensure you are in the \`backend\` directory and install strict typing definitions:
\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment Tokens
Create the \`.env\` file in the \`backend\` root directory:
\`\`\`env
# PostgreSQL connection string to the local Docker container
DATABASE_URL="postgresql://postgres:password@localhost:5434/orion_db?schema=public"

# Auth Tokens
JWT_SECRET="orion_super_secret_key_2025"

# Payment Credentials
RAZORPAY_KEY_ID="rzp_test_5HTu6F8qV"
RAZORPAY_KEY_SECRET="test_secret_12345"

# Bhashini Translation Proxy
BHASHINI_USER_ID="your-bhashini-user-id"
BHASHINI_ULCA_API_KEY="your-bhashini-ulca-api-key"
BHASHINI_PIPELINE_ID="your-bhashini-pipeline-id"

# Optional: use these only if you want to skip config lookup and pin an inference endpoint manually
# BHASHINI_INFERENCE_URL="https://dhruva-api.bhashini.gov.in/services/inference/pipeline"
# BHASHINI_INFERENCE_AUTH_HEADER="Authorization"
# BHASHINI_INFERENCE_AUTH_VALUE="your-inference-api-key"

# Server Execution Port
PORT=3000
\`\`\`

### 3. Initialize the Database
Boot the clean database container using Docker Desktop, then hydrate the schema and seed arbitrary testing data:
\`\`\`bash
# 1. Start the DB instance
docker-compose up -d

# 2. Push Prisma Schema
npx prisma db push

# 3. Apply Prisma Seed Data
npm run seed
\`\`\`

### 4. Start the Application Engine
\`\`\`bash
# Development Mode (Includes Hot Reloading)
npm run start:dev
\`\`\`

---

## 📖 API Documentation & Swagger Explorer

Once the NestJS server binds to the port, you can interact with every single endpoint visually using the auto-generated Swagger UI component.

**Access it here**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

### Primary API Contracts:
- \`POST /api/donor/login\`: Accepts email, returns OTP parameters.
- \`POST /api/donor/verify-otp\`: Verifies code, sets secure HttpOnly JWT.
- \`POST /api/donations/create\`: Initializes payment order.
- \`GET /api/donors/dashboard\`: Fetches profile details (Requires Bearer/Cookie Token).
- \`GET /api/certificates/download/:id\`: Downloads premium 80G tax PDFs.

## ⚖ Business Rules

The backend enforces strict validation criteria:
1. **Tier Advancement**: Donors dynamically shift between \`DONOR\`, \`PATRON\`, and \`CHAMPION\` tags dynamically upon every validated Razorpay transaction.
2. **Dashboard Eligibility**: The donor dashboard routes are locked natively; they require an aggregate donation history of **≥ ₹5000**.
3. **80G Regulation**: 80G exemption PDF generation physically fails if the specific donation payload is less than the regulatory Indian minimum requirement of **₹5000**.
