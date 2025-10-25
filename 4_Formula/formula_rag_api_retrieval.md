
# Formula: RAG Data Retrieval via Python API

**Objective:** To decouple the frontend from the Python-based RAG (Retrieval-Augmented Generation) system by introducing a dedicated API endpoint. This allows for a more robust and maintainable architecture, improves the developer experience, and provides a clear fallback mechanism if the RAG system is unavailable.

## Feature Description

This feature introduces a new API endpoint, `/api/rag-search`, which allows the frontend to query the RAG system for relevant documents. This is a significant improvement over the previous implementation, which likely involved a more tightly coupled approach.

The feature also includes an enhanced fallback mechanism. If the RAG API call fails, the system can now gracefully handle the error and proceed with a non-augmented content generation process. This ensures that the application remains functional even if the RAG system is offline or misconfigured.

Finally, a custom server middleware has been added to the Vite development server to handle the API requests. This middleware is responsible for receiving the search query from the frontend, executing the Python RAG search script, and returning the results as a JSON response.

## Implementation Details

### Python RAG API (`search_api.py`)

A new Python script, `search_api.py`, has been created to expose the RAG search functionality as a command-line API that returns JSON. This script is a modification of the original `search.py` and is designed to be called from the Vite middleware.

**Key characteristics:**

*   Accepts a `--query` and `--top-k` argument.
*   Returns search results in a structured JSON format, including the file paths and distances.
*   Includes a `--json-only` flag to suppress any non-JSON output, making it easy to parse the results.

### Vite Custom Middleware

The `vite.config.js` file has been updated with a custom plugin, `ragApiPlugin`, which creates a middleware for the Vite development server.

**Key responsibilities:**

*   Listens for POST requests on the `/api/rag-search` endpoint.
*   Parses the JSON body of the request to get the `query` and `top_k` parameters.
*   Executes the `search_api.py` script with the provided parameters.
*   Captures the JSON output from the Python script.
*   Sends the JSON response back to the frontend.
*   Handles errors gracefully, returning a 500 status code and an error message if the Python script fails.

```javascript
// 5_Symbols/vite.config.js

const ragApiPlugin = () => {
  return {
    name: 'rag-api',
    configureServer(server) {
      server.middlewares.use('/api/rag-search', async (req, res, next) => {
        // ... middleware logic ...
      })
    }
  }
}
```

### Enhanced Fallback Mechanism

The frontend code that initiates the RAG search has been updated to handle potential failures in the API call.

**Workflow:**

1.  The frontend sends a POST request to `/api/rag-search` with the user's query.
2.  It `await`s the response from the API.
3.  If the request is successful, it uses the retrieved documents to augment the content generation prompt.
4.  If the request fails (e.g., network error, 500 status code), it catches the error and proceeds with the content generation process without the augmented data. A message can be displayed to the user indicating that the RAG search failed.

## Workflow

1.  **User Input**: The user enters a query into the frontend application.
2.  **API Request**: The frontend sends a POST request to `/api/rag-search` with the query.
3.  **Middleware**: The Vite middleware intercepts the request.
4.  **Python Execution**: The middleware executes the `search_api.py` script, passing the query as an argument.
5.  **RAG Search**: The Python script loads the FAISS index and performs a semantic search.
6.  **JSON Response**: The Python script returns the search results as a JSON string to stdout.
7.  **Middleware Response**: The middleware captures the JSON output and sends it as the HTTP response to the frontend.
8.  **Frontend Processing**: The frontend receives the JSON response, processes the results, and updates the UI.

## Benefits

*   **Decoupling**: The frontend and backend (RAG system) are now decoupled, making the system more modular and easier to maintain.
*   **Improved Developer Experience**: Frontend developers can now interact with the RAG system through a simple API, without needing to understand the underlying Python implementation.
*   **Robustness**: The enhanced fallback mechanism makes the application more resilient to failures in the RAG system.
*   **Scalability**: The API-based approach allows the RAG system to be scaled independently of the frontend.
*   **Flexibility**: The API can be consumed by other services in the future, not just the frontend.
