# RecoHub ML API

Python-based ML API using FastAPI for recommendation algorithms.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your MongoDB URI
```

3. Run the server:
```bash
python main.py
# or
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`
