// frontend/src/pages/ThemeToggle/ThemeToggle.jsx
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <label className="theme-toggle" title="Toggle theme">
      <input
        type="checkbox"
        checked={darkMode}
        onChange={() => setDarkMode(!darkMode)}
      />
      <span className="slider">
        <span className="knob">
          <FontAwesomeIcon icon={darkMode ? faMoon : faSun} className="icon" />
        </span>
      </span>
    </label>
  );
}
