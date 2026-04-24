import streamlit as st
import requests

st.set_page_config(page_title="Medical AI Assistant", page_icon="🏥")

st.title("Medical AI Agent")
st.caption("Agentic Medical")

API_URL = "http://127.0.0.1:8000/chat"

if "messages" not in st.session_state:
    st.session_state.messages = []

for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

if prompt := st.chat_input("Describe symptoms or ask for hospitals:-"):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    with st.chat_message("assistant"):
        with st.spinner("Agent is thinking......"):
            try:
                payload = {"mss": prompt, "user_id": "mo_session_1"}
                response = requests.post(API_URL, json=payload)
                
                if response.status_code == 200:
                    answer = response.json().get("agent_response", "Error: No response field")
                    st.markdown(answer)
                    st.session_state.messages.append({"role": "assistant", "content": answer})
                else:
                    st.error(f"Backend Error: {response.status_code}")
            except Exception as e:
                st.error(f"Could not connect to FastAPI: {e}")

with st.sidebar:
    st.header("Settings")
    if st.button("Clear Chat History"):
        st.session_state.messages = []
        st.rerun()
