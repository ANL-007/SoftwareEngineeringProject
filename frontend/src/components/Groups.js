import React, { useState, useEffect } from 'react';
import { getUserClasses } from '../api/api';

function Groups() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formMode, setFormMode] = useState('join'); // 'join' or 'create'
  const [formData, setFormData] = useState({
    classCode: '',
    className: '',
    classNumber: '',
    description: '',
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchUserClasses();
  }, []);

  const fetchUserClasses = async () => {
    try {
      setLoading(true);
      const username = localStorage.getItem('user');
      
      if (!username) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      const data = await getUserClasses(username);
      setClasses(data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch classes');
      console.error('Error fetching classes:', err);
    } finally {
      setLoading(false);
    }
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
      const username = localStorage.getItem('user');
      
      if (formMode === 'join') {
        if (!formData.classCode.trim()) {
          setFormError('Please enter a class code');
          return;
        }
        console.log(`User ${username} joining class with code: ${formData.classCode}`);
        // TODO: Call API to join class
      } else {
        if (!formData.className.trim() || !formData.classNumber.trim()) {
          setFormError('Please fill in class name and class number');
          return;
        }
        console.log(`User ${username} creating class: ${formData.className} (${formData.classNumber})`);
        // TODO: Call API to create class
      }

      // Refresh classes after successful operation
      await fetchUserClasses();
      setShowModal(false);
      setFormData({ classCode: '', className: '', classNumber: '', description: '' });
    } catch (err) {
      setFormError('Failed to process request. Please try again.');
      console.error('Error:', err);
    }
  };

  const openModal = (mode) => {
    setFormMode(mode);
    setFormData({ classCode: '', className: '', classNumber: '', description: '' });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ classCode: '', className: '', classNumber: '', description: '' });
    setFormError('');
  };

  if (loading) {
    return <p>Loading classes...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>My Classes</h2>
        <button
          onClick={() => openModal('join')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
        >
          + Add Class
        </button>
      </div>

      {classes.length === 0 ? (
        <p>You are not enrolled in any classes yet. Click "Add Class" to get started!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {classes.map((classItem, index) => (
            <div
              key={classItem.id || index}
              style={{
                border: '2px solid #28a745',
                padding: '1.5rem',
                borderRadius: '8px',
                backgroundColor: '#f0fff4',
                boxShadow: '0 2px 8px rgba(40, 167, 69, 0.15)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.3)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(40, 167, 69, 0.15)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <h3 style={{ marginTop: 0, color: '#28a745' }}>{classItem.class_name}</h3>
              <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <strong>Class Number:</strong> {classItem.class_number}
              </p>
              <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <strong>Role:</strong> {classItem.role_in_class || 'Student'}
              </p>
              {classItem.description && (
                <>
                  <hr style={{ borderColor: '#28a745', opacity: 0.3 }} />
                  <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: '#333' }}>
                    {classItem.description}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
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
            <h3 style={{ marginTop: 0, color: '#333' }}>
              {formMode === 'join' ? 'Join a Class' : 'Create a Class'}
            </h3>

            {formError && (
              <p style={{ color: '#dc3545', marginBottom: '1rem', fontWeight: '600' }}>
                {formError}
              </p>
            )}

            <form onSubmit={handleSubmit}>
              {formMode === 'join' ? (
                <>
                  <label style={{ display: 'block', marginBottom: '1rem' }}>
                    <strong>Class Code:</strong>
                    <input
                      type="text"
                      name="classCode"
                      value={formData.classCode}
                      onChange={handleInputChange}
                      placeholder="Enter the class code provided by your instructor"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        marginTop: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </label>
                </>
              ) : (
                <>
                  <label style={{ display: 'block', marginBottom: '1rem' }}>
                    <strong>Class Name:</strong>
                    <input
                      type="text"
                      name="className"
                      value={formData.className}
                      onChange={handleInputChange}
                      placeholder="e.g., Introduction to Biology"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        marginTop: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </label>

                  <label style={{ display: 'block', marginBottom: '1rem' }}>
                    <strong>Class Number:</strong>
                    <input
                      type="text"
                      name="classNumber"
                      value={formData.classNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., BIO-101"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        marginTop: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </label>

                  <label style={{ display: 'block', marginBottom: '1rem' }}>
                    <strong>Description (Optional):</strong>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Add a description for your class"
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
                </>
              )}

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
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    transition: 'background-color 0.3s ease',
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
                >
                  {formMode === 'join' ? 'Join Class' : 'Create Class'}
                </button>
              </div>
            </form>

            {/* Toggle between join and create modes */}
            <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
              <p style={{ margin: 0, color: '#666' }}>
                {formMode === 'join' ? "Don't have a code? " : "Have a code? "}
                <button
                  type="button"
                  onClick={() => openModal(formMode === 'join' ? 'create' : 'join')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#28a745',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    textDecoration: 'underline',
                  }}
                >
                  {formMode === 'join' ? 'Create one' : 'Join instead'}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Groups;