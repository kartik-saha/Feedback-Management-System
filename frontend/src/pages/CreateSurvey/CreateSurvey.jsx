import { useState } from 'react';
import './CreateSurvey.css';

export default function CreateSurvey() {
  const [surveyTitle, setSurveyTitle] = useState('Untitled Survey');
  const [questions, setQuestions] = useState([]);
  const [shareLink, setShareLink] = useState('');
  const [saving, setSaving] = useState(false);

  const addSegment = () => {
    const newQuestion = {
      id: Date.now(),
      type: 'short-answer',
      title: '',
      description: '',
      options: [''],
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
              options: q.options.map((opt, i) =>
                i === index ? value : opt
              ),
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
              options: newType === 'multiple-choice' || newType === 'checkboxes' ? [''] : [],
            }
          : q
      )
    );
  };

  const handleSaveSurvey = async () => {
    setSaving(true);
    try {
      const response = await fetch('http://localhost:5000/api/surveys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: surveyTitle, segments: questions }),
      });

      const data = await response.json();
      if (response.ok) {
        const link = `${window.location.origin}/survey/${data.surveyId}`;
        setShareLink(link);
      } else {
        alert(data.message || 'Failed to save survey.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving survey.');
    } finally {
      setSaving(false);
    }
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
                <option value="text">Text Block (No Answer)</option>
              </select>

              {q.type === 'text' && (
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
                onChange={(e) =>
                  updateQuestion(q.id, 'description', e.target.value)
                }
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
                      onChange={(e) =>
                        updateOption(q.id, index, e.target.value)
                      }
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
            </div>
          ))}

          <button type="button" onClick={addSegment} className="save-btn">
            + Add Segment
          </button>

          <div className="save-share">
            <button className="save-btn" onClick={handleSaveSurvey} disabled={saving}>
              {saving ? 'Saving...' : 'Save + Share'}
            </button>
            {shareLink && (
              <div className="share-link-box">
                <p>Share this link:</p>
                <input type="text" value={shareLink} readOnly />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
