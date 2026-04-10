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
    
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
