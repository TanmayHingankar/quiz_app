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
*Interactive quiz taking<img width="1920" height="1080" alt="Screenshot 2026-01-10 185926" src="https://github.com/user-attachments/assets/0aafa644-99f0-43e9-9823-9bbc3ffe5bb4" />
 with scoring and answer feedback*
<img width="1920" height="1080" alt="Screenshot 2026-01-10 185816" src="https://github.com/user-attachments/assets/0d88facf-c825-43fb-a42d-33d22d0314a7" />
<img width="1920" height="1080" alt="Screenshot 2026-01-10 185816" src="https://github.com/user-attachments/assets/82e339d7-0cd3-45c3-8d65-656480ff7ff9" />
<img width="1920" height="1080" alt="Screenshot 2026-01-10 185837" src="https://github.com/user-attachments/assets/de139503-2c8e-43ac-9e30-6fd9fa4d439d" />
<img width="1920" height="1080" alt="Screenshot 2026-01-10 185512" src="https://github.com/user-attachments/assets/1ad05851-160a-476a-941e-48fcd078b0f0" />


## Submission Links
```
GitHub Rep<img width="1920<img width="1007" height="845" alt="Screenshot 2026-01-09 173312" src="https://github.com/user-attachments/assets/d75917d5-7bc6-4d7c-bca5-5aba7bb6f38d" />
" height="1080" alt="Screenshot 2026-01-10 185512" src="https://github.com/user-attachments<img width="1920" height="1080" alt="Screenshot 2026-01-10 182635" src="https://github.com/user-attachments/assets/2b36007e-970a-4ea8-a0ca-03b8a8cb1b13" />
/assets/b8a3ec33-6c44-4be1-8d70-b26d9e3c07e0" />
ository: ht<img width="1920" height="1080" alt="Screenshot 2026-01-10 185852" src="https://github.com/user-at<img width="1920" height="1080" alt="Screenshot 2026-01-10 185816" src="https://github.com/user-attachments/assets/3bf26103-6cc7-45e3-88c4-be6d3d5e9b84" />
tachments/assets/40b727c8-5855-43a4-ad11-b6ae494e3402" />
tps://github.com/your-username/wiki-<img width="1920" height="1080" alt="Screenshot 2026-01-10 185837" src="https://github.com/user-attachments/assets/d0418f7e-e118-44a4-b987-14a73e58bb78" />
quiz-app
Deployed App: https://wiki-quiz-app.vercel.app
Screen Recording: https://drive.google.com/your-screen-recording-link
```

## License
MIT License
