import React from 'react';

function Dashboard({ onLogout }) {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to StudyHub!</h1>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;