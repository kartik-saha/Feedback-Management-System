import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

import './LoginModal.css';

export default function LoginModal({ onClose, initialTab = 'login' }) {
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);
  const modalRef = useRef(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        login(); // ✅ updates context
        toast.success('Logged in successfully!');
        onClose();
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred during login.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const username = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const confirm = e.target[3].value;

    if (password !== confirm) {
      return toast.error('Passwords do not match');
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        login(); // ✅ updates context
        toast.success('Registration successful!');
        onClose();
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred during registration.');
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="modal-backdrop">
      <div className="modal" ref={modalRef}>
        <div className="modal-tabs">
          <button
            className={activeTab === 'login' ? 'active' : ''}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            className={activeTab === 'register' ? 'active' : ''}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>

        <div className="modal-content">
          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="modal-form">
              <div className="form-fields">
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Password" required />
              </div>
              <button type="submit">Log In</button>
              <p className="switch-tab">
                Don’t have an account?{' '}
                <span onClick={() => setActiveTab('register')}>Register here</span>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="modal-form">
              <div className="form-fields">
                <input type="text" placeholder="Username" required />
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Password" required />
                <input type="password" placeholder="Confirm Password" required />
              </div>
              <button type="submit">Register</button>
              <p className="switch-tab">
                Already have an account?{' '}
                <span onClick={() => setActiveTab('login')}>Login here</span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
