import unittest
import os
from dotenv import load_dotenv
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from rag_pipeline import get_answer

load_dotenv()


class TestRAGPipeline(unittest.TestCase):

    def setUp(self):
        sample_text = "Mo Abdelhaq is a Senior Software Engineer from Cairo, currently working at a leading tech company."
        docs = [Document(page_content=sample_text)]

        splitter = RecursiveCharacterTextSplitter(chunk_size=50, chunk_overlap=10)
        chunks = splitter.split_documents(docs)

        embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
        self.test_db = Chroma.from_documents(chunks, embeddings)

    def test_ingestion_and_retrieval(self):
        question = "What is Mo's job title?"
        result = get_answer(self.test_db, question)

        self.assertIn("Senior Software Engineer", result["answer"])
        self.assertTrue(len(result["sources"]) > 0)


if __name__ == "__main__":
    unittest.main()
