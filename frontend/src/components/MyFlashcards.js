import React, { useState, useEffect } from 'react';
import { getFlashcards, createFlashcard } from '../api/api';

function MyFlashcards() {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [flipped, setFlipped] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchUserFlashcards();
  }, []);

  const fetchUserFlashcards = async () => {
    try {
      setLoading(true);
      const username = localStorage.getItem('user');
      
      if (!username) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      const data = await getFlashcards();
      setFlashcards(data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch your flashcards');
      console.error('Error fetching flashcards:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFlip = (cardId) => {
    setFlipped(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    try {
      if (!formData.question.trim() || !formData.answer.trim()) {
        setFormError('Please fill in both question and answer');
        return;
      }

      const username = localStorage.getItem('user');
      
      // Call API to create flashcard
      const response = await createFlashcard(username, formData.question, formData.answer);
      console.log('Flashcard created successfully:', response);

      // Refresh flashcards after successful creation
      await fetchUserFlashcards();
      closeModal();
    } catch (err) {
      const errorMessage = err.response?.data?.error || err + 'Failed to create flashcard. Please try again.';
      setFormError(errorMessage);
      console.error('Error:', err);
    }
  };

  const openModal = () => {
    setFormData({ question: '', answer: '' });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ question: '', answer: '' });
    setFormError('');
  };

  if (loading) {
    return <p>Loading your flashcards...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  const username = localStorage.getItem('user');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>My Flashcards - {username}</h2>
        <button
          onClick={openModal}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
        >
          + Add Flashcard
        </button>
      </div>

      {!flashcards || flashcards.length === 0 ? (
        <p>You don't have any flashcards yet. Click "Add Flashcard" to create one!</p>
      ) : (
        <>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            Click any card to flip it and reveal the answer
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {flashcards.map((flashcard, index) => {
              const isFlipped = flipped[flashcard.id || index];

              return (
                <div
                  key={flashcard.id || index}
                  onClick={() => toggleFlip(flashcard.id || index)}
                  style={{
                    perspective: '900px',
                    cursor: 'pointer',
                    height: '200px',
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      transition: 'transform 0.6s',
                      transformStyle: 'preserve-3d',
                      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                  >
                    {/* Front side - Question */}
                    <div
                      style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          backfaceVisibility: 'hidden',
                          backgroundColor: '#007bff',
                          border: '2px solid #0056b3',
                          padding: '1rem',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 123, 255, 0.15)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          textAlign: 'center',
                        }}
                    >
                      <p style={{ color: '#fff', fontSize: '0.8rem', margin: '0 0 0.75rem 0', opacity: 0.8 }}>
                        QUESTION
                      </p>
                      <p style={{ color: '#fff', fontSize: '1rem', fontWeight: '600', margin: 0, lineHeight: '1.4' }}>
                        {flashcard.Question || flashcard.front_text}
                      </p>
                      <p style={{ color: '#fff', fontSize: '0.8rem', margin: '0.75rem 0 0 0', opacity: 0.7 }}>
                        Click to reveal answer
                      </p>
                    </div>

                    {/* Back side - Answer */}
                    <div
                      style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          backfaceVisibility: 'hidden',
                          backgroundColor: '#28a745',
                          border: '2px solid #1e7e34',
                          padding: '1rem',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(40, 167, 69, 0.15)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          textAlign: 'center',
                          transform: 'rotateY(180deg)',
                        }}
                    >
                      <p style={{ color: '#fff', fontSize: '0.8rem', margin: '0 0 0.75rem 0', opacity: 0.8 }}>
                        ANSWER
                      </p>
                      <p style={{ color: '#fff', fontSize: '1rem', fontWeight: '600', margin: 0, lineHeight: '1.4' }}>
                        {flashcard.Answer || flashcard.back_text}
                      </p>
                      <p style={{ color: '#fff', fontSize: '0.8rem', margin: '0.75rem 0 0 0', opacity: 0.7 }}>
                        Click to see question
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Modal for Add Flashcard */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            maxWidth: '500px',
            width: '90%',
          }}>
            <h3 style={{ marginTop: 0, color: '#333' }}>Create New Flashcard</h3>

            {formError && (
              <p style={{ color: '#dc3545', marginBottom: '1rem', fontWeight: '600' }}>
                {formError}
              </p>
            )}

            <form onSubmit={handleSubmit}>
              <label style={{ display: 'block', marginBottom: '1rem' }}>
                <strong>Question:</strong>
                <textarea
                  name="question"
                  value={formData.question}
                  onChange={handleInputChange}
                  placeholder="Enter the question for this flashcard"
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    marginTop: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </label>

              <label style={{ display: 'block', marginBottom: '1.5rem' }}>
                <strong>Answer:</strong>
                <textarea
                  name="answer"
                  value={formData.answer}
                  onChange={handleInputChange}
                  placeholder="Enter the answer for this flashcard"
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    marginTop: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </label>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'background-color 0.3s ease',
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#5a6268'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#6c757d'}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    transition: 'background-color 0.3s ease',
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
                >
                  Create Flashcard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyFlashcards;