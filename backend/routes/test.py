from fastapi import APIRouter
from services.db import test_insert_document, test_read_documents

router = APIRouter()

@router.get("/insert")
def insert():
    doc_id = test_insert_document()
    return {"inserted_id": doc_id}

@router.get("/read")
def read():
    docs = test_read_documents()
    for doc in docs:
        doc["_id"] = str(doc["_id"])
    return {"documents": docs}
