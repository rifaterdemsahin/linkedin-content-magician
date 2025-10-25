import argparse
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer

def main():
    parser = argparse.ArgumentParser(description="Search for a query in the indexed markdown files.")
    parser.add_argument('--query', type=str, required=True, help="The search query.")
    args = parser.parse_args()

    query_text = args.query

    try:
        print("Loading FAISS index from 'faiss_index.bin'...")
        index = faiss.read_index('faiss_index.bin')
    except Exception as e:
        print(f"Error loading FAISS index: {e}")
        print("Please run index.py first to create the index.")
        return

    try:
        print("Loading file paths from 'filepaths.txt'...")
        with open('filepaths.txt', 'r', encoding='utf-8') as f:
            filepaths = [line.strip() for line in f.readlines()]
    except Exception as e:
        print(f"Error loading filepaths: {e}")
        print("Please run index.py first to create the filepaths list.")
        return

    print("Loading sentence transformer model...")
    model = SentenceTransformer('all-MiniLM-L6-v2')

    print(f"Searching for: '{query_text}'")
    query_embedding = model.encode([query_text], convert_to_tensor=False)
    query_embedding = np.array(query_embedding).astype('float32')

    k = 5  # Number of results to retrieve
    distances, indices = index.search(query_embedding, k)

    print("\nTop 5 search results:")
    if len(indices[0]) == 0:
        print("No results found.")
    else:
        for i, idx in enumerate(indices[0]):
            if idx < len(filepaths):
                print(f"{i+1}. {filepaths[idx]} (Distance: {distances[0][i]:.4f})")
            else:
                print(f"Warning: Index {idx} is out of bounds for filepaths list.")


if __name__ == "__main__":
    main()
