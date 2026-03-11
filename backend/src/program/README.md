# Program Module

## Overview
The Program module publishes details on all active NGO initiatives (e.g., Child Health, Education For All). This serves as the public-facing directory dictating where incoming donations are applied.

## Endpoints
- \`GET /api/programs\`: Outputs the global list of active NGO programs. Provides data points such as name, description, and the target financial goals versus actual raised amounts.

## Connectivity
- This component interacts safely with public non-authenticated views and serves baseline data dynamically injected into frontend dropdown menus and visual goal trackers.
