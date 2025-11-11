import React, { useState, useEffect } from 'react';
import { getFlashcards } from '../api/api';

function PublicFlashcards() {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPublicFlashcards();
  }, []);

  const fetchPublicFlashcards = async () => {
    try {
      setLoading(true);
      const data = await getFlashcards();
      setFlashcardSets(data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch public flashcards');
      console.error('Error fetching flashcards:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading public flashcards...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!flashcardSets || flashcardSets.length === 0) {
    return <p>No public flashcard sets available</p>;
  }

  return (
    <div>
      <h2>Public Flashcard Sets</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {flashcardSets.map((flashcard, index) => (
          <div
            key={flashcard.id || index}
            style={{
              border: '2px solid #007bff',
              padding: '1.5rem',
              borderRadius: '8px',
              backgroundColor: '#f0f8ff',
              boxShadow: '0 2px 8px rgba(0, 123, 255, 0.15)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              hover: { boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)' },
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 123, 255, 0.15)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <h3 style={{ marginTop: 0, color: '#007bff' }}>Question</h3>
            <p style={{ fontSize: '1rem', lineHeight: '1.5' }}>{flashcard.Question}</p>
            <hr style={{ borderColor: '#007bff', opacity: 0.3 }} />
            <h3 style={{ color: '#007bff' }}>Answer</h3>
            <p style={{ fontSize: '1rem', lineHeight: '1.5', color: '#333' }}>{flashcard.Answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PublicFlashcards;