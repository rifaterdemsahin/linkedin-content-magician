#!/usr/bin/env python3
"""
RAG Search API
Provides JSON API for searching RAG sources from Node.js
"""

import argparse
import json
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
import os
import sys

def search_rag_sources(query_text, top_k=3):
    """
    Search for RAG sources and return JSON results
    Args:
        query_text (str): The search query
        top_k (int): Number of top results to return (default: 3)
    
    Returns:
        dict: JSON response with search results
    """
    try:
        # Load FAISS index
        index = faiss.read_index('faiss_index.bin')
        
        # Load file paths
        with open('filepaths.txt', 'r', encoding='utf-8') as f:
            filepaths = [line.strip() for line in f.readlines()]
        
        # Load sentence transformer model
        model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Generate query embedding
        query_embedding = model.encode([query_text], convert_to_tensor=False)
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
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                            # Get first line as title/description
                            lines = content.split('\n')
                            title = lines[0].strip('#').strip() if lines else file_name
                            preview = content[:200] + "..." if len(content) > 200 else content
                    except Exception as e:
                        title = file_name
                        preview = f"Error reading file: {e}"
                    
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
            "success": True,
            "query": query_text,
            "total_results": len(results),
            "sources": results
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "query": query_text,
            "sources": []
        }

def main():
    parser = argparse.ArgumentParser(description="RAG Search API - Returns JSON results")
    parser.add_argument('--query', type=str, required=True, help="The search query")
    parser.add_argument('--top-k', type=int, default=3, help="Number of top results to return")
    parser.add_argument('--json-only', action='store_true', help="Output only JSON without debug info")
    
    args = parser.parse_args()
    
    # Change to the script's directory to find the index files
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    # Perform search
    result = search_rag_sources(args.query, args.top_k)
    
    if args.json_only:
        # Output only JSON for Node.js consumption
        print(json.dumps(result, indent=2))
    else:
        # Output with debug info for human reading
        print("🔍 RAG Search API")
        print("=" * 50)
        print(f"Query: {args.query}")
        print(f"Top K: {args.top_k}")
        print("=" * 50)
        print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()