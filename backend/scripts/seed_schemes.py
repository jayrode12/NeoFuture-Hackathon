import json
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = "invisible_india"

async def seed_schemes():
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]
    
    # Path to the schemes dataset
    json_path = os.path.join(os.path.dirname(__file__), "..", "app", "markdown", "schemes_dataset.json")
    
    try:
        with open(json_path, "r") as f:
            schemes_data = json.load(f)
        
        # Clear existing schemes
        await db.schemes.delete_many({})
        
        # Insert new schemes
        if schemes_data:
            result = await db.schemes.insert_many(schemes_data)
            print(f"Successfully seeded {len(result.inserted_ids)} schemes into the database.")
        else:
            print("No schemes found in the JSON file.")
            
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(seed_schemes())
