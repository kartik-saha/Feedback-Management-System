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

        console.log('Survey Responses:', responsesData);

        setSurvey(surveyData);
        setResponses(responsesData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load survey or responses');
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyAndResponses();
  }, [id]);

  const getStats = (index, type, options) => {
    const counts = {};

    if (type === 'checkboxes') {
      responses.forEach((r) => {
        const selected = Array.isArray(r[index]) ? r[index] : [];
        selected.forEach((opt) => {
          counts[opt] = (counts[opt] || 0) + 1;
        });
      });
    } else {
      responses.forEach((r) => {
        const answer = r[index];
        if (answer) {
          counts[answer] = (counts[answer] || 0) + 1;
        }
      });
    }

    return options.map((opt) => ({
      label: opt,
      count: counts[opt] || 0
    }));
  };

  if (loading) return <div className="view-page">Loading...</div>;
  if (error) return <div className="view-page error">{error}</div>;

  return (
    <div className="view-page">
      <div className="view-container">
        <h1 className="view-title">{survey?.name}</h1>
        <p className="response-count">Total Responses: {responses.length}</p>

        {survey.segments?.map((segment, index) => (
          <div key={index} className="view-segment">
            {segment.title && (
              <input
                type="text"
                className="segment-title"
                value={segment.title}
                disabled
              />
            )}
            {segment.description && (
              <textarea
                className="segment-description"
                value={segment.description}
                disabled
              />
            )}

            {(segment.type === 'multiple-choice' || segment.type === 'checkboxes') ? (
              <div className="results-options">
                {getStats(index, segment.type, segment.options).map((opt, i) => (
                  <div key={i} className="results-bar">
                    <span>{opt.label}</span>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${(opt.count / responses.length) * 100}%`
                        }}
                      />
                      <span className="bar-label">{opt.count} responses</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-response-block">
                {responses.map((r, i) => (
                  <p key={i} className="text-response">
                    {r[index] || '[No response]'}
                  </p>
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
