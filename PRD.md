# STRAINA — PRODUCT REQUIREMENTS DOCUMENT

**Document Status:** Draft / In Review  
**Product Name:** Straina  
**Author(s):** Lerato Thungo (Team Claude)  
**Student Number:** SNPL2026  
**Course / Cohort:** SNPL APRIL COHORT 2026  
**Facilitator / Reviewer:** Mnelisi Maswanganyi  
**Platform:** Web Application  
**Technology:** React + TypeScript + Vite  
**Original App Idea Link:** Not provided yet  
**Repository:** GitHub repository supplied for the project  
**Version:** 1.0

---

## 1. PRODUCT OVERVIEW

### 1.1 Product Name
Straina

### 1.2 Product Description

> An intelligent antimicrobial-resistance mapping platform that visualises where drug-resistant organisms are emerging, tracks how resistance patterns change over time, and identifies potential hotspots before they become larger public-health threats.

### 1.3 Product Vision

Straina aims to make antimicrobial-resistance information easier to understand by transforming complex surveillance information into an interactive geographic and time-based experience.

The platform will allow users to explore where antimicrobial resistance is observed, how resistance patterns change over time, and which areas may require closer attention.

### 1.4 Product Purpose

The purpose of Straina is to provide an accessible web-based way to explore antimicrobial-resistance information geographically and over time.

The platform is intended to support understanding and surveillance of antimicrobial resistance. It is **not** intended to provide individual medical diagnoses or treatment recommendations.

### 1.5 Platform

Straina will be developed as a web application.

The current repository uses React, TypeScript, Vite, React DOM, and Vitest. The current repository is a project reference and does not yet represent the final MVP documented in this PRD.

---

## 2. PROBLEM STATEMENT

Antimicrobial resistance (AMR) is a major public-health concern, but information about resistance can be difficult to understand when it is distributed across reports, datasets, technical surveillance information, and different information sources.

There is a need for an accessible way to understand:

- Where resistance is being observed.
- How resistance patterns change over time.
- What resistance patterns are being observed.
- Which areas may require closer attention.

Straina addresses this problem by providing an interactive map and time-based exploration experience for AMR surveillance information.

Straina is not a medical diagnostic or treatment system.

---

## 3. GOALS AND OBJECTIVES

### 3.1 Goals

**G1 — Geographic Visibility**  
Help users understand where AMR information is being reported.

**G2 — Temporal Understanding**  
Allow users to explore how resistance patterns change over time.

**G3 — Data Transparency**  
Provide information about the sources and context of the data being displayed.

**G4 — Potential Hotspot Identification**  
Identify areas that meet a clearly documented definition of a potential AMR hotspot.

**G5 — Inclusive Access**  
Make the core experience accessible without requiring an account.

### 3.2 Objectives

Straina should:

1. Provide an interactive AMR map.
2. Allow geographic exploration of AMR information.
3. Allow exploration of AMR information over time.
4. Use real, attributable data for the production experience.
5. Identify potential hotspots using an approved methodology.
6. Provide information about data sources.
7. Clearly communicate data limitations.
8. Avoid providing medical advice.
9. Make the experience understandable to both specialist and non-specialist users.

---

## 4. TARGET USERS / PERSONAS

### 4.1 Primary User

**Public-health / AMR surveillance professional**

The primary user is a public-health or antimicrobial-resistance surveillance professional who needs to understand where resistance occurs, how resistance patterns change, and which areas may require further investigation.

The choice of primary user is based on the role of AMR surveillance in supporting the understanding of resistance patterns and public-health action.

### 4.2 Secondary Users

- Researchers
- Healthcare professionals
- Policymakers and public-health decision makers
- General public

The general public should still be able to access the core Straina experience without creating an account.

The interface should avoid unnecessary technical language so that important information can be understood by non-specialist users.

---

## 5. USER STORIES

### US1 — Explore AMR Map

**As a public user, I want to explore an AMR map so that I can understand where resistance is being reported.**

#### Acceptance Criteria

- The map is visible.
- Geographic AMR information is represented.
- A legend or explanation is available.
- An appropriate error state is shown if data cannot load.
- No fabricated AMR data is displayed as real data.

### US2 — Explore AMR Over Time

**As a surveillance user, I want to change the time period so that I can understand how resistance patterns change over time.**

#### Acceptance Criteria

- The user can select a time period.
- The displayed data updates according to the selected period.
- A clear no-data state is shown when information is unavailable.
- Missing data is not treated as zero.

### US3 — Inspect Resistance Patterns

**As an analyst, I want to inspect a selected geographic area so that I can understand the resistance information associated with that area.**

#### Acceptance Criteria

- The user can select an area.
- Relevant resistance information is displayed.
- The source and context of the information are available.
- A clear no-data state is shown when appropriate.

### US4 — Identify Potential Hotspots

**As a surveillance user, I want potential hotspots to be highlighted so that I can identify areas that may require closer attention.**

#### Acceptance Criteria

- The hotspot methodology is defined before implementation.
- Areas meeting the defined criteria are highlighted.
- Areas with insufficient data are not incorrectly flagged.
- Potential hotspots are not presented as confirmed outbreaks.

### US5 — Understand Data Sources

**As a user, I want to understand where the information comes from so that I can evaluate the context and credibility of the data.**

#### Acceptance Criteria

- The data source is identifiable.
- Relevant update information is available.
- Geographic and temporal coverage can be understood.
- Surveillance information is not presented without attribution.

---

## 6. FEATURES AND REQUIREMENTS

### F1 — Interactive AMR Map
**Priority:** Must Have

The platform must provide an interactive map for exploring AMR information geographically.

### F2 — Time Exploration
**Priority:** Must Have

Users must be able to explore AMR information across available time periods.

### F3 — Resistance Pattern Exploration
**Priority:** Must Have

Users must be able to inspect resistance information associated with selected geographic areas.

### F4 — Potential Hotspot Identification
**Priority:** Must Have

The platform must identify potential hotspots using a documented and approved methodology.

### F5 — Data Source Context
**Priority:** Must Have

The platform must provide information about the source and context of displayed data.

### F6 — Public Explanation Layer
**Priority:** Should Have

The platform should explain AMR-related information in language that can be understood by non-specialist users.

### F7 — Advanced Analysis
**Priority:** Should Have

Advanced analysis capabilities may be considered where supported by the available data and approved requirements.

---

## 7. BUSINESS RULES

**BR1:** Production data must come from an approved and documented source.

**BR2:** Displayed production data must retain appropriate attribution.

**BR3:** A hotspot is a visual flag based on a documented methodology and must not automatically be interpreted as a confirmed outbreak.

**BR4:** Straina must not provide individual treatment recommendations.

**BR5:** Unavailable data must be explicitly represented. Missing data must not be interpreted as zero.

---

## 8. ACCOUNTS AND SIGN-IN

No accounts or sign-in are required for version 1.

The core Straina experience should be publicly accessible.

The following are therefore not applicable to version 1:

- User registration
- Login
- Password reset
- User profiles

Future account functionality may be considered if required.

---

## 9. USER FLOWS

### Flow 1 — Explore AMR Map

1. User opens Straina.
2. User sees the AMR map.
3. User explores geographic information.
4. User selects an area.
5. Straina displays available information for the selected area.
6. User returns to the map.

### Flow 2 — Explore Changes Over Time

1. User opens the map.
2. User selects a time period.
3. Straina updates the displayed information.
4. User compares available information across periods.
5. Straina displays a no-data state where information is unavailable.

### Flow 3 — Explore Potential Hotspots

1. User opens the map.
2. User enables or views the potential hotspot layer.
3. Straina highlights areas meeting the defined hotspot criteria.
4. User selects a highlighted area.
5. Straina displays the available supporting information and context.

---

## 10. SCREEN INVENTORY

### S1 — Home / Map

The primary entry point to Straina.

Should contain:

- Interactive map
- Map legend
- Context/explanation
- Map controls
- Access to source information

### S2 — Map Exploration

Allows users to explore:

- Time periods
- Geographic areas
- Resistance information
- Potential hotspots

### S3 — Location Detail

Displays information relating to a selected geographic area, including:

- Selected area
- Relevant time period
- Resistance information
- Potential hotspot status
- Data source and context

### S4 — Data Sources / About

Should explain:

- What Straina is
- What antimicrobial resistance means
- Data sources
- Geographic coverage
- Temporal coverage
- Update information
- Data limitations
- That Straina is not a diagnostic or treatment platform

### M1 — No-Data / Error States

The application should provide appropriate states when data is unavailable or cannot be loaded.

---

## 11. DATA REQUIREMENTS

Straina requires real, authoritative AMR surveillance data for the production experience.

Fabricated AMR data must not be presented as real information.

### 11.1 AMR Observation

The exact fields will depend on the selected data source, but may include:

- Observation ID
- Location
- Time period
- Pathogen
- Antimicrobial
- Resistance measurement
- Source
- Update date

### 11.2 Data Source

The data-source information may include:

- Source ID
- Source name
- Source URL
- Geographic coverage
- Temporal coverage
- Last updated date

### 11.3 Candidate Data Sources

Potential sources include:

- WHO GLASS
- South Africa NICD

These are candidate sources only and are **not yet confirmed as the final production data source**.

The final source must be evaluated for:

- Availability
- Geographic coverage
- Temporal coverage
- Licensing
- API or download availability
- Suitability for visualization

Synthetic data may be used during development and testing, but it must be clearly labelled as test-only data.

---

## 12. TECHNICAL REQUIREMENTS

### 12.1 Current Technology

The current repository uses:

- React
- TypeScript
- Vite
- React DOM
- Vitest

### 12.2 Repository Status

The current repository is a reference point for the project and is **not yet the final MVP source of truth**.

### 12.3 High-Level Architecture

```text
User
  ↓
React Web Application
  ↓
Data / API Layer
  ↓
Authoritative AMR Data Source
```

The following remain **TBD**:

- Backend
- Database
- Map provider
- Final data/API architecture

### 12.4 Environment Variables

Potential environment variables may include:

```text
VITE_MAP_PROVIDER_KEY
VITE_DATA_API_URL
DATA_SOURCE_API_KEY
DATABASE_URL
```

These are placeholders only until the final architecture is confirmed.

Secret credentials must never be committed to the repository or exposed in client-side code.

---

## 13. SECURITY

Straina should:

- Protect server-side credentials.
- Validate external data before use.
- Restrict data-management operations.
- Avoid patient-identifiable information.
- Apply appropriate server/database-side write permissions.

---

## 14. PRIVACY

Version 1 does not require accounts or user profiles.

The platform should minimise the collection of personal information.

Straina should not contain patient-identifiable information.

If personal-data features are introduced in the future, they must undergo appropriate privacy review.

POPIA and other applicable legal/privacy requirements must be reviewed if personal information is introduced.

---

## 15. ACCESSIBILITY

Straina should support:

- Keyboard navigation
- Readable text
- Meaningful labels
- Sufficient colour contrast
- Information that is not communicated through colour alone
- Responsive layouts

The exact accessibility target or WCAG level is **TBD**.

---

## 16. ERROR STATES

### No Internet Connection

> You appear to be offline. Please check your connection and try again.

### No Data

> No data are available for this selection.

### Server / Data Error

> We couldn't load the latest data. Please try again.

### Unknown Error

> Something went wrong. Please try again.

### Insufficient Hotspot Data

> There is not enough data to identify a potential hotspot here.

### Permission Error

> You don't have permission to view this information.

---

## 17. QUALITY REQUIREMENTS

Straina should:

- Be responsive across supported web devices.
- Provide loading, empty, and error states.
- Avoid misleading visualisations.
- Provide data-source context.
- Avoid unnecessary downloads.
- Use clear explanations.
- Treat missing data as missing rather than zero.
- Protect credentials.
- Support agreed browsers and devices.

---

## 18. DESIGN DIRECTION

The final design system has not yet been established.

The following remain **TBD**:

- Primary colour
- Secondary colour
- Accent colour
- Typography
- Font sizes
- Spacing system
- Border radius
- Shadows
- Icons
- Dark mode
- Map style
- Accessibility target

---

## 19. CONTENT RULES

Straina content should:

- Use clear language.
- Distinguish surveillance information from interpretation.
- Show relevant sources, dates, and geographic/temporal coverage.
- Never describe a potential hotspot as a confirmed outbreak without authoritative evidence.
- Never provide treatment recommendations.
- Never present synthetic data as real surveillance data.

---

## 20. SUCCESS METRICS

### 20.1 Usability

Users should be able to:

- Open the map.
- Find a geographic area.
- Change the time period.
- Inspect resistance information.
- Understand the map legend.
- Find the data source.

### 20.2 Data Transparency

Users should be able to identify:

- Data source
- Time period
- Geographic coverage

### 20.3 Technical Quality

The application should demonstrate:

- Passing user stories and acceptance criteria.
- No critical application errors.
- Consistent hotspot logic.
- Appropriate missing-data states.

### 20.4 User Understanding

Users should understand:

- What Straina does.
- What the displayed AMR information represents.
- What a potential hotspot means.
- What Straina does not claim.

---

## 21. RISKS

### Risk 1 — Data Availability

**Risk:** Suitable real AMR data may not be available in the required format.

**Mitigation:** Evaluate authoritative sources before implementation.

### Risk 2 — Data Licensing

**Risk:** Data may have restrictions on use or redistribution.

**Mitigation:** Confirm licensing and permitted usage before production implementation.

### Risk 3 — Misinterpretation

**Risk:** Users may interpret potential hotspots as confirmed outbreaks or medical advice.

**Mitigation:** Use clear terminology, explanations, source information, and limitations.

### Risk 4 — Data Quality

**Risk:** Surveillance datasets may contain missing, incomplete, or inconsistent information.

**Mitigation:** Validate data and clearly communicate missing information.

### Risk 5 — Map Complexity

**Risk:** Too much information may make the map difficult to understand.

**Mitigation:** Use clear legends, filters, and progressive information display.

---

## 22. ASSUMPTIONS

The current project assumes that:

1. Authoritative AMR data can be legally accessed.
2. Sufficient geographic and temporal detail will be available.
3. Potential hotspots can be defined using an appropriate methodology.
4. Users will be able to understand the map-based experience.
5. The selected data will technically support the planned functionality.

These assumptions must be validated during development.

---

## 23. OPEN QUESTIONS

**OQ1:** What will be the first authoritative dataset/API?

**OQ2:** What methodology will be used to define a potential hotspot?

**OQ3:** Which map provider will be used?

**OQ4:** What backend/database architecture will be used?

**OQ5:** What visual design system will be used?

**OQ6:** What geographic resolution will be supported?

**OQ7:** Which browsers and devices must be supported?

**OQ8:** What accessibility standard will be targeted?

**OQ9:** What legal and privacy requirements apply to public access and the selected datasets?

---

## 24. MILESTONES

### M0 — Idea Submitted
**Status:** Original link not provided.

### M1 — PRD Approved
**Status:** Draft / In Review.

### M2 — Design Ready
**Status:** TBD.

### M3 — Build Plan Ready
**Status:** TBD.

### M4 — MVP Built
**Status:** TBD.

### M5 — Tested / Demo Ready
**Status:** TBD.

---

## 25. MVP DEFINITION

The Straina MVP will be a web application that:

- Displays real AMR surveillance data.
- Provides a geographic map.
- Allows time-based exploration.
- Allows inspection of resistance patterns.
- Identifies potential hotspots using an approved methodology.
- Provides source information.
- Clearly communicates limitations.
- Does not require registration.
- Does not provide individual diagnosis or treatment recommendations.

---

## 26. DEMO FLOW

The proposed demonstration flow is:

1. Open Straina.
2. Introduce the AMR problem.
3. Show the AMR map.
4. Explain the map legend.
5. Select a geographic area.
6. Show the resistance information.
7. Change the time period.
8. Demonstrate changes over time.
9. Enable or demonstrate the potential hotspot layer.
10. Select a potential hotspot.
11. Show the supporting source information.
12. Explain the limitations and non-diagnostic purpose of Straina.

---

## 27. AI DEVELOPMENT RULES

The PRD is the source of truth for implementation.

AI development tools must not:

- Invent features.
- Invent data.
- Invent business rules.
- Invent user roles.
- Invent APIs.
- Create fake AMR records and present them as real.
- Assume unresolved requirements.

When information is missing or ambiguous, clarification should be requested before implementation.

Acceptance criteria must be preserved and tested.

---

## 28. SUBMISSION CHECKLIST

Before the project is considered complete, confirm:

- [ ] Product name and description
- [ ] Primary and secondary users
- [ ] Problem statement
- [ ] Goals
- [ ] User stories
- [ ] Acceptance criteria
- [ ] Features
- [ ] Business rules
- [ ] User flows
- [ ] Screen inventory
- [ ] Data requirements
- [ ] Technical requirements
- [ ] Security requirements
- [ ] Privacy requirements
- [ ] Accessibility requirements
- [ ] Risks
- [ ] Open questions
- [ ] Authoritative data source
- [ ] Data licensing
- [ ] Hotspot methodology
- [ ] Map provider
- [ ] Backend
- [ ] Design system
- [ ] MASTER.md
- [ ] MVP
- [ ] Testing
- [ ] Demo

---

## 29. CURRENT PRD STATUS

**Status:** Draft / In Review

The following items remain unresolved:

- Original app idea link
- Final authoritative data source
- Hotspot methodology
- Map provider
- Backend/database
- Design system
- Accessibility target
- Browser/device support

These items must be resolved before the PRD can be considered fully approved.