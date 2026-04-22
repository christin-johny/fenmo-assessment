# Fenmo Expense Tracker

## Summary

This application implements a minimal full-stack expense tracker focusing on:

* Reliable expense creation using idempotency
* Clean and maintainable backend architecture
* Responsive UI with proper validation and error handling
* Correct filtering, sorting, and total calculation

The system is designed to behave correctly under real-world conditions such as duplicate submissions and unreliable network responses.

## Key Highlights

* Idempotent API design to prevent duplicate expense creation
* Clean separation of concerns (routes, controllers, services)
* Zod-based request validation and global error handling
* OnBlur form validation for better user experience
* Proper handling of loading, error, and empty states

## Design Focus

This project prioritizes:

* Correctness over feature expansion
* Real-world reliability (handling retries and duplicate submissions)
* Clean and maintainable code structure

---

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
- **The Choice**: This was deliberately chosen over configuring a local SQLite instance or remote PostgreSQL wrapper so the application could be tested instantly via `npm run dev` without installing global database dependencies. 
- **Adaptability**: The architecture handles this memory array entirely within the encapsulated `ExpenseService`. Swapping this out for a persistent ORM later would require zero refactoring of the API Controllers or Routes.

### 2. Backend Implementation (`/expenses`)
- **`POST` Creating Expenses**: Expects JSON containing `amount`, `category`, `description`, and `date`. It features strict Zod validation denying future dates and negative amounts.
- **`GET` Fetching Expenses**: Supports optional query parameters (`category`, `startDate`, `endDate`, and multi-directional `sort`). The backend calculates global mathematical totals and category breakdowns *before* slicing the array, ensuring accurate calculations on the frontend.

### 3. Real-World Resilience (Idempotency)
- **Problem**: Users clicking "Submit" multiple times on slow connections can result in duplicate server records.
- **Solution**: The React client generates a unique UUID `idempotencyKey` per form instance. The Backend parses this key against historical submissions. If it detects a match, it gracefully returns a `200 Success` with the previously logged record, safely neutralizing network-failure duplicates.

---

## Optional Enhancements

In addition to core requirements, a few optional enhancements were explored:

### Lightweight User Isolation
A lightweight browser-based identifier was added to simulate user-level data isolation without implementing full authentication. This was not required for the assignment but demonstrates how the system could scale to multi-user environments.

### Advanced Pagination & Analytics
Pagination rules and explicit total breakdown statistics (e.g., total spent per category) are calculated on the backend data strictly before the pagination limits are applied. This approach ensures accurate calculations are passed to a dynamic frontend UI summary.

---

## Key Design Decisions & Trade-Offs

### Key Design Decisions
1. **OnBlur Validation Lifecycle**: The `ExpenseForm` validates inputs when the user clicks away (`onBlur`) or hits Submit, resulting in a cleaner user experience compared to aggressive `onChange` error throwing.
2. **Compact 100vh UI**: The Dashboard is constrained to the viewport height (`100vh`). Only the native `ExpenseList` container scrolls vertically, keeping the submit form and analytics accessible globally.

### Trade-Offs Made Because of the Timebox
1. **Automated Testing Suite**: Configuring virtual mock environments for E2E test runners (e.g., Jest, Supertest) was traded for strict manual QA and enforcing rigid `noEmit` TypeScript Compilation checks (`tsc`) to ensure structural typing safety.
2. **JSON Disk Persistence**: Utilizing `fs.readFileSync` allows mock-memory arrays to persist permanently across server restarts. This logic was omitted to maximize focus on the rigorous frontend Validation schema and Idempotency keys.

### What Was Intentionally Omitted
1. **Edit / Delete Protocols**: While standard in CRUD layouts, the assignment explicitly dictated core creation and viewing operations. Maintaining strict API boundaries around these creation mechanics prevents unnecessary complexity that falls outside the assessment scope.
