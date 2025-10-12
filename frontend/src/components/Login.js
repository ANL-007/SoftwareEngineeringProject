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
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        // Create account
        const res = await axios.post('http://127.0.0.1:8000/api/register/', { username, password });
        if (res.data.success) {
          // Account created → automatically login
          onLogin(username);
        } else {
          setError(res.data.error || 'Registration failed');
        }
      } else {
        // Login
        const res = await axios.post(
            'http://127.0.0.1:8000/api/login/',
            { username, password },
            { withCredentials: true } // only needed for session authentication
            );
        if (res.data.success) {
          onLogin(username);
        } else {
          setError(res.data.error || 'Invalid username or password');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

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
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isRegister ? 'Create Account' : 'Login'}</button>
        <p
          style={{ cursor: 'pointer', color: '#007bff', marginTop: '10px', textAlign: 'center' }}
          onClick={() => { setIsRegister(!isRegister); setError(''); }}
        >
          {isRegister ? 'Already have an account? Login' : "Don't have an account? Create one"}
        </p>
      </form>
    </div>
  );
}

export default Login;
