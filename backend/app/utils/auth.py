import jwt
import os
from fastapi import Request, HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.security import SECRET_KEY, ALGORITHM

security = HTTPBearer(auto_error=False)

async def get_current_user(request: Request, auth: HTTPAuthorizationCredentials = Security(security)):
    # 1. Try to get token from header
    token = None
    if auth:
        token = auth.credentials
    
    # 2. If not in header, try to get from cookie
    if not token:
        token = request.cookies.get("access_token")
    
    if not token or token == "undefined" or token == "null":
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        # Explicitly ensure we use the secret key from the environment/config
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token: missing subject")
        return email
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.PyJWTError as e:
        print(f"JWT Decode Error: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid token")
