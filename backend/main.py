import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Text, JSON, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from .scraper import scrape_wikipedia
from .llm import generate_quiz_and_topics
import json

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/quizapp")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Quiz(Base):
    __tablename__ = "quizzes"
    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, unique=True, index=True)
    title = Column(String)
    summary = Column(Text)
    key_entities = Column(JSON)
    sections = Column(JSON)
    quiz = Column(JSON)
    related_topics = Column(JSON)
    raw_html = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origins=["*"]
)

class QuizRequest(BaseModel):
    url: str

@app.post("/generate-quiz")
def generate_quiz(request: QuizRequest):
    db = SessionLocal()
    try:
        # Check if already exists
        existing = db.query(Quiz).filter(Quiz.url == request.url).first()
        if existing:
            return {
                "id": existing.id,
                "url": existing.url,
                "title": existing.title,
                "summary": existing.summary,
                "key_entities": existing.key_entities,
                "sections": existing.sections,
                "quiz": existing.quiz,
            "related_topics": existing.related_topics,
            "created_at": existing.created_at.isoformat() if existing.created_at else None
        }

        # Scrape
        scraped = scrape_wikipedia(request.url)
        if not scraped:
            raise HTTPException(status_code=400, detail="Failed to scrape URL. Please check if it's a valid Wikipedia URL.")

        # Generate quiz
        quiz_data = generate_quiz_and_topics(scraped['content'], scraped['sections'])
        if not quiz_data:
            raise HTTPException(status_code=500, detail="Failed to generate quiz. Please try again.")

        # Store
        quiz_obj = Quiz(
            url=request.url,
            title=scraped['title'],
            summary=scraped['summary'],
            key_entities=scraped['key_entities'],
            sections=scraped['sections'],
            quiz=quiz_data['quiz'],
            related_topics=quiz_data['related_topics'],
            raw_html=scraped['raw_html']
        )
        db.add(quiz_obj)
        db.commit()
        db.refresh(quiz_obj)

        return {
            "id": quiz_obj.id,
            "url": quiz_obj.url,
            "title": quiz_obj.title,
            "summary": quiz_obj.summary,
            "key_entities": quiz_obj.key_entities,
            "sections": quiz_obj.sections,
            "quiz": quiz_obj.quiz,
            "related_topics": quiz_obj.related_topics,
            "created_at": quiz_obj.created_at.isoformat() if quiz_obj.created_at else None
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@app.get("/quizzes")
def get_quizzes():
    db = SessionLocal()
    try:
        quizzes = db.query(Quiz).all()
        return [{"id": q.id, "url": q.url, "title": q.title, "created_at": q.created_at.isoformat() if q.created_at else None} for q in quizzes]
    finally:
        db.close()

@app.get("/quiz/{quiz_id}")
def get_quiz(quiz_id: int):
    db = SessionLocal()
    try:
        quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        return {
            "id": quiz.id,
            "url": quiz.url,
            "title": quiz.title,
            "summary": quiz.summary,
            "key_entities": quiz.key_entities,
            "sections": quiz.sections,
            "quiz": quiz.quiz,
            "related_topics": quiz.related_topics,
            "created_at": quiz.created_at.isoformat() if quiz.created_at else None
        }
    finally:
        db.close()
