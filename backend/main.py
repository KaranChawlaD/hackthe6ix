from fastapi import FastAPI, File, UploadFile, Response, status
from fastapi.middleware.cors import CORSMiddleware
from twelvelabs import TwelveLabs
from pathlib import Path
from google import genai
from dotenv import load_dotenv
import requests
import os
import shutil

app = FastAPI()

load_dotenv()

gem_client = genai.Client()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # replace with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    print("✅ Received video:", file.filename)
    client = TwelveLabs(api_key=os.getenv("TWELVE_LABS_API_KEY")) 

    # Step 2: Create index (you only need to do this once)
    # Get existing index
    existing_indexes = client.index.list()
    index = next((i for i in existing_indexes if i.name == "test-index"), None)

    if not index:
      index = client.index.create(name="test-index", models=[{"name": "pegasus1.2", "options": ["visual", "audio"]}, {"name": "marengo2.7","options": ["visual", "audio"],}])

    print(f"Created index: {index.name}")

    # Save uploaded file temporarily
    temp_file_path = f"temp_{file.filename}"
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Step 3: Analyze a video from a public URL
    task = client.task.create(index_id=index.id, file=open(temp_file_path, "rb"))
    print(f"Created task: {task.id}")
    task.wait_for_done(sleep_interval=5, callback=lambda t: print(f"  Status={t.status}"))

    if task.status != "ready":
        raise RuntimeError(f"Indexing failed with status {task.status}")

    print(f"Video ID: {task.video_id}")

    # Step 4: Generate text using prompt
    text_stream = client.analyze_stream(video_id=task.video_id, 
                                        prompt=Path('prompt_test.txt').read_text())
    for text in text_stream:
        print(text)

    summary = text_stream.aggregated_text
    os.remove(temp_file_path)

    gem_response = gem_client.models.generate_content(model = "gemini-2.5-flash", contents=f"{Path('gemini_prompt_test.txt').read_text()} + {summary}")
    print(gem_response.text)

    return {"summary": gem_response.text}
