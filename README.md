# Fenmo Expense Tracker

A production-grade, full-stack personal finance tool built to operate under real-world conditions (unreliable networks, duplicate submissions, and rapid user interactions).

## Quick Start

### Backend
```bash
cd backend
npm install
npm run dev
```
*The backend API will run on `http://localhost:5000`.*

### Frontend
```bash
cd frontend
npm install
npm run dev
```
*The React UI will run on `http://localhost:5173`.*

---

## Alignment with Core Requirements

### 1. Persistence Mechanism (In-Memory Store)
For this assessment, the backend utilizes an **In-Memory Store** (an internal static array inside `ExpenseService`). 
- **The Choice**: This was deliberately chosen over configuring a local SQLite instance or remote PostgreSQL wrapper to guarantee the evaluator could `npm run dev` and test the application instantly without installing global database dependencies or `.env` credential management. 
- **Adaptability**: The architecture handles this memory array entirely within the encapsulated `ExpenseService`. Swapping this out for a real persistent ORM later would require zero refactoring of the API Controllers, Routes, or Validations.

### 2. Backend Implementation (`/expenses`)
- **`POST` Creating Expenses**: Expects JSON containing `amount`, `category`, `description`, and `date`. It features strict **Zod validation** denying future dates and negative amounts.
- **`GET` Fetching Expenses**: Fully supports optional query parameters (`category`, `startDate`, `endDate`, and multi-directional `sort`). The backend calculates true global mathematical totals and category breakdowns *before* slicing the array for pagination, ensuring the UI accurately reflects pure data states.

### 3. Real-World Resilience (Idempotency)
- **Problem**: Users mash the "Submit" button on slow connections, commonly resulting in duplicate server records.
- **Solution**: The React client generates a unique UUID `idempotencyKey` per form instance. The Backend specifically parses this key against historical submissions. If it detects a match, it intercepts the duplicate creation entirely, returning a `200 Success` with the previously logged record footprint, neutralizing network-failure duplicates safely.

### 4. Zero-Auth User Isolation (Browser Fingerprinting)
To track historical functionality without building a highly scoped JWT login system, the frontend invisibly stamps a permanent footprint into `localStorage`. An Axios interceptor automatically injects an `X-User-Fingerprint` header into every outbound request. This guarantees that User A and User B (or an Incognito window) have perfectly isolated expense arrays on the backend without explicit passwords.

---

## Key Design Decisions & Trade-Offs

### Key Design Decisions
1. **OnBlur Validation Lifecycle**: Aggressive forms that shout red error text while you are actively typing ruin software UX. The `ExpenseForm` exclusively validates inputs only when the user physically clicks away (`onBlur`), or deliberately hits Submit.
2. **Compact 100vh UI**: The Dashboard is mathematically constrained to `h-screen`. The main vertical scrollbar was disabled. Instead, only the native `ExpenseList` container features an internal scrolling track. This keeps the submit form, analytics, and navigation headers rigidly accessible at all times without hunting for page tops.

### Trade-Offs Made Because of the Timebox
1. **Automated Testing Suite**: Full production deployments necessitate E2E test runners (e.g. Jest, Vitest, Supertest). Configuring clean virtual mock environments was traded for strict manual QA and enforcing rigid `noEmit` TypeScript Compilation checks (`tsc`) ensuring structural zero-fault typings.
2. **JSON Disk Persistence**: Utilizing `fs.readFileSync` allows mock-memory arrays to persist permanently across server `Ctrl+C` shutdowns. This logic was traded out to maximize time spent developing the rigorous frontend Validation schema and Idempotency keys.

### What Was Intentionally Omitted
1. **Edit / Delete Protocols**: While standard in extensive CRUD layouts, the assignment explicitly dictated core creation and viewing arrays. Implementing `PUT` and `DELETE` paths natively alongside global state-remapping would breach the scope of a tight personal assessment box. I maintained strict API boundaries exclusively handling what was requested.
