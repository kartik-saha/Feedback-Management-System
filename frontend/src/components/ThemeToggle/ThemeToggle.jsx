import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    const isDark = saved ? saved === 'dark' : true;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    return isDark;
  });

  const toggleTheme = () => {
    const nextTheme = darkMode ? 'light' : 'dark';

    // Prevent transition flicker
    document.documentElement.classList.add('no-transition');
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
    setDarkMode(!darkMode);

    requestAnimationFrame(() => {
      document.documentElement.classList.remove('no-transition');
    });
  };

  return (
    <label className="theme-toggle" title="Toggle theme">
      <input
        type="checkbox"
        checked={darkMode}
        onChange={toggleTheme}
      />
      <span className="slider">
        <span className="knob">
          <FontAwesomeIcon icon={darkMode ? faMoon : faSun} className="icon" />
        </span>
      </span>
    </label>
  );
}
