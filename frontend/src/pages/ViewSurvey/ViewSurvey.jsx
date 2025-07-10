import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ViewSurvey.css';

export default function ViewSurvey() {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [responses, setResponses] = useState({});

  useEffect(() => {
    const originalTitle = document.title;

    const fetchSurvey = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/surveys/${id}`);
        if (!response.ok) throw new Error('Survey not found');
        const data = await response.json();
        setSurvey(data);
        document.title = data.name || 'Survey';
      } catch (err) {
        console.error('Error loading survey:', err);
        setError('Failed to load survey.');
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();

    return () => {
      document.title = originalTitle;
    };
  }, [id]);

  const handleChange = (segmentId, value) => {
    setResponses((prev) => ({ ...prev, [segmentId]: value }));
  };

  const handleCheckboxChange = (segmentId, option) => {
    setResponses((prev) => {
      const existing = prev[segmentId] || [];
      const updated = existing.includes(option)
        ? existing.filter((o) => o !== option)
        : [...existing, option];
      return { ...prev, [segmentId]: updated };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Responses:', responses);
    alert('Responses submitted (not actually saved in backend yet).');
  };

  if (loading) return <div className="view-page">Loading...</div>;
  if (error) return <div className="view-page error">{error}</div>;

  return (
    <div className="view-page">
      <form className="view-container" onSubmit={handleSubmit}>
        <h1 className="view-title">{survey.name}</h1>

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

            {segment.type === 'short-answer' && (
              <input
                type="text"
                className="view-input"
                placeholder="Your answer"
                value={responses[index] || ''}
                onChange={(e) => handleChange(index, e.target.value)}
              />
            )}

            {segment.type === 'paragraph' && (
              <textarea
                className="view-input"
                placeholder="Your answer"
                value={responses[index] || ''}
                onChange={(e) => handleChange(index, e.target.value)}
              />
            )}

            {segment.type === 'multiple-choice' &&
              segment.options?.map((opt, i) => (
                <div key={i} className="option-input">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={opt}
                    checked={responses[index] === opt}
                    onChange={() => handleChange(index, opt)}
                  />
                  <label>{opt}</label>
                </div>
              ))}

            {segment.type === 'checkboxes' &&
              segment.options?.map((opt, i) => (
                <div key={i} className="option-input">
                  <input
                    type="checkbox"
                    value={opt}
                    checked={responses[index]?.includes(opt) || false}
                    onChange={() => handleCheckboxChange(index, opt)}
                  />
                  <label>{opt}</label>
                </div>
              ))}
          </div>
        ))}

        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
}
