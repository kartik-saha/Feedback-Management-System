// src/pages/Home/Home.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Added
import './Home.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebookF,
  faTwitter,
  faLinkedinIn,
  faWhatsapp,
  faInstagram,
  faSnapchatGhost,
} from '@fortawesome/free-brands-svg-icons';

import { useAuth } from '../../context/AuthContext';
import LoginModal from '../../components/LoginModal/LoginModal';
import GraphCanvas from './GraphCanvas';

const Home = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate(); // ✅ Added
  const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState('login');

  const icons = [
    faFacebookF,
    faTwitter,
    faLinkedinIn,
    faWhatsapp,
    faInstagram,
    faSnapchatGhost,
  ];

  return (
    <div className="home-container">
      <section className="top-banner">
        <h1 className="app-name">SurveySphere</h1>

        {!isLoggedIn ? (
          <p>
            <span
              className="link-like cta-text"
              onClick={() => {
                setModalTab('login');
                setShowModal(true);
              }}
            >
              Login
            </span>{' '}
            to get started. Don’t have an account?{' '}
            <span
              className="link-like cta-text"
              onClick={() => {
                setModalTab('register');
                setShowModal(true);
              }}
            >
              Sign up
            </span>
            .
          </p>
        ) : (
          <p>
            <span
              className="link-like cta-text"
              onClick={() => navigate('/create')}
            >
              Create a New Survey
            </span>
          </p>
        )}
      </section>

      <section className="section">
        <GraphCanvas type="bar" />
        <div className="text-content left">
          <h2>Create Surveys</h2>
          <p>
            Design powerful, customizable surveys with multiple question types to suit your research or feedback goals.
          </p>
        </div>
      </section>

      <section className="section no-graph icon-tiles">
        <div className="icon-grid">
          {[...Array(120)].map((_, i) => (
            <FontAwesomeIcon key={i} icon={icons[i % icons.length]} className="icon-tile" />
          ))}
        </div>
        <div className="text-content center">
          <h2>Share with Anyone</h2>
          <p>
            Send your surveys instantly through links or email. No login required for your participants—simple and seamless.
          </p>
        </div>
      </section>

      <section className="section">
        <GraphCanvas type="line" />
        <div className="text-content right">
          <h2>Analyze Results</h2>
          <p>
            Interpret data through visualizations that highlight trends, patterns, and outliers across responses.
          </p>
        </div>
      </section>

      {showModal && <LoginModal onClose={() => setShowModal(false)} initialTab={modalTab} />}
    </div>
  );
};

export default Home;
