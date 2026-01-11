# Wiki Quiz App

## Project Overview
Wiki Quiz App is an AI-powered web application that generates interactive quizzes from Wikipedia articles. Users can input any Wikipedia URL, and the app automatically scrapes the content, uses Google's Gemini AI to create multiple-choice questions with varying difficulty levels, and provides explanations and related topics for further learning.

## Tech Stack
- **Frontend**: React with Tailwind CSS for modern, responsive UI
- **Backend**: FastAPI (Python) for REST API
- **Database**: SQLite for local development, PostgreSQL for production
- **LLM**: Google Gemini via LangChain for quiz generation
- **Scraping**: BeautifulSoup for Wikipedia content extraction
- **Deployment**: Vercel (frontend), Render (backend)

## Features
- **Wikipedia URL Quiz Generation**: Input any Wikipedia URL to generate a custom quiz
- **AI-Generated MCQs**: Multiple-choice questions with 4 options, difficulty levels (easy/medium/hard), and detailed explanations
- **Related Topics Suggestion**: AI-recommended related Wikipedia topics for further reading
- **History Tab**: View all previously generated quizzes with timestamps
- **Take Quiz Mode**: Interactive quiz-taking with scoring and answer feedback
- **Section-wise Organization**: Questions grouped by article sections with collapsible UI
- **Caching System**: Prevents duplicate scraping of the same URL
- **Raw HTML Storage**: Stores scraped content for reference
- **Error Handling**: Comprehensive validation and user-friendly error messages
- **Responsive Design**: Works on desktop and mobile devices

## Local Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
uvicorn main:app --reload
```
Backend will run on `http://localhost:8000`

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env if needed (API URL)
npm start
```
Frontend will run on `http://localhost:3000`

### Environment Variables

#### Backend (.env)
```
DATABASE_URL=sqlite:///./quizapp.db
GOOGLE_API_KEY=your_google_gemini_api_key_here
USE_MOCK=false
```

#### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8000
```

## API Endpoints

### POST /generate-quiz
Generate a quiz from a Wikipedia URL.
```json
{
  "url": "https://en.wikipedia.org/wiki/Alan_Turing"
}
```
Returns quiz data with questions, answers, and metadata.

### GET /quizzes
Retrieve list of all generated quizzes.
Returns array of quiz summaries with id, title, url, created_at.

### GET /quiz/{id}
Get detailed quiz information by ID.
Returns full quiz data including questions and answers.

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variable: `REACT_APP_API_URL=https://your-backend-render-url`
4. Deploy

### Backend (Render)
1. Create new Web Service on Render
2. Connect GitHub repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Set environment variables:
   - `DATABASE_URL` (PostgreSQL connection string)
   - `GOOGLE_API_KEY`
   - `USE_MOCK=false`

## Screenshots

### Quiz Generation Page
![Quiz Generation Page](screenshots/quiz_generation.png)
*Input Wikipedia URL, preview title, generate quiz with loading states*

### History Page
![History Page](screenshots/history_page.png)
*Table view of all generated quizzes with dates and actions*

### Quiz Details Modal
![Quiz Details Modal](screenshots/quiz_modal.png)
*Full quiz display in modal with section-wise organization*

### Take Quiz Mode
![Take Quiz Mode](screenshots/take_quiz.png)
*Interactive quiz taking with scoring and answer feedback*

## Submission Links
```
GitHub Repository: https://github.com/your-username/wiki-quiz-app
Deployed App: https://wiki-quiz-app.vercel.app
Screen Recording: https://drive.google.com/your-screen-recording-link
```

## License
MIT License
