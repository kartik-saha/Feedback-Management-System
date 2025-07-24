import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faChartBar,
  faUser,
  faBell,
  faRightFromBracket
} from '@fortawesome/free-solid-svg-icons';

import './Dashboard.css';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';
import LoginModal from '../../components/LoginModal/LoginModal';

// ✅ Just keep toast trigger
import { toast } from 'react-toastify';

export default function Dashboard() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleSettingsClick = () => {
    if (isLoggedIn) {
      navigate('/settings');
    } else {
      setShowModal(true);
    }
  };

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
    navigate('/');
  };

  return (
    <header className="dashboard-header">
      <div className="dashboard-container">
        <img
          className="logo-placeholder"
          onClick={() => navigate('/')}
          alt="logo"
        />

        <nav className="dashboard-buttons">
          <ThemeToggle />

          {isLoggedIn && (
            <>
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
                title="Log Out"
                onClick={handleLogout}
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
              </button>
            </>
          )}

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
