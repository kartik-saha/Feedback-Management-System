import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function SurveyAnalysis() {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const [surveyRes, responseRes] = await Promise.all([
          fetch(`http://localhost:5000/api/surveys/${id}`),
          fetch(`http://localhost:5000/api/surveys/${id}/responses`),
        ]);

        const surveyData = await surveyRes.json();
        const responseData = await responseRes.json();

        if (!surveyRes.ok || !responseRes.ok) throw new Error('Failed to load data');

        setSurvey(surveyData);
        setResponses(responseData);
      } catch (err) {
        console.error('Error loading analysis:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id]);

  const calculateStats = (segmentIndex) => {
    const values = responses.map((res) => res.answers[segmentIndex]);
    const type = survey.segments[segmentIndex].type;

    if (type === 'checkboxes') {
      const counts = {};
      values.flat().forEach((val) => {
        counts[val] = (counts[val] || 0) + 1;
      });
      return counts;
    }

    if (type === 'multiple-choice') {
      const counts = {};
      values.forEach((val) => {
        counts[val] = (counts[val] || 0) + 1;
      });
      return counts;
    }

    // For text answers, just show raw data or count
    return values;
  };

  if (loading) return <div className="analysis-container">Loading...</div>;

  return (
    <div className="analysis-container">
      <h1>Survey Analysis: {survey.name}</h1>

      {survey.segments.map((seg, index) => (
        <div key={index} className="analysis-segment">
          <h3>{seg.title || `Segment ${index + 1}`}</h3>
          <p>{seg.description}</p>

          {['multiple-choice', 'checkboxes'].includes(seg.type) ? (
            <ul>
              {Object.entries(calculateStats(index)).map(([opt, count]) => (
                <li key={opt}>
                  {opt}: <strong>{count}</strong> responses
                </li>
              ))}
            </ul>
          ) : (
            <ul>
              {calculateStats(index).map((val, i) => (
                <li key={i}>"{val}"</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
