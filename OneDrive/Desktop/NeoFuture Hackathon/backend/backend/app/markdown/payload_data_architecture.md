# Invisible India: Frontend Data Flow & Payload Architecture

This document tracks how data (payloads) moves across the React application, detailing exactly **what information is collected, where it is stored, and which components access it.** 

*Note: Since standard formatting is Markdown, you can simply right-click this document in your IDE (or use a browser extension) to "Export to PDF" if needed.*

---

## 1. Global State Management
The application avoids prop-drilling by keeping session-critical data inside a global React Context (`AuthContext`).

### `AuthContext.jsx`
- **Purpose:** Manages the user session.
- **Provider Location:** Wraps the entire `<App />` router so any protected page can access the data.
- **State Stored:**
  - `user` (Object): The current logged-in user profile.
  - `token` (String): The authentication string preventing redirects to `/login`.
- **Functions Used to Share Data:**
  - `login(userData, authToken)`: Sets the global state and saves them to `localStorage` to persist across refreshes.
  - `logout()`: Clears both state and `localStorage`.
- **Accessed By:** 
  - `App.jsx` (`ProtectedRoute` logic)
  - `MyApplications.jsx` (Dashboard user rendering)
  - `Header.jsx` (To show relevant buttons/logout logic)

---

## 2. Authentication & Registration Pages

### A. `Register.jsx` -> API Payload
- **Purpose:** Collects new worker data to create a profile.
- **Information Accessed Form:** User inputs & Voice Assistant transcription.
- **State:** Local component state `formData`.
- **Payload Sent to Backend (`authService.register`):**
  ```json
  {
    "fullName": "String",
    "email": "String",
    "phone": "String (10 digits)",
    "aadhaarNumber": "String (12 digits)",
    "state": "String",
    "district": "String",
    "primaryWorkType": "String (enum)",
    "password": "String"
  }
  ```
- **Next Step:** Navigates to `/verify-otp`.

### B. `VerifyOTP.jsx` -> API Payload
- **Purpose:** Secures the account via SMS code verification.
- **State:** React `useRef` array collecting 4 standalone digit inputs.
- **Expected Payload to Backend:**
  ```json
  {
    "otpCode": "String (4 digits)"
  }
  ```

### C. `Login.jsx` -> API Payload
- **Purpose:** Authenticates returning workers.
- **State:** Local `email` and `password`.
- **Payload Sent to Backend (`authService.login`):**
  ```json
  {
    "username": "String (Email or phone)",
    "password": "String"
  }
  ```
- **Expected Response:** An object containing the `access_token`. This token is pushed into the `AuthContext` to unlock the app.

---

## 3. Profile Building & Logic Pages

### A. `FinancialIdentity.jsx`
- **Purpose:** Builds the "Verified Employment Profile" (VEP).
- **Data Displayed:** Mock static data currently (UPI ID, Monthly income `₹18,500`, Location map).
- **Required Backend Payload (When integrated):**
  ```json
  {
    "workerId": "String",
    "workLocation": "String",
    "upiId": "String",
    "averageMonthlyIncome": "Number",
    "peerAttestationsCount": "Integer"
  }
  ```
- **Where Data Goes:** Clicking "Confirm & Submit" populates the `AuthContext` with a mock session (`mock-registration-token`) and redirects the user via URL parameter to the Dashboard.

---

## 4. Dashboard & Features

### A. `MyApplications.jsx` (Dashboard)
- **Data Accessed:** 
  1. `AuthContext`: Pulls the `user` object to greet the user.
  2. `URL Search Params`: Listens for `?success=profile_created`. If found, triggers the local boolean state `showSuccess` to render the green alert tag.
- **Application List Data structure (Mapped):**
  Information here dictates the list items:
  ```json
  [
    {
      "id": "app_1",
      "schemeName": "Mudra Loan - Shishu",
      "status": "Under Review",
      "appliedDate": "24 Oct 2023",
      "iconType": "account_balance"
    },
    { ... }
  ]
  ```

### B. `MatchedSchemes.jsx`
- **Data Accessed:** Context-aware data to cross reference the user's `trust score` and `primaryWorkType`.
- **Expected Payload from Backend (Scheme Matching Algo):**
  ```json
  [
    {
      "schemeId": "s1",
      "name": "Mudra Loan - Shishu",
      "type": "Loan",
      "provider": "Government",
      "amount": "Up to ₹50,000",
      "minScore": 45,
      "description": "Collateral-free loan for small businesses and vendors",
      "applyUrl": "https://www.mudra.org.in",
      "category": "Micro Loan"
    }

  ]
  ```

### C. `TrackApplication.jsx`
- **Data Accessed:** Needs to pull the specific timeline events of `ApplicationSent`.
- **Expected Payload:**
  ```json
  {
    "referenceId": "IV-99203-II",
    "currentStatus": "Partner Verification",
    "timeline": [
       { "step": "Application Submitted", "timestamp": "Oct 12, 2023", "completed": true },
       { "step": "Partner Verification", "estimatedCompletion": "Oct 15, 2023", "completed": false }
    ]
  }
  ```

---

## 5. Architectural Data Summary
1. **Creation:** Users inject data through local states mapped to `authService.jsx` REST modules.
2. **Storage:** The data turns into JSON tokens sent to `app.main` (Uvicorn backend). The frontend only holds onto the `token` validation key using **localStorage**.
3. **Usage:** Components rely on the React Router (`useLocation()` and `<Link state={{}}>`) to casually bridge basic flags, but use the `AuthContext` for strict authorization.
