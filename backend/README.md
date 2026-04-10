# Invisible India - Backend Implementation

The backend for **Invisible India** has been implemented using **FastAPI** and **MongoDB**. The architecture follows a modular structure to ensure scalability and ease of testing.

## 🏗️ Folder Structure

```text
backend/
├── app/
│   ├── main.py             # Entry point
│   ├── config/
│   │   └── db.py           # MongoDB connection
│   ├── models/             # DB Models (Pydantic)
│   ├── schemas/            # Request/Response validation
│   ├── routes/             # API Endpoints
│   ├── services/           # Business Logic (Score/Scheme matching)
│   └── utils/              # Common utilities
├── .env                    # Environment variables
└── requirements.txt        # Dependencies
```

## 🚀 Setup Instructions

1. **Install Dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Configure Database**:
   - Open `.env`.
   - Replace `<username>` and `<password>` with your **MongoDB Atlas** credentials.
   - Or replace the entire `MONGODB_URL` with your local/cluster connection string.

3. **Run the Server**:
   ```bash
   # From the 'backend' directory:
   python -m uvicorn app.main:app --reload
   ```
   The API will be available at [http://localhost:8000](http://localhost:8000).

## 📮 Postman Testing Guide

### 1. Register a User
- **Method**: `POST`
- **URL**: `http://localhost:8000/api/register`
- **Body** (JSON):
  ```json
  {
      "fullName": "Rajesh Kumar",
      "phone": "9876543210",
      "aadhaarNumber": "123456789012",
      "state": "Maharashtra",
      "district": "Mumbai",
      "primaryWorkType": "Construction Worker"
  }
  ```
- **Note**: Save the `id` from the response.

### 2. Add Transactions (Mock Data)
- **Method**: `POST`
- **URL**: `http://localhost:8000/api/transactions`
- **Body** (JSON):
  ```json
  {
      "userId": "<USER_ID_FROM_STEP_1>",
      "amount": 5000,
      "type": "credit"
  }
  ```

### 3. Calculate Trust Score
- **Method**: `POST`
- **URL**: `http://localhost:8000/api/score/calculate`
- **Body** (JSON):
  ```json
  {
      "userId": "<USER_ID_FROM_STEP_1>"
  }
  ```

### 4. Match Schemes
- **Method**: `POST`
- **URL**: `http://localhost:8000/api/schemes/match`
- **Body** (JSON):
  ```json
  {
      "userId": "<USER_ID_FROM_STEP_1>"
  }
  ```

### 5. Get Score/Schemes
- **GET** `http://localhost:8000/api/score/<USER_ID>`
- **GET** `http://localhost:8000/api/schemes/<USER_ID>`
