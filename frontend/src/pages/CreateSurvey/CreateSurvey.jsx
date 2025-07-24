import React, { useEffect, useState } from 'react';
import './CreateSurvey.css';
import { showSuccess, showError } from '../../components/Toast/Toast';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function CreateSurvey() {
  const [surveyTitle, setSurveyTitle] = useState('Untitled Survey');
  const [questions, setQuestions] = useState([]);
  const [shareLink, setShareLink] = useState('');
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState('');
  const [hoveredStars, setHoveredStars] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) setUsername(data.username);
      } catch (err) {
        console.error('Failed to fetch user info', err);
      }
    };

    fetchUser();
  }, []);

  const addSegment = () => {
    const newQuestion = {
      id: Date.now(),
      type: 'short-answer',
      title: '',
      description: '',
      options: [''],
      required: false,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id, key, value) => {
    const updated = questions.map((q) =>
      q.id === id ? { ...q, [key]: value } : q
    );
    setQuestions(updated);
  };

  const updateOption = (qId, index, value) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? {
              ...q,
              options: q.options.map((opt, i) => (i === index ? value : opt)),
            }
          : q
      )
    );
  };

  const addOption = (qId) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId ? { ...q, options: [...q.options, ''] } : q
      )
    );
  };

  const handleTypeChange = (id, newType) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              type: newType,
              options:
                newType === 'multiple-choice' || newType === 'checkboxes'
                  ? ['']
                  : [],
              required: newType !== 'text' ? q.required ?? false : false,
            }
          : q
      )
    );
  };

  const handleSaveSurvey = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/api/surveys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: surveyTitle, segments: questions }),
      });

      const data = await response.json();
      if (response.ok) {
        const link = `${window.location.origin}/survey/${data.surveyId}`;
        setShareLink(link);
        showSuccess('Survey saved successfully!');
      } else {
        showError(data.message || 'Failed to save survey.');
      }
    } catch (err) {
      console.error(err);
      showError('Error saving survey.');
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    showSuccess('Link copied to clipboard!');
  };

  return (
    <div className="page-content">
      <div className="survey-header survey-container">
        <h1 className="survey-page-title">Create Survey</h1>
        <input
          type="text"
          value={surveyTitle}
          onChange={(e) => setSurveyTitle(e.target.value)}
          className="survey-title-input"
          placeholder="Survey Title"
        />
        {username && <div className="survey-creator-name">- {username}</div>}
      </div>

      <div className="modal survey-builder survey-container">
        <div className="modal-form form-fields">
          {questions.map((q) => (
            <div key={q.id} className="question-block">
              <select
                value={q.type}
                onChange={(e) => handleTypeChange(q.id, e.target.value)}
              >
                <option value="short-answer">Short Answer</option>
                <option value="paragraph">Paragraph</option>
                <option value="multiple-choice">Multiple Choice</option>
                <option value="checkboxes">Checkboxes</option>
                <option value="rating-feedback">Feedback</option>
                <option value="text">Text Block (No Answer)</option>
              </select>

              {q.type !== 'text' && (
                <input
                  type="text"
                  placeholder="Segment Title"
                  value={q.title}
                  onChange={(e) => updateQuestion(q.id, 'title', e.target.value)}
                />
              )}

              <textarea
                placeholder="Segment Description"
                value={q.description}
                onChange={(e) => updateQuestion(q.id, 'description', e.target.value)}
              />

              {q.type === 'short-answer' && (
                <input type="text" disabled placeholder="Short answer text" />
              )}

              {q.type === 'paragraph' && (
                <textarea disabled placeholder="Long answer text" />
              )}

              {(q.type === 'multiple-choice' || q.type === 'checkboxes') &&
                q.options.map((option, index) => (
                  <div key={index} className="option-input">
                    <input
                      type={q.type === 'multiple-choice' ? 'radio' : 'checkbox'}
                      disabled
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(q.id, index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                  </div>
                ))}

              {(q.type === 'multiple-choice' || q.type === 'checkboxes') && (
                <button
                  type="button"
                  className="add-option-btn"
                  onClick={() => addOption(q.id)}
                >
                  + Add Option
                </button>
              )}

              {q.type === 'rating-feedback' && (
                <div className="rating-preview-block">
                  <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span
                        key={n}
                        className="star-wrapper"
                        onMouseEnter={() => setHoveredStars(n)}
                        onMouseLeave={() => setHoveredStars(null)}
                      >
                        <i className="fa fa-star far star-back"></i>
                        <i
                          className={`fa fa-star fas star-front ${
                            hoveredStars >= n ? 'visible' : ''
                          }`}
                        ></i>
                      </span>
                    ))}
                  </div>
                  <textarea
                    disabled
                    placeholder="Feedback..."
                    className="rating-feedback-box"
                  />
                </div>
              )}

              {q.type !== 'text' && (
                <div className="required-toggle">
                  <span>Required</span>
                  <label className="survey-switch">
                    <input
                      type="checkbox"
                      checked={q.required || false}
                      onChange={(e) =>
                        updateQuestion(q.id, 'required', e.target.checked)
                      }
                    />
                    <span className="survey-slider round"></span>
                  </label>
                </div>
              )}
            </div>
          ))}

          <button type="button" onClick={addSegment} className="save-btn">
            + Add Segment
          </button>

          <div className="save-share">
            {!shareLink ? (
              <button
                className="save-btn centered-btn"
                onClick={handleSaveSurvey}
                disabled={saving}
              >
                {saving ? 'Saving...' : <i className="fas fa-save"></i>}
              </button>
            ) : (
              <button className="save-btn centered-btn" onClick={handleCopyLink}>
                {shareLink}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
