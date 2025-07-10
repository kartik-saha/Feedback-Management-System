import { useEffect, useState } from 'react';
import './UserSettings.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

export default function UserSettings() {
  const [userData, setUserData] = useState({ username: '', email: '', password: '' });
  const [editingField, setEditingField] = useState(null);

  const [editValues, setEditValues] = useState({
    newUsername: '',
    newEmail: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('http://localhost:5000/api/user/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setUserData(data);
        } else {
          console.error(data.message || data.error);
        }
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      }
    }

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setEditValues({ ...editValues, [e.target.name]: e.target.value });
  };

  const toggleEdit = (field) => {
    setEditingField(editingField === field ? null : field);
    setEditValues({
      newUsername: '',
      newEmail: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleSave = async (field) => {
    if (field === 'password' && editValues.newPassword !== editValues.confirmPassword) {
      return alert('New passwords do not match');
    }

    const payload = {
      currentPassword: editValues.currentPassword,
    };

    if (field === 'username') payload.newUsername = editValues.newUsername;
    if (field === 'email') payload.newEmail = editValues.newEmail;
    if (field === 'password') payload.newPassword = editValues.newPassword;

    try {
      const res = await fetch('http://localhost:5000/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');

      alert(data.message || 'Updated successfully');
      setEditingField(null);
      window.location.reload(); // Or refetch the data instead
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="settings-container">
      <h1>User Settings</h1>

      {/* Username */}
      <div className="settings-block">
        <div className="settings-row">
          <label>Username:</label>
          <span>
            {userData.username}
            <button className="icon-btn" onClick={() => toggleEdit('username')}>
              <FontAwesomeIcon icon={faEdit} />
            </button>
          </span>
        </div>
        {editingField === 'username' && (
          <div className="edit-form">
            <input
              type="text"
              name="newUsername"
              placeholder="New Username"
              value={editValues.newUsername}
              onChange={handleChange}
            />
            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              value={editValues.currentPassword}
              onChange={handleChange}
            />
            <button className="save-btn" onClick={() => handleSave('username')}>
              Save Username
            </button>
          </div>
        )}
      </div>

      {/* Email */}
      <div className="settings-block">
        <div className="settings-row">
          <label>Email:</label>
          <span>
            {userData.email}
            <button className="icon-btn" onClick={() => toggleEdit('email')}>
              <FontAwesomeIcon icon={faEdit} />
            </button>
          </span>
        </div>
        {editingField === 'email' && (
          <div className="edit-form">
            <input
              type="email"
              name="newEmail"
              placeholder="New Email"
              value={editValues.newEmail}
              onChange={handleChange}
            />
            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              value={editValues.currentPassword}
              onChange={handleChange}
            />
            <button className="save-btn" onClick={() => handleSave('email')}>
              Save Email
            </button>
          </div>
        )}
      </div>

      {/* Password */}
      <div className="settings-block">
        <div className="settings-row">
          <label>Password:</label>
          <span>
            ••••••••
            <button className="icon-btn" onClick={() => toggleEdit('password')}>
              <FontAwesomeIcon icon={faEdit} />
            </button>
          </span>
        </div>
        {editingField === 'password' && (
          <div className="edit-form">
            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              value={editValues.currentPassword}
              onChange={handleChange}
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={editValues.newPassword}
              onChange={handleChange}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={editValues.confirmPassword}
              onChange={handleChange}
            />
            <button className="save-btn" onClick={() => handleSave('password')}>
              Save Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
