
# Formula: Deploying to Netlify

**Objective:** To provide a guide for deploying the LinkedIn Content Magician application to Netlify as an alternative to Vercel. This document covers the setup for the frontend application and the implementation of the RAG API using Netlify Functions.

---

## Prerequisites

1.  **Netlify Account:** You need a Netlify account. You can sign up for free at [netlify.com](https://www.netlify.com).
2.  **Git Repository:** Your project must be in a Git repository (e.g., GitHub, GitLab, Bitbucket) that Netlify can access.

---

## Netlify Project Setup

### 1. Create a New Site

*   From your Netlify dashboard, click "Add new site" > "Import an existing project".
*   Connect to your Git provider and select the repository for this project.

### 2. Configure Build Settings

Netlify will likely detect that you are using Vite, but you should confirm the following settings:

*   **Build command:** `npm run build`
*   **Publish directory:** `dist`

### 3. Environment Variables

*   In the site settings, go to "Build & deploy" > "Environment".
*   Add the environment variables required for the application, such as `VITE_N8N_WEBHOOK_URL`.

---

## Handling the RAG API with Netlify Functions

The Python-based RAG API requires a serverless function to run on Netlify. The local development middleware will not work in Netlify's environment.

### 1. Create a Netlify Configuration File

Create a `netlify.toml` file in the root of your project. This file will tell Netlify where to find the serverless functions and how to handle redirects.

```toml
# netlify.toml

[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

### 2. Create the Serverless Function

*   Create a directory named `netlify/functions` in the root of your project.
*   Inside this directory, create a Python file for your function, for example, `netlify/functions/rag_search.py`.

```python
# netlify/functions/rag_search.py

import json
import os
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer

def handler(event, context):
    if event['httpMethod'] == 'POST':
        try:
            body = json.loads(event['body'])
            query_text = body.get('query')

            # Paths are relative to the function file
            # You may need to adjust this based on your project structure
            index_path = os.path.join(os.path.dirname(__file__), '../../5_Symbols/rag/faiss_index.bin')
            filepaths_path = os.path.join(os.path.dirname(__file__), '../../5_Symbols/rag/filepaths.txt')

            index = faiss.read_index(index_path)
            with open(filepaths_path, 'r', encoding='utf-8') as f:
                filepaths = [line.strip() for line in f.readlines()]

            model = SentenceTransformer('all-MiniLM-L6-v2')

            query_embedding = model.encode([query_text], convert_to_tensor=False)
            query_embedding = np.array(query_embedding).astype('float32')

            k = 5
            distances, indices = index.search(query_embedding, k)

            results = []
            for i, idx in enumerate(indices[0]):
                if idx < len(filepaths):
                    results.append({
                        'path': filepaths[idx],
                        'distance': float(distances[0][i])
                    })

            return {
                'statusCode': 200,
                'headers': { 'Content-Type': 'application/json' },
                'body': json.dumps({'results': results})
            }

        except Exception as e:
            return {
                'statusCode': 500,
                'headers': { 'Content-Type': 'application/json' },
                'body': json.dumps({'error': str(e)})
            }
    
    return {
        'statusCode': 405,
        'headers': { 'Content-Type': 'application/json' },
        'body': json.dumps({'error': 'Method Not Allowed'})
    }
```

### 3. Handle Python Dependencies

*   In the `netlify/functions` directory, create a `requirements.txt` file.
*   Add the required Python packages to this file:

    ```txt
    # netlify/functions/requirements.txt
    faiss-cpu
    sentence-transformers
    numpy
    ```

### 4. Update Frontend Code

Ensure your frontend application makes POST requests to `/api/rag-search`. The redirect rule in `netlify.toml` will route this to your Netlify function.

### 5. Deploy

*   Commit all the new files (`netlify.toml`, `netlify/functions/rag_search.py`, `netlify/functions/requirements.txt`, and the FAISS index files) to your Git repository.
*   Push the changes to your main branch. Netlify will automatically trigger a new deployment with the updated configuration.
