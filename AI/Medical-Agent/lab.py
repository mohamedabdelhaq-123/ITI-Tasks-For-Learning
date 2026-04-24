import os
import pandas as pd
from duckduckgo_search import DDGS
from fastapi import FastAPI, HTTPException
import google.generativeai as genai
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()


def search_hospitals(location: str):
    with DDGS() as ddgs:
        results = list(ddgs.text(f"hospitals and medical centers in {location}", max_results=3))
        return results if results else "No hospitals found in this area."

def save_patient_case(patient_summary: str, symptoms: str):
    file_path = "medical_cases.csv"
    new_data = pd.DataFrame([{"Summary": patient_summary, "Symptoms": symptoms}])
    
    if os.path.isfile(file_path):
        new_data.to_csv(file_path, mode='a', header=False, index=False)
    else:
        new_data.to_csv(file_path, index=False)
    return f"Case successfully saved to {file_path}"


medical_instructions = """
You are a Multi-Modal Medical AI Assistant. 
Your goal is to analyze patient cases based on text symptoms and MRI/scan descriptions.

CONSTRAINTS:
1. Provide structured insights (Summary, Analysis, Potential Next Steps).
2. DO NOT provide a final diagnosis or prescribe specific medications.
3. MANDATORY DISCLAIMER: You must end every response with: 
   'DISCLAIMER: This is not a medical diagnosis. Consult a doctor.'
4. If asked about hospitals, acknowledge you will search for them (even though tools aren't active yet).
"""


genai.configure(api_key=os.environ["GEM_KEY"])
llm = genai.GenerativeModel(tools=[search_hospitals,save_patient_case] ,model_name= 'gemini-flash-latest',system_instruction=medical_instructions)

app = FastAPI()

session={}
class ChatRequest(BaseModel):
    mss: str
    id: str="default"


@app.post("/chat")
async def chat(req: ChatRequest):
    try:
        if req.id not in session:
            session[req.id] = []
        
        history = session[req.id][-5:]

        chat=llm.start_chat(history=history, enable_automatic_function_calling=True)
        response = chat.send_message(content=req.mss) 

        session[req.id].append({"role": "user", "parts": [req.mss]})
        session[req.id].append({"role": "model", "parts": [response.text]})
        return {"status": "success", "agent_response": response.text}
        
    except Exception as e:
        print(f"DEBUG ERROR: {type(e).__name__}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
