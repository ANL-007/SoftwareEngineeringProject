import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Home from './Home';
import PublicFlashcards from './PublicFlashcards';
import MyFlashcards from './MyFlashcards';
import Groups from './Groups';
import '../styles/Dashboard.css';

function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('Home');

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return <Home />;
      case 'Public Flashcards':
        return <PublicFlashcards />;
      case 'My Flashcards':
        return <MyFlashcards />;
      case 'Groups':
        return <Groups />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>{activeTab}</h1>
          <button onClick={onLogout}>Logout</button>
        </div>
        <div className="dashboard-main">{renderContent()}</div>
      </div>
    </div>
  );
}

export default Dashboard;
