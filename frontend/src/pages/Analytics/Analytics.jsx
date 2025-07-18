import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Analytics.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faTrash } from '@fortawesome/free-solid-svg-icons';
import { showSuccess } from '../../components/Toast/Toast';

const Analytics = () => {
  const [surveys, setSurveys] = useState([]);
  const [loadingSurveys, setLoadingSurveys] = useState(false);
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

  const handleCopyLink = (surveyId) => {
    const link = `${window.location.origin}/survey/${surveyId}`;
    navigator.clipboard.writeText(link);
    showSuccess('Link copied to clipboard!');
  };

  const handleOpenResults = (surveyId) => {
    const resultUrl = `/analytics/survey/${surveyId}`;
    window.open(resultUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDeleteSurvey = async (surveyId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No auth token found');
      return;
    }

    const deleteUrl = `http://127.0.0.1:5000/api/surveys/${surveyId}`;
    console.log('🧪 Attempting to delete survey');
    console.log('➡️ surveyId:', surveyId);
    console.log('➡️ DELETE URL:', deleteUrl);

    try {
      const res = await axios.delete(deleteUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('✅ Server response on delete:', res.data);

      setSurveys((prev) => prev.filter((survey) => survey._id !== surveyId));
      showSuccess('Survey deleted successfully!');
    } catch (err) {
      console.error('❌ Error deleting survey:', err);
      if (err.response) {
        console.log('📡 Server responded with:', err.response.status, err.response.data);
      } else {
        console.log('📡 No response from server. Error:', err.message);
      }
      setError('Failed to delete survey');
    }
  };

  return (
    <div className="analytics-page">
      <div className="analytics-container">
        <h1 className="analytics-title">Analytics</h1>
        <p className="center">Your Surveys:</p>

        {loadingSurveys && <p className="analytics-loading">Loading surveys...</p>}
        {error && <p className="analytics-error">{error}</p>}

        <div className="survey-list">
          {surveys.map((survey) => (
            <div key={survey._id} className="survey-item">
              <button
                className="survey-name-btn"
                onClick={() => handleOpenResults(survey._id)}
              >
                {survey.name}
              </button>
              <button
                className="icon-btn copy-btn"
                onClick={() => handleDeleteSurvey(survey._id)}
                title="Delete survey"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <button
                className="icon-btn copy-btn"
                onClick={() => handleCopyLink(survey._id)}
                title="Copy share link"
              >
                <FontAwesomeIcon icon={faCopy} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
