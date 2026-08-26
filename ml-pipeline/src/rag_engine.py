import os
import chromadb

DEFAULT_DB_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "vector_db", "bps_knowledge")

class BpsRagEngine:
    """
    RAG Retrieval Engine Resmi BPS
    Melakukan semantic similarity search di Vector Database ChromaDB.
    """
    def __init__(self, db_path: str = None):
        self.db_path = db_path or os.path.abspath(DEFAULT_DB_DIR)
        self.client = chromadb.PersistentClient(path=self.db_path)
        self.collection = self.client.get_or_create_collection(
            name="bps_knowledge_base",
            metadata={"hnsw:space": "cosine"}
        )

    def retrieve(self, query: str, top_k: int = 3, max_distance: float = 0.85) -> list[dict]:
        """
        Mencari dokumen BPS paling relevan berdasarkan semantic similarity.
        Mengembalikan list dokumen dengan snippet, metadata, dan skor relevansi.
        """
        try:
            results = self.collection.query(
                query_texts=[query],
                n_results=top_k
            )
            
            docs = results.get("documents", [[]])[0]
            metas = results.get("metadatas", [[]])[0]
            distances = results.get("distances", [[]])[0]
            
            retrieved_items = []
            for doc, meta, dist in zip(docs, metas, distances):
                # Filter berdasarkan distance (semakin kecil distance semakin mirip)
                if dist <= max_distance:
                    retrieved_items.append({
                        "title": meta.get("title", "Dokumen BPS"),
                        "category": meta.get("category", "Umum"),
                        "region": meta.get("region", "Nasional"),
                        "domain_id": meta.get("domain_id", "0000"),
                        "url": meta.get("url", "https://www.bps.go.id"),
                        "content": doc,
                        "relevance_score": round(1.0 - dist, 4)
                    })
            return retrieved_items
        except Exception as e:
            print(f"[RAG ERROR] Gagal retrieve: {e}")
            return []

if __name__ == "__main__":
    engine = BpsRagEngine()
    print("Testing BpsRagEngine...")
    test_q = "Siapa kepala BPS Sulteng?"
    results = engine.retrieve(test_q, top_k=2)
    print(f"Hasil untuk '{test_q}': {len(results)} dokumen ditemukan")
    for r in results:
        print(f"- {r['title']} (Skor Relevansi: {r['relevance_score']})")
        print(f"  URL: {r['url']}")
        print(f"  Snippet: {r['content'][:120]}...\n")