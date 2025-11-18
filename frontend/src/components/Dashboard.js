import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Home from './Home';
import PublicFlashcards from './PublicFlashcards';
import MyFlashcards from './MyFlashcards';
import Classes from './Classes';
import '../styles/Dashboard.css';

function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('Home');

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return <Home setActiveTab={setActiveTab} />;
      case 'Public Flashcards':
        return <PublicFlashcards />;
      case 'My Flashcards':
        return <MyFlashcards />;
      case 'Classes':
        return <Classes />;
      default:
        return <Home setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>{activeTab}</h1>
          <button className="logout-btn" onClick={onLogout} aria-label="Logout">
            <span className="logout-emoji" aria-hidden>🔒</span>
            <span className="logout-text">Logout</span>
          </button>
        </div>
        <div className="dashboard-main">{renderContent()}</div>
      </div>
    </div>
  );
}

export default Dashboard;
