import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './SurveyResults.css';

const SurveyResults = () => {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSurveyAndResponses = async () => {
      try {
        const [surveyRes, responsesRes] = await Promise.all([
          fetch(`http://localhost:5000/api/surveys/${id}`),
          fetch(`http://localhost:5000/api/responses/${id}`)
        ]);

        if (!surveyRes.ok || !responsesRes.ok) {
          throw new Error('Failed to load data');
        }

        const surveyData = await surveyRes.json();
        const responsesData = await responsesRes.json();

        setSurvey(surveyData);
        setResponses(responsesData);
      } catch (err) {
        setError('Failed to load survey or responses');
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyAndResponses();
  }, [id]);

  const getStats = (index, type, options) => {
    const total = responses.length;
    const counts = {};

    if (type === 'checkboxes') {
      responses.forEach((r) => {
        const selected = r.answers?.[index] || [];
        selected.forEach((opt) => {
          counts[opt] = (counts[opt] || 0) + 1;
        });
      });
    } else {
      responses.forEach((r) => {
        const answer = r.answers?.[index];
        if (answer) counts[answer] = (counts[answer] || 0) + 1;
      });
    }

    return options.map((opt) => ({
      label: opt,
      count: counts[opt] || 0,
      percent: total > 0 ? Math.round((counts[opt] || 0) * 100 / total) : 0
    }));
  };

  if (loading) return <div className="survey-results-page">Loading...</div>;
  if (error) return <div className="survey-results-page error">{error}</div>;

  return (
    <div className="survey-results-page">
      <div className="survey-results-container">
        <h1 className="results-title">{survey.name}</h1>

        {survey.segments?.map((segment, index) => (
          <div key={index} className="segment-result">
            {segment.title && <h3>{segment.title}</h3>}
            {segment.description && <p>{segment.description}</p>}

            {(segment.type === 'multiple-choice' || segment.type === 'checkboxes') ? (
              <div className="results-options">
                {getStats(index, segment.type, segment.options).map((opt, i) => (
                  <div key={i} className="results-bar">
                    <span>{opt.label}</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${opt.percent}%` }} />
                      <span className="bar-label">{opt.percent}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-response-block">
                {responses.map((r, i) => (
                  <p key={i} className="text-response">{r.answers?.[index]}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SurveyResults;
