import argparse
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
import os

def main():
    parser = argparse.ArgumentParser(description="Search for a query in the indexed markdown files with debug output.")
    parser.add_argument('--query', type=str, required=True, help="The search query.")
    args = parser.parse_args()

    query_text = args.query

    try:
        print("🔄 Loading FAISS index from 'faiss_index.bin'...")
        index = faiss.read_index('faiss_index.bin')
        print(f"✅ Index loaded! Total vectors: {index.ntotal}")
    except Exception as e:
        print(f"❌ Error loading FAISS index: {e}")
        print("Please run index.py first to create the index.")
        return

    try:
        print("🔄 Loading file paths from 'filepaths.txt'...")
        with open('filepaths.txt', 'r', encoding='utf-8') as f:
            filepaths = [line.strip() for line in f.readlines()]
        print(f"✅ Loaded {len(filepaths)} file paths")
    except Exception as e:
        print(f"❌ Error loading filepaths: {e}")
        print("Please run index.py first to create the filepaths list.")
        return

    print("🔄 Loading sentence transformer model...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    print("✅ Model loaded successfully!")

    print(f"\n🔍 Searching for: '{query_text}'")
    print("=" * 60)
    
    query_embedding = model.encode([query_text], convert_to_tensor=False)
    query_embedding = np.array(query_embedding).astype('float32')

    k = 5  # Number of results to retrieve
    distances, indices = index.search(query_embedding, k)

    print(f"\n📊 Top {k} search results:")
    print("=" * 60)
    
    if len(indices[0]) == 0:
        print("❌ No results found.")
    else:
        for i, idx in enumerate(indices[0]):
            if idx < len(filepaths):
                file_path = filepaths[idx]
                file_name = os.path.basename(file_path)
                distance = distances[0][i]
                
                # Calculate similarity score (lower distance = higher similarity)
                similarity = 1 / (1 + distance)
                
                print(f"\n🏆 Result {i+1}:")
                print(f"   📄 File: {file_name}")
                print(f"   📁 Path: {file_path}")
                print(f"   📊 Distance: {distance:.4f}")
                print(f"   ⭐ Similarity: {similarity:.4f}")
                
                # Show a preview of the file content
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        preview = content[:300] + "..." if len(content) > 300 else content
                        print(f"   📝 Preview: {preview}")
                except Exception as e:
                    print(f"   ❌ Error reading file: {e}")
            else:
                print(f"❌ Warning: Index {idx} is out of bounds for filepaths list.")
    
    print(f"\n🎉 Search complete!")

if __name__ == "__main__":
    main()