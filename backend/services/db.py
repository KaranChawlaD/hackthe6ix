from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client["sports_insights"]
test_collection = db["test_data"]

def test_insert_document():
    doc = {"message": "Hello from FastAPI"}
    result = test_collection.insert_one(doc)
    return str(result.inserted_id)

def test_read_documents():
    return list(test_collection.find())
