import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Analytics.css';

const Analytics = () => {
  const [surveys, setSurveys] = useState([]);
  const [selectedSurveyId, setSelectedSurveyId] = useState('');
  const [responses, setResponses] = useState([]);
  const [loadingSurveys, setLoadingSurveys] = useState(false);
  const [loadingResponses, setLoadingResponses] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSurveys = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No auth token found');
        return;
      }

      try {
        setLoadingSurveys(true);
        const res = await axios.get('http://127.0.0.1:5000/api/surveys/mine', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSurveys(res.data);
        setError('');
      } catch (err) {
        console.error('Error fetching user surveys:', err);
        setError('Failed to fetch surveys');
      } finally {
        setLoadingSurveys(false);
      }
    };

    fetchSurveys();
  }, []);

  useEffect(() => {
    if (!selectedSurveyId) return;

    const fetchResponses = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No auth token found');
        return;
      }

      try {
        setLoadingResponses(true);
        const res = await axios.get(`http://127.0.0.1:5000/api/responses/${selectedSurveyId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResponses(res.data);
        setError('');
      } catch (err) {
        console.error('Error fetching survey responses:', err);
        setError('Failed to fetch responses');
      } finally {
        setLoadingResponses(false);
      }
    };

    fetchResponses();
  }, [selectedSurveyId]);

  return (
    <div className="analytics-page">
      <div className="analytics-container">
        <h1 className="analytics-title">Analytics</h1>
        <p className="center">Your Surveys:</p>

        {loadingSurveys && <p className="analytics-loading">Loading surveys...</p>}
        {error && <p className="analytics-error">{error}</p>}

        <div className="survey-list">
          {surveys.map((survey) => (
            <button
              key={survey._id}
              className={`survey-item ${selectedSurveyId === survey._id ? 'selected' : ''}`}
              onClick={() => setSelectedSurveyId(survey._id)}
            >
              {survey.name}
            </button>
          ))}
        </div>

        {loadingResponses && <p className="analytics-loading">Loading responses...</p>}

        {responses.length > 0 && (
          <div className="response-section">
            <h3 className="response-title">Responses</h3>
            {responses.map((response, idx) => (
              <pre key={idx} className="response-block">
                {JSON.stringify(response, null, 2)}
              </pre>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
