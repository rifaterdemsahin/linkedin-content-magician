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
        print(f"❌ Error reading or parsing {file_path}: {e}")
        return None

def main():
    parser = argparse.ArgumentParser(description="Index markdown files for semantic search with debug output.")
    parser.add_argument('--folder', type=str, required=True, help="Folder containing markdown files to index.")
    args = parser.parse_args()

    folder_path = args.folder
    if not os.path.isdir(folder_path):
        print(f"❌ Error: Folder not found at {folder_path}")
        return

    print("🔄 Loading sentence transformer model...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    print("✅ Model loaded successfully!")

    filepaths = []
    texts = []

    print(f"\n🔍 Scanning for markdown files in '{folder_path}'...")
    print("=" * 60)
    
    file_count = 0
    for root, _, files in os.walk(folder_path):
        for file in files:
            if file.endswith('.md'):
                file_count += 1
                file_path = os.path.join(root, file)
                print(f"\n📄 Processing file {file_count}: {file}")
                print(f"   📁 Full path: {file_path}")
                
                text = get_text_from_markdown(file_path)
                if text:
                    # Show preview of extracted text
                    preview = text[:200] + "..." if len(text) > 200 else text
                    print(f"   📝 Extracted text ({len(text)} chars): {preview}")
                    print(f"   ✅ Successfully indexed!")
                    
                    filepaths.append(file_path)
                    texts.append(text)
                else:
                    print(f"   ❌ Failed to extract text")

    if not texts:
        print("\n❌ No markdown files found or processed.")
        return

    print(f"\n🔄 Creating embeddings for {len(texts)} files...")
    print("=" * 60)
    
    embeddings = model.encode(texts, convert_to_tensor=False)
    embeddings = np.array(embeddings).astype('float32')
    
    print(f"✅ Embeddings created! Shape: {embeddings.shape}")
    
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index = faiss.IndexIDMap(index)
    
    ids = np.array(range(len(filepaths)))
    index.add_with_ids(embeddings, ids)

    print(f"\n💾 Saving FAISS index to 'faiss_index.bin'...")
    faiss.write_index(index, 'faiss_index.bin')
    print("✅ Index saved!")
    
    print(f"\n💾 Saving file paths to 'filepaths.txt'...")
    with open('filepaths.txt', 'w', encoding='utf-8') as f:
        for i, path in enumerate(filepaths):
            f.write(f"{path}\n")
            print(f"   {i+1}. {os.path.basename(path)}")
    
    print("\n🎉 Indexing complete!")
    print("=" * 60)
    print(f"📊 Summary:")
    print(f"   • Files indexed: {len(texts)}")
    print(f"   • Embedding dimension: {dimension}")
    print(f"   • Index type: FAISS IndexFlatL2 with IDMap")
    print(f"   • Output files: faiss_index.bin, filepaths.txt")

if __name__ == "__main__":
    main()