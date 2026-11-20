# Straina – Test Plan

## 1. Purpose

This document describes the testing strategy for Straina, an antimicrobial resistance (AMR) observation platform. It covers automated testing, component testing, integration testing, application access control and Supabase Row Level Security (RLS).

The objective is to verify that the application behaves as expected and that users can only perform actions permitted by their assigned roles.

## 2. Testing Environment

| Area | Technology |
|---|---|
| Frontend | React, TypeScript and Vite |
| Backend and database | Supabase and PostgreSQL |
| Authentication | Supabase Auth |
| Automated testing | Vitest |
| Component testing | React Testing Library |
| Deployment | Vercel |
| Version control | GitHub |

## 3. Testing Strategy

### 3.1 Unit Testing

Unit tests verify individual functions and logic independently.

Testing includes:
- Validation of observation data.
- Required field validation.
- Numeric input validation.
- Date and coordinate validation.
- API function behaviour.

### 3.2 Component Testing

Component tests verify that individual user interface components behave correctly.

Testing includes:
- Form rendering.
- Required field validation.
- Invalid numeric values.
- Submission behaviour.
- User feedback after submission.

### 3.3 Integration Testing

Integration tests verify how application components interact with services such as Supabase.

Testing includes:
- Supabase client query behaviour.
- Handling simulated database errors.
- API request and response handling.

**Testing limitation:** The tests in `tests/integration/schema.test.ts` use a mocked Supabase client. They verify client-side behaviour and simulated error handling; they are not proof of live database RLS enforcement.

### 3.4 Security Testing

Security testing focuses on authentication, authorisation and database access restrictions.

The application uses the following roles:

| Role | Expected access |
|---|---|
| Public visitor | Public pages and observation exploration |
| Analyst | Public pages and permitted analytical features |
| Data Submitter | Public pages and observation submission |
| Admin | Administrative features and authorised data management |

Security checks include:
- Unauthenticated users must not access protected functionality.
- Analysts must not access administrator-only pages.
- Data submitters must not modify records created by other users.
- New users must not be able to assign themselves administrator privileges.
- Database policies must restrict insert, update and delete operations according to user roles.

## 4. Automated Test Results

The following results were recorded during development:

| Check | Result |
|---|---|
| Full automated test suite | PASS – 95 tests across 18 files |
| Submit Record component tests | PASS – 5 tests |
| Schema integration tests | PASS – 2 tests |
| ESLint | PASS |
| Production build | PASS |

The schema integration tests were renamed to make their mocked nature explicit.

Test suite: `Mocked Supabase Client Contracts`

The tests cover:
- Mocked queries against public tables.
- Handling of a simulated RLS error response (`42501`).

## 5. Submit Record Screen Testing

The Submit Record screen was implemented under Issue #68.

The component includes:
- Required field validation.
- Numeric validation, including rejection of negative values.
- Coordinate validation.
- Date validation.
- Submission through the observation API.
- Success feedback and navigation after submission.

The five component tests passed during development.

The implementation was submitted for review in Pull Request #82. Live production testing of the completed screen remains dependent on that pull request being merged and deployed.

## 6. Role-Based Access Testing

The following checks were performed against the deployed Straina application.

| Test | Expected result | Actual result | Status |
|---|---|---|---|
| Public visitor opens the home page | Public page loads | Home page loaded | PASS |
| Data Submitter signs in | Correct role is displayed | Data Submitter role displayed | PASS |
| Analyst signs in | Correct role is displayed | Analyst role displayed | PASS |
| Analyst opens `/admin/users` | Access denied | Access Denied page displayed | PASS |
| Analyst accesses administrator-only functionality | Access restricted | Administrator page access was denied | PASS |

**Evidence:** The deployed application displayed the Analyst role badge and an Access Denied message when the Analyst account attempted to open `/admin/users`.

These results verify application-level route protection. They do not independently establish database-level RLS enforcement.

## 7. Supabase Row Level Security Verification

The production Supabase database was inspected using the SQL Editor.

The `pg_policies` system view was queried for the following tables:
- `profiles`
- `amr_observations`
- `data_sources`

The inspection returned 14 policies.

The policy definitions and security migration were reviewed to establish the intended access restrictions.

### 7.1 Expected Database Security Rules

| Database operation | Expected restriction |
|---|---|
| Public observation reads | Permitted according to the public SELECT policy |
| Observation inserts | Restricted to authorised authenticated roles |
| Observation updates | Restricted to authorised users and record ownership rules |
| Observation deletes | Restricted to authorised users and record ownership rules |
| Data source management | Restricted to administrators |
| Profile access | Restricted according to user identity and administrator permissions |

The security migration also hardens the `current_user_role()` function and ensures that new user profiles receive the default `analyst` role rather than a role supplied through user metadata.

### 7.2 RLS Verification Status

| RLS test | Expected result | Status |
|---|---|---|
| Unauthenticated visitor attempts to insert an observation | Database rejects the insert | NOT YET VERIFIED |
| Unauthenticated visitor attempts to update an observation | Database rejects the update | NOT YET VERIFIED |
| Data Submitter attempts to update another user's observation | Database rejects the update | NOT YET VERIFIED |
| New user attempts to register with administrator role metadata | User receives the default Analyst role | Migration reviewed; live signup test pending |
| Database policies inspected in Supabase | Policies and role restrictions are present | PASS – policy inspection completed |

**Important:** The policy inspection confirms that policies are configured in the production database. It does not replace runtime tests using actual user sessions. The outstanding RLS tests must not be treated as passed until they have been executed against the database.

## 8. Outstanding Verification

The following checks remain outstanding:

1. Perform an unauthenticated insert and update attempt against the production database.
2. Attempt to update an observation created by another user using a Data Submitter account.
3. Register a new account while supplying administrator role metadata and verify that the resulting role is Analyst.
4. Complete live Submit Record testing after Pull Request #82 is merged and deployed.

The deployed Submit Record and Records List routes were still displaying placeholders during testing, so these application workflows could not yet be fully verified in production.

## 9. Conclusion

The Straina application has undergone automated, component, integration and role-based access testing during development.

The automated test results, lint checks and production build completed successfully. The deployed application also demonstrated that an Analyst account is prevented from accessing the administrator-only users page.

The production Supabase policies were inspected and the security migration was reviewed. However, the outstanding runtime RLS tests remain documented as pending rather than being reported as successful.

Further verification is required to confirm database-level enforcement of all security requirements and to complete production testing of the Submit Record workflow after deployment.