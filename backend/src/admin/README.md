# Admin Module

## Overview
The Admin module handles administrative functionalities for managing and overseeing the platform's donors, programs, and progress reports. It is the core management module used by the internal NGO team.

## Endpoints
- \`GET /api/admin/donors\`: List all registered donors and their contribution summaries.
- \`GET /api/admin/programs\`: List all available donation programs.
- \`POST /api/admin/programs\`: Create a new donation program.
- \`POST /api/admin/reports\`: Post a progress report regarding an ongoing program.

## Services
- **AdminService**: Interfaces with Prisma to insert and retrieve administrative data efficiently.
