#!/usr/bin/env python3
"""
Simple RAG Index Verification
Shows that all 5 sample documents are properly indexed
"""

import os

def main():
    print("🔍 RAG Index Verification Report")
    print("=" * 50)
    
    # Check index files
    print("📁 Checking index files:")
    if os.path.exists('faiss_index.bin'):
        size = os.path.getsize('faiss_index.bin')
        print(f"   ✅ faiss_index.bin ({size} bytes)")
    else:
        print("   ❌ faiss_index.bin missing")
        return
    
    if os.path.exists('filepaths.txt'):
        size = os.path.getsize('filepaths.txt')
        print(f"   ✅ filepaths.txt ({size} bytes)")
    else:
        print("   ❌ filepaths.txt missing")
        return
    
    # Read indexed files
    print(f"\n📊 Indexed files:")
    with open('filepaths.txt', 'r') as f:
        indexed_files = [line.strip() for line in f.readlines()]
    
    print(f"   Total indexed: {len(indexed_files)} files")
    
    # Check sample docs directory
    print(f"\n📄 Sample documents in directory:")
    sample_files = []
    for file in os.listdir('sample_docs'):
        if file.endswith('.md'):
            sample_files.append(file)
    
    sample_files.sort()
    print(f"   Total available: {len(sample_files)} files")
    
    # Show all files
    print(f"\n📋 Detailed file listing:")
    for i, filepath in enumerate(indexed_files, 1):
        filename = os.path.basename(filepath)
        full_path = filepath
        
        if os.path.exists(full_path):
            size = os.path.getsize(full_path)
            print(f"   {i}. ✅ {filename} ({size} bytes)")
            
            # Show first line as preview
            try:
                with open(full_path, 'r', encoding='utf-8') as f:
                    first_line = f.readline().strip()
                    print(f"      Preview: {first_line}")
            except:
                pass
        else:
            print(f"   {i}. ❌ {filename} (file not found)")
    
    # Verify all sample files are indexed
    print(f"\n🔍 Verification:")
    all_indexed = True
    for sample_file in sample_files:
        sample_path = os.path.join('sample_docs', sample_file)
        if sample_path in indexed_files:
            print(f"   ✅ {sample_file} is indexed")
        else:
            print(f"   ❌ {sample_file} is NOT indexed")
            all_indexed = False
    
    print(f"\n🎉 Summary:")
    if all_indexed and len(indexed_files) == len(sample_files):
        print(f"   ✅ SUCCESS: All {len(sample_files)} sample documents are properly indexed!")
        print(f"   ✅ Index contains {len(indexed_files)} files")
        print(f"   ✅ Ready for semantic search queries")
    else:
        print(f"   ❌ ISSUE: Indexing incomplete")
        print(f"   📊 Expected: {len(sample_files)}, Indexed: {len(indexed_files)}")

if __name__ == "__main__":
    main()