# Fenmo Expense Tracker

A minimal, professional, full-stack Expense Tracker built for robustness and usability under real-world network conditions.

## Project Setup

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

## Key Design Decisions
1. **Zero-Auth User Isolation**: Instead of a heavy JWT/database authentication layout, the frontend automatically generates a robust `uuidv4` Browser Fingerprint stored in `localStorage`. This is intercepted by Axios and injected into HTTP Headers, allowing the backend to perfectly isolate users seamlessly without a login screen.
2. **Idempotency for Unreliable Networks**: Real network failures happen. The frontend maps a unique UUID to every raw form submission. If the server delays or the user rapidly clicks "Submit" multiple times, the backend checks the keys. It will either fully process the first request or silently return 200 (Success) with the cached record on subsequent identical hits.
3. **onBlur Form Validation Lifecycle**: Nobody likes a form yelling red errors while they are actively typing. UI Validation only checks on `onBlur` (clicking away physically) and forcefully clears away errors dynamically `onChange`.
4. **100vh Sticky Viewport Architecture**: The entire Dashboard is built tightly into a unified `h-screen`. Traditional websites pile data downwards arbitrarily off-screen. Here, only the target table records horizontally scroll using `flex-1 overflow-y-auto` while preserving navigational context.

## Persistence Mechanism Choice
For this minimal assessment, I selected an **In-Memory Store (Array)** wrapped securely inside a singleton `ExpenseService` class structure inside the backend.
  - **Reasoning**: It meets the requirements beautifully while keeping the codebase lightweight and immediately runnable via `npm run dev` without requiring testers to configure remote Postgres/MongoDB URLs or local SQLite bindings. The `ExpenseService` perfectly mirrors real database operations via array filters/find indexes, meaning swapping it for a real DB later requires exactly zero architectural changes to the API Controllers or Routes.

## Trade-Offs Made Due to Time Constraints
1. **Automated Testing Suite**: Setting up a full test-runner (e.g., Jest + Supertest for backend E2E, Vitest for React Components) takes a fair amount of boilerplate configuration. While production systems demand these, manual QA and strict TS compilations were leaned on for speed.
2. **True Database Persistence**: Restarting the backend server drops all the records. Hooking into a Postgres layer via Prisma or simply saving to a `.json` file would take an extra 15 minutes, but the in-memory array provided instant execution value immediately for evaluation.

## What Was Intentionally Omitted
1. **"Total by Category" Sub-View**: The brief listed this as an optional nice-to-have. To ensure absolute pristine polishing on the main requirements (perfect grid boundaries, flawless date validations, smooth network idempotency behaviors), I omitted this sub-feature to aggressively focus on the core layout constraints given later on.
2. **Edit and Delete Methods**: While fundamental to a full CRUD application, the assignment purely specified *viewing* lists and *creating* new entries. The API controllers explicitly do not define `PUT` or `DELETE` verbs to stay tightly mapped to the assignment constraints without over-engineering logic that wasn't asked for.
