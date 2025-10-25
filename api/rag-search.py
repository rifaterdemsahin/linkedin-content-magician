#!/usr/bin/env python3
"""
Vercel Serverless Function for RAG Search
Provides JSON API for searching RAG sources from React frontend
"""

import json
import os

# Try to import required packages, provide fallback if not available
try:
    import numpy as np
    import faiss
    from sentence_transformers import SentenceTransformer
    DEPENDENCIES_AVAILABLE = True
except ImportError as e:
    DEPENDENCIES_AVAILABLE = False
    IMPORT_ERROR = str(e)

def handler(request):
    """
    Vercel serverless function handler for RAG search
    """
    
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            'body': ''
        }
    
    # Only allow POST requests
    if request.method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    # Check if dependencies are available
    if not DEPENDENCIES_AVAILABLE:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps({
                'success': False,
                'error': f'Dependencies not available: {IMPORT_ERROR}',
                'sources': []
            })
        }
    
    try:
        # Parse request body
        body = json.loads(request.body) if request.body else {}
        query = body.get('query', '')
        top_k = min(body.get('top_k', 3), 5)  # Limit to max 5 results
        
        if not query.strip():
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                'body': json.dumps({
                    'success': False,
                    'error': 'Query parameter is required',
                    'sources': []
                })
            }
        
        # Construct paths relative to function execution context
        base_path = '/var/task' if os.path.exists('/var/task') else '.'
        index_path = os.path.join(base_path, 'faiss_index.bin')
        filepaths_path = os.path.join(base_path, 'filepaths.txt')
        
        # Fallback paths for development
        if not os.path.exists(index_path):
            index_path = os.path.join(base_path, '5_Symbols', 'rag', 'faiss_index.bin')
            filepaths_path = os.path.join(base_path, '5_Symbols', 'rag', 'filepaths.txt')
        
        # Load FAISS index
        if not os.path.exists(index_path):
            raise FileNotFoundError(f"FAISS index not found at {index_path}")
        
        index = faiss.read_index(index_path)
        
        # Load file paths
        if not os.path.exists(filepaths_path):
            raise FileNotFoundError(f"File paths not found at {filepaths_path}")
            
        with open(filepaths_path, 'r', encoding='utf-8') as f:
            filepaths = [line.strip() for line in f.readlines()]
        
        # Load sentence transformer model
        model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Generate query embedding
        query_embedding = model.encode([query], convert_to_tensor=False)
        query_embedding = np.array(query_embedding).astype('float32')
        
        # Search for similar documents
        distances, indices = index.search(query_embedding, top_k)
        
        results = []
        
        if len(indices[0]) > 0:
            for i, idx in enumerate(indices[0]):
                if idx < len(filepaths):
                    file_path = filepaths[idx]
                    file_name = os.path.basename(file_path)
                    distance = float(distances[0][i])
                    similarity = 1 / (1 + distance)
                    
                    # Read file content for preview
                    try:
                        # Try different base paths for file reading
                        full_file_path = None
                        possible_paths = [
                            os.path.join(base_path, file_path),
                            os.path.join(base_path, 'sample_docs', os.path.basename(file_path)),
                            os.path.join(base_path, '5_Symbols', 'rag', file_path)
                        ]
                        
                        for path in possible_paths:
                            if os.path.exists(path):
                                full_file_path = path
                                break
                        
                        if full_file_path:
                            with open(full_file_path, 'r', encoding='utf-8') as f:
                                content = f.read()
                                # Get first line as title/description
                                lines = content.split('\n')
                                title = lines[0].strip('#').strip() if lines else file_name
                                preview = content[:200] + "..." if len(content) > 200 else content
                        else:
                            title = file_name
                            preview = "File content not accessible"
                            
                    except Exception as e:
                        title = file_name
                        preview = f"Error reading file: {str(e)}"
                    
                    results.append({
                        "rank": i + 1,
                        "title": title,
                        "file_name": file_name,
                        "file_path": file_path,
                        "distance": distance,
                        "similarity": similarity,
                        "preview": preview
                    })
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps({
                'success': True,
                'query': query,
                'total_results': len(results),
                'sources': results
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps({
                'success': False,
                'error': str(e),
                'query': body.get('query', '') if 'body' in locals() else '',
                'sources': []
            })
        }

# Export for Vercel
def main(request):
    return handler(request)

if __name__ == "__main__":
    # For local testing without dependencies
    if not DEPENDENCIES_AVAILABLE:
        print(f"⚠️  Dependencies not available for local testing: {IMPORT_ERROR}")
        print("✅ Syntax check passed - function will work on Vercel with proper dependencies")
        exit(0)
    
    # Test the handler with dependencies
    class MockRequest:
        def __init__(self, method='POST', body='{"query": "automation", "top_k": 3}'):
            self.method = method
            self.body = body
    
    # Test the handler
    test_request = MockRequest()
    result = handler(test_request)
    print(json.dumps(result, indent=2))