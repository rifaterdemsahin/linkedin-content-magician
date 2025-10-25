
# Formula: Deploying to Vercel

**Objective:** To deploy the LinkedIn Content Magician application to Vercel, making it accessible as a live web application. This guide covers the setup for both a simple static deployment and an advanced deployment with serverless functions to support the RAG API.

## Prerequisites

1.  **Vercel Account:** You need a Vercel account. You can sign up for free at [vercel.com](https://vercel.com).
2.  **Git Repository:** Your project must be in a Git repository (e.g., GitHub, GitLab, Bitbucket) that Vercel can access.

---

## Option 1: Simple Static Deployment (Without RAG API)

This option deploys the React frontend as a static site. The RAG search functionality, which depends on the Python backend, will **not** work with this setup.

### Step-by-Step Guide

1.  **New Project on Vercel:**
    *   Go to your Vercel dashboard and click "Add New..." > "Project".
    *   Click "Continue with Git" and select the Git repository for this project.

2.  **Configure Project:**
    *   **Framework Preset:** Vercel should automatically detect that you are using Vite. If not, select **Vite**.
    *   **Build and Output Settings:**
        *   **Build Command:** `npm run build` or `vite build`
        *   **Output Directory:** `dist`
        *   **Install Command:** `npm install`
    *   **Environment Variables:**
        *   You will need to add the environment variables defined in your `.env` files (e.g., `VITE_N8N_WEBHOOK_URL`). Add them under the "Environment Variables" section in the project settings.

3.  **Deploy:**
    *   Click the "Deploy" button.
    *   Vercel will build and deploy your application. You will be given a URL to the live site.

### Outcome

The frontend of the LinkedIn Content Magician will be live. Any features that do not rely on the custom `ragApiPlugin` middleware (like the n8n integration, if the webhook is public) should work correctly. The RAG search will fail because the API endpoint (`/api/rag-search`) will not exist.

---

## Option 2: Advanced Deployment with Vercel Serverless Functions (For RAG API)

This option re-implements the RAG API using Vercel's Python Serverless Functions. This is more complex but will provide the full application functionality.

### Conceptual Changes

The custom middleware in `vite.config.js` that runs the Python script is for local development only and will not work on Vercel. We need to replace it with a Vercel Serverless Function.

### Step-by-Step Guide

1.  **Project Structure for Serverless Functions:**
    *   Create a new directory named `api` in the root of your project.
    *   Inside `api`, create a Python file to handle the search logic, for example, `api/rag_search.py`.

2.  **Create the Serverless Function (`api/rag_search.py`):**
    *   This Python file will contain a handler function that Vercel will execute.
    *   You will need to adapt your existing `search_api.py` logic into this handler.
    *   The function will receive the request and return a response.

    ```python
    # api/rag_search.py
    from http.server import BaseHTTPRequestHandler
    import json
    # ... import your other dependencies like faiss, sentence_transformers

    class handler(BaseHTTPRequestHandler):
        def do_POST(self):
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)
            query = data.get('query')

            # --- Your RAG search logic here ---
            # This is a simplified example.
            # You will need to load your model and index.
            # Note: Loading models and indexes on every request can be slow and expensive.
            # Consider strategies for caching or pre-loading these assets.
            results = {"message": f"Search results for: {query}"}
            # -------------------------------------

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(results).encode('utf-8'))
            return
    ```

3.  **Handle Python Dependencies:**
    *   Create a `requirements.txt` file in the same directory as your serverless function (`api/`).
    *   Add all the required Python packages to this file:

        ```txt
        # api/requirements.txt
        faiss-cpu
        sentence-transformers
        numpy
        ```

4.  **FAISS Index and Filepaths:**
    *   The serverless function needs access to the `faiss_index.bin` and `filepaths.txt` files.
    *   You will need to include these files in your Git repository so they are available during the build process on Vercel.
    *   Place them in a location accessible to your serverless function, for example, in a `data` directory at the root of your project, and update your Python script to load them from there.

5.  **Vercel Configuration (`vercel.json`):**
    *   Create a `vercel.json` file in the root of your project to configure the build and routing.

    ```json
    {
      "builds": [
        {
          "src": "api/rag_search.py",
          "use": "@vercel/python"
        },
        {
          "src": "package.json",
          "use": "@vercel/static-build",
          "config": {
            "distDir": "dist"
          }
        }
      ],
      "rewrites": [
        { "source": "/api/rag-search", "destination": "/api/rag_search.py" },
        { "source": "/(.*)", "destination": "/index.html" }
      ]
    }
    ```

6.  **Update Frontend Code:**
    *   Ensure your frontend is making requests to `/api/rag-search`. The rewrite rule in `vercel.json` will route this to your serverless function.

7.  **Deploy:**
    *   Commit all the new files (`api/rag_search.py`, `api/requirements.txt`, `vercel.json`, and the FAISS index files) to your Git repository.
    *   Vercel will automatically trigger a new deployment.

### Important Considerations for Option 2

*   **Cold Starts:** Serverless functions can have "cold starts," meaning the first request after a period of inactivity might be slow because the environment needs to be initialized (including loading the ML model and FAISS index).
*   **Execution Limits:** Vercel has limits on serverless function execution time and memory. Loading large models might exceed these limits.
*   **Cost:** Serverless function invocations and execution duration can incur costs.

This advanced setup provides the full functionality of the application on Vercel but requires careful planning and implementation to work correctly and efficiently.
