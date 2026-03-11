# Blog Module

## Overview
The Blog module is responsible for serving news, articles, and impact stories related to the NGO's activities. This allows the organization to maintain high transparency and engagement with the donors by showcasing recent interventions and milestones.

## Endpoints
- \`GET /api/blogs\`: Retrieves a list of all published blogs.
- \`GET /api/blogs/:slug\`: Fetches specific blog details based on a unique slug identifier.

## Services
- **BlogService**: Extracts blog content directly from the PostgreSQL database using Prisma.
