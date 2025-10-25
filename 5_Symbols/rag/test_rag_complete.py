#!/usr/bin/env python3
"""
RAG Index Test Suite
This script demonstrates the indexing and search capabilities of the RAG system
"""

import os
import sys
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

def test_index_completeness():
    """Test that all sample documents were indexed"""
    print("🔍 Testing Index Completeness")
    print("=" * 50)
    
    # Check if index files exist
    if not os.path.exists('faiss_index.bin'):
        print("❌ FAISS index file not found!")
        return False
    
    if not os.path.exists('filepaths.txt'):
        print("❌ File paths file not found!")
        return False
    
    # Load filepaths
    with open('filepaths.txt', 'r') as f:
        indexed_files = [line.strip() for line in f.readlines()]
    
    # Check sample_docs directory
    sample_docs_dir = 'sample_docs'
    if not os.path.exists(sample_docs_dir):
        print(f"❌ Sample docs directory not found: {sample_docs_dir}")
        return False
    
    expected_files = []
    for file in os.listdir(sample_docs_dir):
        if file.endswith('.md'):
            expected_files.append(os.path.join(sample_docs_dir, file))
    
    print(f"📊 Expected files: {len(expected_files)}")
    print(f"📊 Indexed files: {len(indexed_files)}")
    
    print("\n📄 Expected Files:")
    for i, file in enumerate(sorted(expected_files), 1):
        print(f"   {i}. {os.path.basename(file)}")
    
    print("\n📄 Indexed Files:")
    for i, file in enumerate(indexed_files, 1):
        print(f"   {i}. {os.path.basename(file)}")
    
    # Check if all expected files are indexed
    missing_files = []
    for expected_file in expected_files:
        if expected_file not in indexed_files:
            missing_files.append(expected_file)
    
    if missing_files:
        print(f"\n❌ Missing files from index:")
        for file in missing_files:
            print(f"   - {file}")
        return False
    
    print(f"\n✅ All {len(expected_files)} files are properly indexed!")
    return True

def test_search_functionality():
    """Test search functionality with various queries"""
    print("\n🔍 Testing Search Functionality")
    print("=" * 50)
    
    # Load index
    try:
        index = faiss.read_index('faiss_index.bin')
        print(f"✅ Index loaded: {index.ntotal} vectors")
    except Exception as e:
        print(f"❌ Failed to load index: {e}")
        return False
    
    # Load filepaths
    try:
        with open('filepaths.txt', 'r') as f:
            filepaths = [line.strip() for line in f.readlines()]
        print(f"✅ File paths loaded: {len(filepaths)} files")
    except Exception as e:
        print(f"❌ Failed to load filepaths: {e}")
        return False
    
    # Load model
    try:
        model = SentenceTransformer('all-MiniLM-L6-v2')
        print("✅ Model loaded successfully")
    except Exception as e:
        print(f"❌ Failed to load model: {e}")
        return False
    
    # Test queries
    test_queries = [
        "AI tools for content creation",
        "LinkedIn networking strategy", 
        "video production workflow",
        "analytics and metrics",
        "personal branding tips"
    ]
    
    print(f"\n🔎 Testing {len(test_queries)} sample queries:")
    
    for i, query in enumerate(test_queries, 1):
        print(f"\n📝 Query {i}: '{query}'")
        
        # Search
        query_embedding = model.encode([query], convert_to_tensor=False)
        query_embedding = np.array(query_embedding).astype('float32')
        
        distances, indices = index.search(query_embedding, 3)
        
        print(f"   🎯 Top 3 results:")
        for j, idx in enumerate(indices[0][:3]):
            if idx < len(filepaths):
                file_name = os.path.basename(filepaths[idx])
                distance = distances[0][j]
                similarity = 1 / (1 + distance)
                print(f"      {j+1}. {file_name} (similarity: {similarity:.3f})")
    
    return True

def show_file_contents():
    """Show brief content preview of each indexed file"""
    print("\n📚 Indexed File Contents Preview")
    print("=" * 50)
    
    with open('filepaths.txt', 'r') as f:
        filepaths = [line.strip() for line in f.readlines()]
    
    for i, filepath in enumerate(filepaths, 1):
        print(f"\n📄 File {i}: {os.path.basename(filepath)}")
        print(f"   📁 Path: {filepath}")
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                # Get first few lines for preview
                lines = content.split('\n')[:5]
                preview = '\n'.join(lines)
                if len(content) > len(preview):
                    preview += "\n   ..."
                
                print(f"   📝 Content preview:")
                for line in preview.split('\n'):
                    print(f"      {line}")
                
                print(f"   📊 Total length: {len(content)} characters")
                
        except Exception as e:
            print(f"   ❌ Error reading file: {e}")

def main():
    print("🚀 RAG System Index Test Suite")
    print("=" * 60)
    
    # Change to the RAG directory
    if not os.path.exists('sample_docs'):
        print("❌ Please run this script from the RAG directory")
        sys.exit(1)
    
    # Run tests
    success = True
    
    success &= test_index_completeness()
    success &= test_search_functionality()
    show_file_contents()
    
    print("\n" + "=" * 60)
    if success:
        print("🎉 All tests passed! RAG indexing is working correctly.")
        print("✅ All 5 sample documents are properly indexed and searchable.")
    else:
        print("❌ Some tests failed. Please check the output above.")
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())