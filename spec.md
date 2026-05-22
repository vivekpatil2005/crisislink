# CrisisLink — India Emergency Web App

## Current State
New project — no existing application files.

## Requested Changes (Diff)

### Add
- Interactive map centered on India using Leaflet.js + OpenStreetMap tiles
- User geolocation marker showing current position on map
- SOS alert submission form (name, message, auto-captured GPS coordinates) with stored alerts visible on the map
- Safe zone directory: pre-loaded hospitals, shelters, and evacuation exits across India (states and major districts), shown as map markers and searchable list with filter by type
- First aid triage guide: searchable, categorized step-by-step emergency instructions (bleeding, burns, fractures, cardiac arrest, drowning, earthquake, flood, etc.)
- No login required — fully anonymous and public

### Modify
N/A — new project

### Remove
N/A — new project

## Implementation Plan
1. **Backend (Motoko)**
   - Store SOS alerts: id, name, message, latitude, longitude, timestamp
   - Query all active SOS alerts
   - Store and query safe zones: id, name, type (hospital/shelter/exit), state, district, latitude, longitude
   - Seed safe zones with representative data across India's states and UTs

2. **Frontend (React + TypeScript)**
   - App shell with tab navigation: Map, Safe Zones, SOS Alerts, First Aid
   - **Map tab**: Leaflet map centered on India, user GPS marker, SOS alert pins, safe zone pins with type icons, click-to-view details
   - **Safe Zones tab**: searchable + filterable list (by type, state), click to fly to location on map
   - **SOS Alerts tab**: submit SOS form (name, message, auto GPS), list of recent alerts
   - **First Aid tab**: searchable guide with expandable cards per emergency category
   - Responsive design, works on mobile browsers
