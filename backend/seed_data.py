import asyncio
import json
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "Neo_Future")

async def seed_schemes():
    print(f"Connecting to database: {DATABASE_NAME}...")
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]
    
    # Path to your dataset
    dataset_path = os.path.join(os.path.dirname(__file__), "app", "markdown", "schemes_dataset.json")
    print(f"Looking for dataset at: {dataset_path}")
    
    if not os.path.exists(dataset_path):
        print(f"CRITICAL ERROR: Could not find dataset at {dataset_path}")
        return

    try:
        with open(dataset_path, "r") as f:
            schemes = json.load(f)

        if not schemes:
            print("No schemes found in the JSON file.")
            return

        print(f"Found {len(schemes)} schemes. Uploading...")
        
        # Clear existing schemes to avoid duplicates if you want fresh data
        await db.schemes.delete_many({})
        
        # Insert new schemes
        result = await db.schemes.insert_many(schemes)
        print(f"SUCCESS: Seeded {len(result.inserted_ids)} schemes into 'schemes' collection!")
    except Exception as e:
        print(f"UPLOAD FAILED: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(seed_schemes())
