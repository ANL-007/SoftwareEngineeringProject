import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Initialize tab count
    if (!localStorage.getItem('tabCount')) {
      localStorage.setItem('tabCount', '0');
    }

    // Open tab: increment tab count
    const openTab = () => {
      const count = parseInt(localStorage.getItem('tabCount') || '0', 10) + 1;
      localStorage.setItem('tabCount', count.toString());
    };

    // Close tab: decrement tab count
    const closeTab = () => {
      const count = parseInt(localStorage.getItem('tabCount') || '1', 10) - 1;
      localStorage.setItem('tabCount', count.toString());
      if (count <= 0) {
        // last tab closed → log out
        localStorage.removeItem('user'); // optional: clear persistent storage
        setUser(null);
      }
    };

    // Track open/close
    openTab();
    window.addEventListener('beforeunload', closeTab);

    // Load session from storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(storedUser);

    return () => {
      closeTab();
      window.removeEventListener('beforeunload', closeTab);
    };
  }, []);

  const handleLogin = (username) => {
    setUser(username);
    localStorage.setItem('user', username); // stored so other tabs can read
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/*"
          element={user ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
