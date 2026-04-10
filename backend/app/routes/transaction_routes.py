from fastapi import APIRouter, Body
from app.config.db import db
from app.schemas.transaction import TransactionCreate, TransactionResponse
from fastapi.encoders import jsonable_encoder
from datetime import datetime

router = APIRouter()

@router.post("/transactions", response_model=TransactionResponse)
async def add_transaction(transaction: TransactionCreate = Body(...)):
    transaction_dict = jsonable_encoder(transaction)
    transaction_dict["date"] = datetime.utcnow()
    new_transaction = await db.transactions.insert_one(transaction_dict)
    created_transaction = await db.transactions.find_one({"_id": new_transaction.inserted_id})
    return TransactionResponse(id=str(created_transaction["_id"]), **created_transaction)
