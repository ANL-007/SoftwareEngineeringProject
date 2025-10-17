/*
Manage input and UI state.
Handle both login and registration in one component.
Communicate with Django’s backend via Axios.
Pass the logged-in username to the parent (onLogin) for session management.
*/
import React, { useState } from 'react';
import '../styles/Login.css';
import axios from 'axios';

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState('');

  const calculateStrength = (pwd) => {
    let strength = 0;
    if (pwd.length > 0) strength = 1;
    if (pwd.length >= 6) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    if (pwd.length >= 12) strength++;
    return Math.min(strength, 5);
  };

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    if (isRegister) {
      const s = calculateStrength(pwd);
      setPasswordStrength(s);
      setStrengthLabel(strengthLevels[Math.max(0, s - 1)]?.label || '');
    } else {
      setPasswordStrength(0);
      setStrengthLabel('');
    }
  };

  const strengthLevels = [
    { label: 'Password too short', color: '#ff4d4d' },
    { label: 'Weak password', color: '#ff944d' },
    { label: 'Fair password', color: '#ffcc00' },
    { label: 'Good password', color: '#4da6ff' },
    { label: 'Strong password', color: '#33cc33' }
  ];

  const levelIndex = Math.max(0, Math.min(passwordStrength - 1, strengthLevels.length - 1));
  const currentLevel = strengthLevels[levelIndex] || { label: '', color: 'transparent' };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 🚫 Block weak passwords before register request
    if (isRegister && currentLevel.label !== 'Strong password') {
      setError('Please choose a stronger password before creating your account.');
      return;
    }

    try {
      if (isRegister) {
        const res = await axios.post('http://127.0.0.1:8000/api/register/', { username, email, password });
        if (res.data.success) {
          onLogin(username);
        } else {
          setError(res.data.error || 'Registration failed');
        }
      } else {
        const res = await axios.post('http://127.0.0.1:8000/api/login/', { username, password });
        if (res.data.success) {
          onLogin(username);
        } else {
          setError('Invalid username or password');
        }
      }
    } catch (err) {
      const backendErrors = err.response?.data?.error;
      if (Array.isArray(backendErrors)) {
        setError(backendErrors.join(' '));
      } else {
        setError(backendErrors || 'Something went wrong');
      }
    }
  };

  const debugVisible = false; // set true to debug live

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{isRegister ? 'Create Account' : 'StudyHub Login'}</h2>
        {error && <p className="error">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        {isRegister && (
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        )}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          required
        />

        {isRegister && (
          <div className="password-strength">
            <div className="strength-bar-background">
              <div
                className="strength-bar"
                style={{
                  width: `${(passwordStrength / 5) * 100}%`,
                  backgroundColor: currentLevel.color,
                }}
              ></div>
            </div>
            <p
              className="strength-label"
              style={{ color: currentLevel.color, fontWeight: 600, marginTop: '5px' }}
            >
              {password.length > 0 ? currentLevel.label : 'Start typing a password'}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isRegister && currentLevel.label !== 'Strong password'}
          style={{
            opacity: isRegister && currentLevel.label !== 'Strong password' ? 0.6 : 1,
            cursor: isRegister && currentLevel.label !== 'Strong password' ? 'not-allowed' : 'pointer'
          }}
        >
          {isRegister ? 'Create Account' : 'Login'}
        </button>

        <p
          style={{ cursor: 'pointer', color: '#007bff', marginTop: '10px', textAlign: 'center' }}
          onClick={() => {
            setIsRegister(!isRegister);
            setError('');
            setPassword('');
            setPasswordStrength(0);
          }}
        >
          {isRegister ? 'Already have an account? Login' : "Don't have an account? Create one"}
        </p>

        {debugVisible && isRegister && (
          <div style={{ marginTop: 12, padding: 8, background: '#f7f7f7', borderRadius: 6 }}>
            <strong>DEBUG</strong>
            <div>password: <code>{password}</code></div>
            <div>strength: <code>{passwordStrength}</code></div>
            <div>label: <code>{currentLevel.label}</code></div>
          </div>
        )}
      </form>
    </div>
  );
}

export default Login;
