import os
import argparse
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
from markdown_it import MarkdownIt

def get_text_from_markdown(file_path):
    """Reads a markdown file and returns its text content."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            md = MarkdownIt()
            content = f.read()
            tokens = md.parse(content)
            text_content = " ".join([token.content for token in tokens if token.type == 'inline'])
            return text_content
    except Exception as e:
        print(f"Error reading or parsing {file_path}: {e}")
        return None

def main():
    parser = argparse.ArgumentParser(description="Index markdown files for semantic search.")
    parser.add_argument('--folder', type=str, required=True, help="Folder containing markdown files to index.")
    args = parser.parse_args()

    folder_path = args.folder
    if not os.path.isdir(folder_path):
        print(f"Error: Folder not found at {folder_path}")
        return

    print("Loading sentence transformer model...")
    model = SentenceTransformer('all-MiniLM-L6-v2')

    filepaths = []
    texts = []

    print(f"Scanning for markdown files in '{folder_path}'...")
    for root, _, files in os.walk(folder_path):
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                text = get_text_from_markdown(file_path)
                if text:
                    filepaths.append(file_path)
                    texts.append(text)

    if not texts:
        print("No markdown files found or processed.")
        return

    print(f"Found {len(texts)} markdown files. Creating embeddings...")
    embeddings = model.encode(texts, convert_to_tensor=False)
    embeddings = np.array(embeddings).astype('float32')
    
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index = faiss.IndexIDMap(index)
    
    ids = np.array(range(len(filepaths)))
    index.add_with_ids(embeddings, ids)

    print("Saving FAISS index to 'faiss_index.bin'...")
    faiss.write_index(index, 'faiss_index.bin')
    
    print("Saving file paths to 'filepaths.txt'...")
    with open('filepaths.txt', 'w', encoding='utf-8') as f:
        for path in filepaths:
            f.write(f"{path}\n")
            
    print("Indexing complete.")

if __name__ == "__main__":
    main()
