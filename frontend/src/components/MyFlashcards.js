import React, { useState, useEffect } from 'react';
import { getFlashcardSets, getFlashcardsInSet, createFlashcard, createFlashcardSet } from '../api/api';

function MyFlashcards() {
  const [sets, setSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [flipped, setFlipped] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showSetModal, setShowSetModal] = useState(false);
  const [setForm, setSetForm] = useState({ name: '', description: '' });
  const [setModalError, setSetModalError] = useState('');
  const [formData, setFormData] = useState({ question: '', answer: '' });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchUserSets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchUserSets() {
    try {
      setLoading(true);
      const username = localStorage.getItem('user');
      if (!username) {
        setError('User not logged in');
        return;
      }
      const data = await getFlashcardSets(username);
      setSets(data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch flashcard sets:', err);
      setError('Failed to fetch flashcard sets');
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectSet(set) {
    setSelectedSet(set);
    setLoading(true);
    try {
      const data = await getFlashcardsInSet(set.id);
      setFlashcards(data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load flashcards for set:', err);
      setError('Failed to load flashcards for this set');
    } finally {
      setLoading(false);
    }
  }

  const toggleFlip = (cardId) => {
    setFlipped(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.question.trim() || !formData.answer.trim()) {
      setFormError('Please fill in both question and answer');
      return;
    }

    const username = localStorage.getItem('user');
    if (!username) {
      setFormError('User not logged in');
      return;
    }
    if (!selectedSet) {
      setFormError('No set selected');
      return;
    }

    try {
      await createFlashcard(selectedSet.id, username, formData.question, formData.answer);
      // refresh the selected set's flashcards
      await handleSelectSet(selectedSet);
      closeModal();
    } catch (err) {
      console.error('Error creating flashcard:', err);
      setFormError(err.response?.data?.error || 'Failed to create flashcard. Please try again.');
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

  const openSetModal = () => {
    setSetForm({ name: '', description: '' });
    setSetModalError('');
    setShowSetModal(true);
  };

  const closeSetModal = () => {
    setShowSetModal(false);
    setSetForm({ name: '', description: '' });
    setSetModalError('');
  };

  const handleSetInputChange = (e) => {
    const { name, value } = e.target;
    setSetForm(prev => ({ ...prev, [name]: value }));
    setSetModalError('');
  };

  const handleCreateSet = async (e) => {
    e.preventDefault();
    setSetModalError('');
    const username = localStorage.getItem('user');
    if (!username) return setSetModalError('User not logged in');
    if (!setForm.name.trim()) return setSetModalError('Please enter a set name');

    try {
      const res = await createFlashcardSet(username, setForm.name.trim(), setForm.description.trim());
      await fetchUserSets();
      if (res?.id) {
        const newSet = { id: res.id, name: res.name, description: setForm.description };
        await handleSelectSet(newSet);
      }
      closeSetModal();
    } catch (err) {
      console.error('Error creating set:', err);
      setSetModalError(err.response?.data?.error || 'Failed to create set');
    }
  };

  // UI States
  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  const username = localStorage.getItem('user');

  return (
    <div style={{ padding: '1rem' }}>
      {/* Top header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>
          {selectedSet ? `Set: ${selectedSet.name}` : `My Flashcard Sets${username ? ` — ${username}` : ''}`}
        </h2>

        {selectedSet ? (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => { setSelectedSet(null); setFlashcards([]); }}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: 6,
                border: '1px solid #ccc',
                background: '#fff',
                cursor: 'pointer'
              }}
            >
              ← Back to Sets
            </button>

            <button
              onClick={openModal}
              style={{
                padding: '0.5rem 0.9rem',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: 600
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
            >
              + Add Flashcard
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={openSetModal}
              style={{
                padding: '0.5rem 0.9rem',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: 600
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1e7e34'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
            >
              + Add Set
            </button>
          </div>
        )}
      </div>

      {/* If no set selected -> show sets */}
      {!selectedSet && (
        <>
          {sets.length === 0 ? (
            <p>You don't have any sets yet.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {sets.map((set) => (
                <div
                  key={set.id}
                  onClick={() => handleSelectSet(set)}
                  style={{
                    padding: '1rem',
                    border: '1px solid #ccc',
                    borderRadius: 8,
                    cursor: 'pointer',
                    background: '#f7f7f7',
                  }}
                >
                  <h3 style={{ margin: '0 0 .5rem 0' }}>{set.name}</h3>
                  <p style={{ margin: 0, color: '#555' }}>{set.description || 'No description'}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* If a set is selected -> show flashcards */}
      {selectedSet && (
        <>
          {flashcards.length === 0 ? (
            <p>No flashcards in this set.</p>
          ) : (
            <>
              <p style={{ color: '#666', marginBottom: '1rem' }}>Click a card to flip it and reveal the answer</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
                {flashcards.map((flashcard, index) => {
                  const id = flashcard.id ?? index;
                  const isFlipped = !!flipped[id];

                  return (
                    <div
                      key={id}
                      onClick={() => toggleFlip(id)}
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
                        {/* Front */}
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
                            {flashcard.front_text ?? flashcard.Question ?? 'No question'}
                          </p>
                          <p style={{ color: '#fff', fontSize: '0.8rem', margin: '0.75rem 0 0 0', opacity: 0.7 }}>
                            Click to reveal answer
                          </p>
                        </div>

                        {/* Back */}
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
                            {flashcard.back_text ?? flashcard.Answer ?? 'No answer'}
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
        </>
      )}

      {/* Modal */}
      {showModal && selectedSet && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: 8,
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            maxWidth: 600,
            width: '95%'
          }}>
            <h3 style={{ marginTop: 0 }}>Create New Flashcard in "{selectedSet.name}"</h3>

            {formError && <p style={{ color: '#dc3545', marginBottom: '1rem', fontWeight: 600 }}>{formError}</p>}

            <form onSubmit={handleSubmit}>
              <label style={{ display: 'block', marginBottom: '1rem' }}>
                <strong>Question:</strong>
                <textarea
                  name="question"
                  value={formData.question}
                  onChange={handleInputChange}
                  placeholder="Enter the question for this flashcard"
                  rows={4}
                  style={{ width: '100%', padding: '.75rem', marginTop: '.5rem', border: '1px solid #ddd', borderRadius: 4 }}
                />
              </label>

              <label style={{ display: 'block', marginBottom: '1.5rem' }}>
                <strong>Answer:</strong>
                <textarea
                  name="answer"
                  value={formData.answer}
                  onChange={handleInputChange}
                  placeholder="Enter the answer for this flashcard"
                  rows={4}
                  style={{ width: '100%', padding: '.75rem', marginTop: '.5rem', border: '1px solid #ddd', borderRadius: 4 }}
                />
              </label>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={closeModal} style={{
                  padding: '.6rem 1.1rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer'
                }}>
                  Cancel
                </button>
                <button type="submit" style={{
                  padding: '.6rem 1.1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600
                }}>
                  Create Flashcard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Create Set Modal */}
      {showSetModal && !selectedSet && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: 8,
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            maxWidth: 600,
            width: '95%'
          }}>
            <h3 style={{ marginTop: 0 }}>Create New Flashcard Set</h3>

            {setModalError && <p style={{ color: '#dc3545', marginBottom: '1rem', fontWeight: 600 }}>{setModalError}</p>}

            <form onSubmit={handleCreateSet}>
              <label style={{ display: 'block', marginBottom: '1rem' }}>
                <strong>Set Name:</strong>
                <input
                  name="name"
                  value={setForm.name}
                  onChange={handleSetInputChange}
                  placeholder="Enter a name for this set"
                  style={{ width: '100%', padding: '.5rem', marginTop: '.5rem', border: '1px solid #ddd', borderRadius: 4 }}
                />
              </label>

              <label style={{ display: 'block', marginBottom: '1.5rem' }}>
                <strong>Description (optional):</strong>
                <textarea
                  name="description"
                  value={setForm.description}
                  onChange={handleSetInputChange}
                  placeholder="Optional description"
                  rows={3}
                  style={{ width: '100%', padding: '.5rem', marginTop: '.5rem', border: '1px solid #ddd', borderRadius: 4 }}
                />
              </label>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={closeSetModal} style={{
                  padding: '.6rem 1.1rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer'
                }}>
                  Cancel
                </button>
                <button type="submit" style={{
                  padding: '.6rem 1.1rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600
                }}>
                  Create Set
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
