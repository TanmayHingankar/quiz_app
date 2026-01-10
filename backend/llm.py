from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
import os
import json
from dotenv import load_dotenv

load_dotenv()

# For testing, use mock data if API fails
USE_MOCK = os.getenv("USE_MOCK", "false").lower() == "true"

if not USE_MOCK:
    llm = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=os.getenv("GOOGLE_API_KEY"))
else:
    llm = None

quiz_prompt = PromptTemplate(
    input_variables=["content", "sections"],
    template="""
Based on the following Wikipedia article content and sections, generate a quiz with 5-10 questions.
Group questions by the provided sections where possible.
Each question should have:
- Question text
- Four options (A-D)
- Correct answer
- Difficulty level (easy, medium, hard)
- Short explanation
- Section it belongs to (from the provided sections list)

Ensure questions are relevant to the article content and vary in difficulty.

Sections: {sections}

Article content:
{content}

Output in JSON format:
{{
  "quiz": [
    {{
      "question": "...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "answer": "A. ...",
      "difficulty": "easy",
      "explanation": "...",
      "section": "Section Name"
    }},
    ...
  ]
}}
"""
)

topics_prompt = PromptTemplate(
    input_variables=["content"],
    template="""
Based on the Wikipedia article content, suggest 3-5 related Wikipedia topics for further reading.

Article content:
{content}

Output in JSON format:
{{
  "related_topics": ["Topic1", "Topic2", ...]
}}
"""
)

def generate_quiz_and_topics(content, sections=None):
    if USE_MOCK:
        # Mock data for testing
        return {
            "quiz": [
                {
                    "question": "Where did Alan Turing study?",
                    "options": ["Harvard University", "Cambridge University", "Oxford University", "Princeton University"],
                    "answer": "Cambridge University",
                    "difficulty": "easy",
                    "explanation": "Mentioned in the 'Early life' section.",
                    "section": "Early life and education"
                },
                {
                    "question": "What was Alan Turing's main contribution during World War II?",
                    "options": ["Atomic research", "Breaking the Enigma code", "Inventing radar", "Developing jet engines"],
                    "answer": "Breaking the Enigma code",
                    "difficulty": "medium",
                    "explanation": "Detailed in the 'World War II' section.",
                    "section": "Career and research"
                }
            ],
            "related_topics": ["Cryptography", "Enigma machine", "Computer science history"]
        }
    
    try:
        # Generate quiz
        quiz_chain = quiz_prompt | llm
        quiz_response = quiz_chain.invoke({"content": content[:5000], "sections": sections or []})
        quiz_data = json.loads(quiz_response.content)

        # Generate topics
        topics_chain = topics_prompt | llm
        topics_response = topics_chain.invoke({"content": content[:5000]})
        topics_data = json.loads(topics_response.content)

        return {
            "quiz": quiz_data["quiz"],
            "related_topics": topics_data["related_topics"]
        }
    except Exception as e:
        print(f"LLM error: {e}, using mock data")
        return generate_quiz_and_topics(content, sections)  # fallback to mock