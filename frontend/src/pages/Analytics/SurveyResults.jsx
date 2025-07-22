import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './SurveyResults.css';

const SurveyResults = () => {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState({});

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
        console.error('Error loading data:', err);
        setError('Failed to load survey or responses');
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyAndResponses();
  }, [id]);

  const toggleExpanded = (index) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const getStatsWithUsers = (index, type, options) => {
    const counts = {};
    const userMap = {};

    if (type === 'checkboxes') {
      responses.forEach((r) => {
        const selected = Array.isArray(r.answers[index]) ? r.answers[index] : [];
        selected.forEach((opt) => {
          counts[opt] = (counts[opt] || 0) + 1;
          userMap[opt] = userMap[opt] || [];
          userMap[opt].push(r.username);
        });
      });
    } else {
      responses.forEach((r) => {
        const answer = r.answers[index];
        if (answer) {
          counts[answer] = (counts[answer] || 0) + 1;
          userMap[answer] = userMap[answer] || [];
          userMap[answer].push(r.username);
        }
      });
    }

    return options.map((opt) => ({
      label: opt,
      count: counts[opt] || 0,
      users: userMap[opt] || []
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
                {getStatsWithUsers(index, segment.type, segment.options).map((opt, i) => {
                  const toggleKey = `${index}-${i}`;
                  return (
                    <div key={i} className="results-bar-with-users">
                      <div
                        className="bar-header"
                        onClick={() => {
                          if (opt.users.length > 0) toggleExpanded(toggleKey);
                        }}
                      >
                        <span>{opt.label}</span>
                        <div className="bar-track">
                          <div
                            className="bar-fill"
                            style={{
                              width: `${(opt.count / responses.length) * 100}%`
                            }}
                          />
                          <span className="bar-label">
                            {opt.count} responses
                            {opt.users.length > 0 && (
                              <span className={`dropdown-arrow ${expanded[toggleKey] ? 'open' : ''}`}>
                                ▼
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                      <ul className={`user-list ${expanded[toggleKey] ? 'open' : ''}`}>
                        {opt.users.map((user, idx) => (
                          <li key={idx}>{user}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-response-block">
                <p className="text-response-count">
                  {responses.filter(r => r.answers[index]?.trim()).length} responses
                </p>
                {responses.map((r, i) => (
                  <div key={i} className="text-response">
                    <strong>{r.username}: </strong>
                    {r.answers[index]?.trim() || '[No response]'}
                  </div>
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
