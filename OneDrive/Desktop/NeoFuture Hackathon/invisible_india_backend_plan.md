# Invisible India - Backend MVP Execution Plan

## Stack

-   Backend: FastAPI (Python)
-   Database: MongoDB Atlas
-   ML: XGBoost (later, simulate first)

------------------------------------------------------------------------

## MVP Goal

Register → Save Profile → Generate Score → Show Schemes

------------------------------------------------------------------------

## Phase 1: Setup

### Install Dependencies

pip install fastapi uvicorn motor pydantic python-dotenv

### Project Structure

app/ ├── main.py ├── config/db.py ├── models/ ├── schemas/ ├── routes/
├── services/ └── utils/

------------------------------------------------------------------------

## Phase 2: Core Schemas

### User

-   fullName
-   phone
-   aadhaarNumber
-   state
-   district
-   primaryWorkType

### Transactions

-   userId
-   amount
-   type (credit/debit)
-   date

### Trust Score

-   userId
-   score (0-100)
-   breakdown

### Schemes

-   userId
-   eligible schemes

------------------------------------------------------------------------

## Phase 3: APIs

### Auth & User

POST /api/register POST /api/profile

### Data

POST /api/transactions (mock data)

### Intelligence

POST /api/score/calculate GET /api/score/{userId}

POST /api/schemes/match GET /api/schemes/{userId}

------------------------------------------------------------------------

## Phase 4: Core Logic

### Score Calculation (Mock AI)

score = (income \* 0.4) + (location \* 0.25) + (peer \* 0.2) + (trend \*
0.15)

### Scheme Matching

-   Score \> 70 → Loan
-   Score \> 50 → Bank Account
-   Score \> 60 → Insurance

------------------------------------------------------------------------

## Phase 5: Demo Flow

1.  Register User
2.  Add mock transactions
3.  Generate score
4.  Show schemes

------------------------------------------------------------------------

## Notes

-   Simulate Aadhaar, DigiLocker, AA APIs
-   Focus on working flow, not perfection
-   Store computed score in DB

------------------------------------------------------------------------

## Pitch Line

"We use alternative data to create a trust score for informal workers
and unlock access to financial services."
