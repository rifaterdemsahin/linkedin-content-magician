
from http.server import BaseHTTPRequestHandler
import json
import os
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)
        query_text = data.get('query')

        try:
            # Paths are relative to the root of the project in Vercel deployments
            index_path = os.path.join(os.getcwd(), '5_Symbols', 'rag', 'faiss_index.bin')
            filepaths_path = os.path.join(os.getcwd(), '5_Symbols', 'rag', 'filepaths.txt')

            index = faiss.read_index(index_path)
            with open(filepaths_path, 'r', encoding='utf-8') as f:
                filepaths = [line.strip() for line in f.readlines()]

            model = SentenceTransformer('all-MiniLM-L6-v2')

            query_embedding = model.encode([query_text], convert_to_tensor=False)
            query_embedding = np.array(query_embedding).astype('float32')

            k = 5
            distances, indices = index.search(query_embedding, k)

            results = []
            for i, idx in enumerate(indices[0]):
                if idx < len(filepaths):
                    results.append({
                        'path': filepaths[idx],
                        'distance': float(distances[0][i])
                    })

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'results': results}).encode('utf-8'))

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
            
        return
