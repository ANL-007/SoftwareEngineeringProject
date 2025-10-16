import React from 'react';
import '../styles/Sidebar.css';

function Sidebar({ activeTab, setActiveTab }) {
  const tabs = ['Home', 'Public Flashcards', 'My Flashcards', 'Groups'];

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">StudyHub</h2>
      {tabs.map(tab => (
        <button
          key={tab}
          className={`sidebar-btn ${activeTab === tab ? 'active' : ''}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export default Sidebar;
