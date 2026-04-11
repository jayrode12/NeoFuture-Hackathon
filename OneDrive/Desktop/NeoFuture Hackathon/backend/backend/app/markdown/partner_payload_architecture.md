# Partner Data Payload & Architecture Document

This document outlines the entire data flow across the **Partner Management Portal** in the Invisible India application. It specifies what data is accessed, where it is used, how payloads are transferred between React routes (e.g. via `useLocation` state vs isolated `useEffect` fetches), and the expected backend schema structure per page.

---

## 1. Authentication & Context Flow
### Provider: `AuthContext` (`src/context/AuthContext.jsx`)
*   **Where it's used:** Wrapped around the entire app, but accessed via the `useAuth()` hook in all Partner routes.
*   **Payload Shape:**
    ```javascript
    {
       user: {
          username: "admin_user",   // For partners, 'username' is used over 'email'
          role: "partner",          // Enforces protected route logic in App.jsx
          name: "Acme Partner Corp" // Displayed automatically in Dashboard header
       },
       isAuthenticated: boolean,
       login: (username, password) => void,
       logout: () => void
    }
    ```
*   **Flow:** When `login()` resolves via API, it populates `user`, triggering a `navigate('/partner/dashboard')`.

---

## 2. Partner Dashboard (`/partner/dashboard`)
*   **State / Payloads:**
    *   Currently relies on local mock properties, but expected to hit a `/api/partner/metrics` endpoint.
*   **Expected API Payload:**
    ```json
    {
      "metrics": {
         "totalWorkers": 12482,
         "growthRate": 12,
         "averageScore": 84.2,
         "pendingApplications": 894,
         "approvalRate": 94
      },
      "recentApplications": [
         { 
           "id": "APP-001",
           "name": "Elena Rodriguez", 
           "role": "Logistics Layout", 
           "time": "2h ago", 
           "status": "Pending", 
           "colorTheme": "emerald" 
         }
      ]
    }
    ```
*   **How it works:** Re-renders using the `AuthContext` to get the Partner Name. Currently mocks local variables instead of `useEffect`.

---

## 3. Worker Management (`/partner/workers`)
*   **State / Payloads:**
    *   Holds an internal array `const [workers]`.
*   **Data Structure (Row Output):**
    ```javascript
    { 
       id: 'W98212', 
       name: 'Arjun M.', 
       type: 'Formworker', 
       score: 742, 
       status: 'Vetted', 
       onboarded: 'Oct 12' 
    }
    ```
*   **Navigation Flow:**
    *   When the "Eye View" icon is clicked, it routes to `/partner/workers/:id`.
    *   **Note:** React Router picks up this ID dynamically via `useParams()`. In a live setting, it sends the `id` to the backend.

---

## 4. Worker Deep View (`/partner/workers/:id`)
*   **State / Payloads:**
    *   Uses `useParams().id` to fetch the specific string path identifier.
*   **Expected API Payload (`GET /api/workers/{id}`):**
    ```json
    {
       "worker_id": "W98212",
       "kyc_status": "Aadhaar Verified",
       "trust_score": 742,
       "regional_hub": "Navi Mumbai, MH",
       "skill_certifications": ["L3 Concrete Mapping", "OSHA Basic"],
       "history": [
         { "job_id": "J1011", "employer": "L&T Struct", "duration": "4 months", "rating": 4.8 }
       ]
    }
    ```
*   **How it works:** Extrapolates detailed demographic charts based exclusively off this fetched payload.

---

## 5. Application Management (`/partner/applications`)
*   **State / Payloads:**
    *   Maintains the `[applications]` array containing pending / approved applications from workers.
*   **List Data Structure:**
    ```javascript
    { 
       id: 'APP-9921', 
       worker: 'Ramesh Kumar', 
       scheme: 'PM Vishwakarma', 
       date: 'Oct 24, 2024', 
       status: 'Approved',
       urgency: 'Low' 
    }
    ```
*   **State Passing Mechanism (Crucial!):**
    *   When a partner clicks 'View', the `<Link>` component fires to `/partner/applications/:id`.
    *   **Payload Sent:** We use `state={{ status: app.status }}` embedded into the Router Link. This passes the memory state forward without needing the API to fetch basic metadata again immediately.

---

## 6. Application Deep View (`/partner/applications/:id`)
*   **State / Payloads:**
    *   Retrieves deep view via `const { id } = useParams()`.
    *   Retrieves list-level status via `const location = useLocation(); const passedStatus = location.state?.status`.
*   **State Mutations:**
    *   `[appStatus, setAppStatus] = useState(passedStatus);`
    *   If a partner manually clicks **"Approve Application"**, the state fires `setAppStatus('Approved')`.
    *   Once `'Approved'`, the approval/rejection action card **collapses entirely** and renders a success UI component preventing duplicate payload transactions to the server.
*   **Expected API Submissions (`POST` request on buttons):**
    ```json
    {
       "application_id": "APP-9921",
       "action": "APPROVED",
       "timestamp": "2024-10-24T10:00:00Z",
       "approver_id": "admin_user"
    }
    ```

---

## 7. Scheme Control (`/partner/schemes`)
*   **State / Payloads:**
    *   `const [schemes, setSchemes]` manages the active grid of published institutions.
    *   `const [formData, setFormData]` holds the temporary Creation payload structure.
*   **Creation Payload (`POST /api/partner/schemes/create`)**:
    ```javascript
    {
       title: formData.title,         // String: e.g. "Housing Grant"
       minScore: formData.minScore,   // Number: e.g. 750 (Automated Trust Threshold)
       sector: formData.sector,       // String: "Construction", "Logistics", etc.
       description: formData.description // String
    }
    ```
*   **How it works:** When submitted, the form object is mapped onto the local `schemes` array instantly simulating a database addition, clearing the form data automatically.

---

## 8. Analytics Engine (`/partner/analytics`)
*   **State / Payloads:**
    *   Currently relies on hard-mapped arrays traversing component variables.
*   **Chart Generation Pipeline:**
    *   The `Scheme Funnel` chart maps over an array of historical node metrics: `[20, 35, 45, 30, 60, 80...]`.
    *   React uses inline variable interpolation syntax `style={{ height: \`\${h}%\` }}` to generate pure CSS structures from these integer payloads.
*   **Expected API Payload (`GET /api/partner/analytics/funnel`)**:
    ```json
    {
      "time_series": [
        {"quarter": "Q1 2024", "completion_rate": 20},
        {"quarter": "Q2 2024", "completion_rate": 35}
      ],
      "bottlenecks": {
         "verification_delay_days": 4,
         "underwriter_delay_days": 1
      }
    }
    ```
