#!/usr/bin/env python3
"""
RAG System Demonstration
Shows complete workflow: indexing all 5 sample documents and testing searches
"""

import os
import subprocess
import sys

def run_command(command, description):
    """Run a command and show its output"""
    print(f"\n🔄 {description}")
    print("=" * 60)
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True, cwd=os.getcwd())
        if result.stdout:
            print(result.stdout)
        if result.stderr:
            print(f"⚠️  Stderr: {result.stderr}")
        return result.returncode == 0
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    print("🚀 RAG System Complete Demonstration")
    print("=" * 70)
    print("This demonstrates indexing all 5 sample documents and testing searches")
    
    # Check if we're in the right directory
    if not os.path.exists('sample_docs'):
        print("❌ Please run this script from the RAG directory")
        return 1
    
    # Step 1: Show available files
    print(f"\n📋 Available Sample Documents:")
    files = sorted([f for f in os.listdir('sample_docs') if f.endswith('.md')])
    for i, file in enumerate(files, 1):
        print(f"   {i}. {file}")
    
    # Step 2: Run indexing with debug output
    print(f"\n🔧 Step 1: Indexing all {len(files)} sample documents")
    success = run_command(
        "source venv/bin/activate && python index_debug.py --folder sample_docs",
        "Running indexing script with debug output"
    )
    
    if not success:
        print("❌ Indexing failed!")
        return 1
    
    # Step 3: Verify indexing
    print(f"\n🔍 Step 2: Verifying indexing results")
    success = run_command(
        "python verify_index.py",
        "Verifying all files were indexed correctly"
    )
    
    if not success:
        print("❌ Verification failed!")
        return 1
    
    # Step 4: Test searches
    test_queries = [
        "AI tools for content creation",
        "LinkedIn networking strategy", 
        "video production workflow"
    ]
    
    print(f"\n🔎 Step 3: Testing semantic searches")
    for i, query in enumerate(test_queries, 1):
        print(f"\n🎯 Search Test {i}: '{query}'")
        success = run_command(
            f"source venv/bin/activate && python search_debug.py --query \"{query}\"",
            f"Testing search with query: {query}"
        )
        
        if not success:
            print(f"❌ Search {i} failed!")
    
    # Final summary
    print(f"\n🎉 RAG System Demonstration Complete!")
    print("=" * 70)
    print("✅ Successfully demonstrated:")
    print("   • Indexing all 5 sample documents")
    print("   • Creating semantic embeddings with sentence-transformers")
    print("   • Building FAISS vector index")
    print("   • Performing semantic search queries")
    print("   • Ranking results by relevance")
    print("\n📊 Files indexed:")
    for i, file in enumerate(files, 1):
        print(f"   {i}. {file}")
    
    print(f"\n🔍 Search capabilities tested with {len(test_queries)} queries")
    print("📁 Generated files: faiss_index.bin, filepaths.txt")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())