import os
import tempfile
import streamlit as st
from dotenv import load_dotenv
from rag_pipeline import process_pdf, get_answer

load_dotenv()

st.set_page_config(
    page_title="Mo Abdelhaq – RAG Agent",
    page_icon="📄",
    layout="centered"
)

st.title("📄 Mo Abdelhaq – Customer Service RAG Agent")
st.caption("Upload a PDF, then ask anything about it.")

if "db" not in st.session_state:
    st.session_state.db = None

if "messages" not in st.session_state:
    st.session_state.messages = []     

if "sources" not in st.session_state:
    st.session_state.sources = {}       

with st.sidebar:
    st.header("📂 Upload Document")
    uploaded_file = st.file_uploader("Choose a PDF file", type=["pdf"])

    if uploaded_file:
        if st.button("Process PDF", use_container_width=True):
            with st.spinner("Reading and indexing your PDF…"):
                with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
                    tmp.write(uploaded_file.read())
                    tmp_path = tmp.name
                try:
                    st.session_state.db = process_pdf(tmp_path)
                    st.session_state.messages = []
                    st.session_state.sources = {}
                    st.success("PDF processed! You can start chatting.")
                except Exception as e:
                    st.error(f"Error processing PDF: {e}")
                finally:
                    os.unlink(tmp_path)

    if st.session_state.db:
        st.divider()
        if st.button("🗑️ Clear Chat", use_container_width=True):
            st.session_state.messages = []
            st.session_state.sources = {}
            st.rerun()

if not st.session_state.db:
    st.info("👈 Upload and process a PDF from the sidebar to get started.")
else:
    for idx, msg in enumerate(st.session_state.messages):
        with st.chat_message(msg["role"]):
            st.write(msg["content"])

            if msg["role"] == "assistant" and idx in st.session_state.sources:
                with st.expander("📎 View Sources (Context Chunks)"):
                    for i, src in enumerate(st.session_state.sources[idx], 1):
                        st.markdown(f"**Source {i}:**\n\n{src}")
                        if i < len(st.session_state.sources[idx]):
                            st.divider()

    question = st.chat_input("Type your question here…")
    if question:
        st.session_state.messages.append({"role": "user", "content": question})
        with st.chat_message("user"):
            st.write(question)

        with st.chat_message("assistant"):
            with st.spinner("Thinking…"):
                try:
                    result = get_answer(st.session_state.db, question)
                    answer = result["answer"]
                    sources = result["sources"]
                except Exception as e:
                    answer = f"⚠️ Error: {e}"
                    sources = []

            st.write(answer)

            msg_idx = len(st.session_state.messages) 
            st.session_state.sources[msg_idx] = sources
            st.session_state.messages.append({"role": "assistant", "content": answer})

            if sources:
                with st.expander("📎 View Sources (Context Chunks)"):
                    for i, src in enumerate(sources, 1):
                        st.markdown(f"**Source {i}:**\n\n{src}")
                        if i < len(sources):
                            st.divider()
