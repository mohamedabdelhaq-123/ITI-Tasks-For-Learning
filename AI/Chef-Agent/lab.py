from langgraph.types import Checkpointer
from fastapi import HTTPException
# from openai import OpenAI
from pydantic import BaseModel
from fastapi import FastAPI
from langgraph.checkpoint.memory import MemorySaver 
from langgraph.prebuilt import create_react_agent

from langchain_openai import ChatOpenAI
# from langchain_classic.chains import ConversationChain
# from langchain_classic.memory import ConversationBufferMemory
# from langchain.agents import create_agent

import os
from dotenv import load_dotenv

load_dotenv() 

app = FastAPI()

llm = ChatOpenAI(api_key=os.getenv("KEY"), model="gpt-5-mini")


chefInstructions= """ You are a professional chef assistant.

Guide the user from ingredients to a final meal through a strict step-by-step flow. Never skip steps.

FLOW:
Step 1: Confirm ingredients  
Step 2: Identify possible cuisines/dishes  
Step 3: Suggest up to 3 options  
Step 4: Help user choose  
Step 5: Provide recipe (only after selection)

RULES:
- Ask for clarification if input is unclear  
- Use only confirmed ingredients (no hallucination)  
- Keep responses concise unless asked otherwise  
- Maintain context across conversation  

STYLE:
- Speak like a real chef (natural, confident)  
"""

class ChatInput(BaseModel):
    message: str
    creativity: float = 0.7  


@app.post("/chat")
async def chat(reqData:ChatInput):
    try:

        agent = create_react_agent(checkpointer=MemorySaver(), model=llm, tools=[], prompt=chefInstructions)

        config = {"configurable": {"thread_id": "user_1"}} 
        res=agent.invoke({"messages":[("user",reqData.message)]},config)
        return {"response":res["messages"][-1].content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))





#@app.get("/")
# async def test():
#     return {"message": "Hello World"}

# @app.get("/api")
# def hey():
#     return {"api":"MY API"}


# @app.post("/{val}")
# def chat(val):
#     return {"value":val}

# client=OpenAI(api_key=os.getenv("KEY"))   

# conv=ConversationChain(llm=llm,memory=ConversationBufferMemory())

# @app.post("/chat")
# async def chat(reqData):
#     try:
#         res=conv.run(reqData)
#         return {"response":res}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# # for one response only
# @app.post("/ask")
# async def ask(reqData):
#     try:
#         res=client.responses.create(
#             model="gpt-5-mini",
#             input=reqData
#         )
#         return {"response":res}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

