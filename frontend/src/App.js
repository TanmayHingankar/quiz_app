import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdBook, MdHistory, MdPlayArrow, MdCheck, MdClose, MdEmojiEvents } from 'react-icons/md';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [activeTab, setActiveTab] = useState('generate');
  const [url, setUrl] = useState('');
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewTitle, setPreviewTitle] = useState('');
  const [urlError, setUrlError] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [takeQuizMode, setTakeQuizMode] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [expandedSections, setExpandedSections] = useState({});

  const validateUrl = (url) => {
    const wikiRegex = /^https:\/\/en\.wikipedia\.org\/wiki\/.+/;
    return wikiRegex.test(url);
  };

  const previewArticle = async () => {
    if (!validateUrl(url)) {
      setUrlError('Please enter a valid Wikipedia URL');
      return;
    }
    setUrlError('');
    setLoading(true);
    try {
      // Simple fetch to get title
      const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${url.split('/').pop()}`);
      setPreviewTitle(response.data.title);
    } catch (error) {
      setUrlError('Could not fetch article title');
    }
    setLoading(false);
  };

  const generateQuiz = async () => {
    if (!validateUrl(url)) {
      setUrlError('Please enter a valid Wikipedia URL');
      return;
    }
    setUrlError('');
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/generate-quiz`, { url });
      setQuizData(response.data);
      setTakeQuizMode(false);
      setUserAnswers({});
      setQuizSubmitted(false);
      setScore(0);
      // Expand all sections by default
      const sections = {};
      response.data.sections.forEach(section => sections[section] = true);
      setExpandedSections(sections);
    } catch (error) {
      alert('Error generating quiz: ' + (error.response?.data?.detail || error.message));
    }
    setLoading(false);
  };

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/quizzes`);
      setQuizzes(response.data);
    } catch (error) {
      alert('Error fetching quizzes: ' + error.message);
    }
  };

  const fetchQuizDetails = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/quiz/${id}`);
      setSelectedQuiz(response.data);
      const sections = {};
      response.data.sections.forEach(section => sections[section] = true);
      setExpandedSections(sections);
    } catch (error) {
      alert('Error fetching quiz details: ' + error.message);
    }
  };

  const submitQuiz = () => {
    let correct = 0;
    quizData.quiz.forEach((q, i) => {
      if (userAnswers[i] === q.answer) correct++;
    });
    setScore(correct);
    setQuizSubmitted(true);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    if (activeTab === 'history') {
      fetchQuizzes();
    }
  }, [activeTab]);

  const currentData = selectedQuiz || quizData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 flex items-center justify-center gap-3">
          <MdBook className="text-blue-600" />
          Wiki Quiz App
        </h1>

        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-md p-1 flex">
            <button
              onClick={() => setActiveTab('generate')}
              className={`px-6 py-3 rounded-md font-medium transition-all flex items-center gap-2 ${
                activeTab === 'generate'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <MdBook />
              Generate Quiz
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 rounded-md font-medium transition-all flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <MdHistory />
              Past Quizzes
            </button>
          </div>
        </div>

        {activeTab === 'generate' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Wikipedia Article URL
              </label>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="https://en.wikipedia.org/wiki/Alan_Turing"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={previewArticle}
                  disabled={loading}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                >
                  Preview
                </button>
                <button
                  onClick={generateQuiz}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
                >
                  {loading ? 'Generating...' : 'Generate Quiz'}
                </button>
              </div>
              {urlError && <p className="text-red-600 mt-2">{urlError}</p>}
              {previewTitle && <p className="text-green-600 mt-2">Article: {previewTitle}</p>}
            </div>

            {currentData && <QuizDisplay data={currentData} takeQuizMode={takeQuizMode} setTakeQuizMode={setTakeQuizMode} userAnswers={userAnswers} setUserAnswers={setUserAnswers} quizSubmitted={quizSubmitted} submitQuiz={submitQuiz} score={score} expandedSections={expandedSections} toggleSection={toggleSection} />}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Past Quizzes</h2>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Title</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">URL</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quizzes.map(quiz => (
                    <tr key={quiz.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{quiz.title}</td>
                      <td className="px-4 py-3 text-sm text-blue-600 truncate max-w-xs">
                        <a href={quiz.url} target="_blank" rel="noopener noreferrer">{quiz.url}</a>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {quiz.created_at ? new Date(quiz.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => fetchQuizDetails(quiz.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {selectedQuiz && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-gray-800">Quiz Details</h3>
                    <button
                      onClick={() => setSelectedQuiz(null)}
                      className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  <div className="p-6">
                    <QuizDisplay data={selectedQuiz} takeQuizMode={false} expandedSections={expandedSections} toggleSection={toggleSection} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function QuizDisplay({ data, takeQuizMode, setTakeQuizMode, userAnswers, setUserAnswers, quizSubmitted, submitQuiz, score, expandedSections, toggleSection }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const groupQuestionsBySection = (questions, sections) => {
    const grouped = {};
    sections.forEach(section => {
      grouped[section] = questions.filter(q => q.section === section || !q.section);
    });
    return grouped;
  };

  const groupedQuestions = groupQuestionsBySection(data.quiz, data.sections);

  return (
    <div className="mt-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{data.title}</h2>
        {data.summary && <p className="text-gray-600 text-lg">{data.summary}</p>}
      </div>

      {data.quiz && data.quiz.length > 0 && (
        <div className="mb-6 flex justify-between items-center">
          <h3 className="text-2xl font-semibold text-gray-800">Quiz Questions</h3>
          {!takeQuizMode && (
            <button
              onClick={() => setTakeQuizMode(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <MdPlayArrow />
              Take Quiz
            </button>
          )}
          {takeQuizMode && !quizSubmitted && (
            <button
              onClick={submitQuiz}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Submit Quiz
            </button>
          )}
          {quizSubmitted && (
            <div className="flex items-center gap-2 text-lg font-semibold">
              <MdEmojiEvents className="text-yellow-500" />
              Score: {score}/{data.quiz.length}
            </div>
          )}
        </div>
      )}

      {data.sections && data.sections.map(section => (
        <div key={section} className="mb-6">
          <button
            onClick={() => toggleSection(section)}
            className="w-full text-left bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-lg font-medium text-gray-800 transition-colors flex justify-between items-center"
          >
            {section}
            <span className="text-gray-500">{expandedSections[section] ? '−' : '+'}</span>
          </button>
          {expandedSections[section] && (
            <div className="mt-4 space-y-4">
              {groupedQuestions[section]?.map((q, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-medium text-gray-800 flex-1">{q.question}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(q.difficulty)}`}>
                      {q.difficulty}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {q.options.map((option, idx) => {
                      const isSelected = userAnswers[i] === option;
                      const isCorrect = option === q.answer;
                      const isIncorrect = quizSubmitted && isSelected && !isCorrect;
                      return (
                        <label key={idx} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name={`question-${i}`}
                            value={option}
                            checked={isSelected}
                            onChange={() => setUserAnswers(prev => ({ ...prev, [i]: option }))}
                            disabled={!takeQuizMode || quizSubmitted}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className={`flex-1 p-2 rounded ${
                            quizSubmitted
                              ? isCorrect
                                ? 'bg-green-100 text-green-800'
                                : isIncorrect
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-50'
                              : 'hover:bg-gray-50'
                          }`}>
                            {option}
                            {quizSubmitted && isCorrect && <MdCheck className="inline ml-2 text-green-600" />}
                            {quizSubmitted && isIncorrect && <MdClose className="inline ml-2 text-red-600" />}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  {(!takeQuizMode || quizSubmitted) && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Correct Answer:</strong> <span className="text-green-700 font-medium">{q.answer}</span>
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        <strong>Explanation:</strong> {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {data.related_topics && data.related_topics.length > 0 && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Related Topics</h3>
          <div className="flex flex-wrap gap-2">
            {data.related_topics.map((topic, i) => (
              <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
