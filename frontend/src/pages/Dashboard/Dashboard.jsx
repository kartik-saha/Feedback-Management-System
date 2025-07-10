import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faChartBar,
  faUser,
  faBell
} from '@fortawesome/free-solid-svg-icons';

import './Dashboard.css';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';
import LoginModal from '../../components/LoginModal/LoginModal';

export default function Dashboard() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleSettingsClick = () => {
    if (isLoggedIn) {
      navigate('/settings');
    } else {
      setShowModal(true);
    }
  };

  return (
    <header className="dashboard-header">
      <div className="dashboard-container">
        <img
          className="logo-placeholder"
          onClick={() => navigate('/')}
        />

        <div className="search-bar">
          <input type="text" placeholder="Search..." />
        </div>

        <nav className="dashboard-buttons">
          <ThemeToggle />

          <button
            className="icon-btn"
            title="Notifications"
            onClick={() => navigate('/notifications')}
          >
            <FontAwesomeIcon icon={faBell} />
          </button>

          <button
            className="icon-btn"
            title="Create Survey"
            onClick={() => navigate('/create')}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>

          <button
            className="icon-btn"
            title="Analytics"
            onClick={() => navigate('/analytics')}
          >
            <FontAwesomeIcon icon={faChartBar} />
          </button>

          <button
            className="icon-btn"
            title="User Settings"
            onClick={handleSettingsClick}
          >
            <FontAwesomeIcon icon={faUser} />
          </button>
        </nav>
      </div>

      {showModal && <LoginModal onClose={() => setShowModal(false)} />}
    </header>
  );
}
