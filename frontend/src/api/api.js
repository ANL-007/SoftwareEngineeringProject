import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

export const getFlashcards = async () => {
  try {
    const response = await axios.get(`${API_URL}/flashcards/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    return [];
  }
};

export const getUserClasses = async (username) => {
  try {
    const response = await axios.get(`${API_URL}/user-classes/`, {
      params: { username },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user classes:', error);
    return [];
  }
};

export const createFlashcard = async (username, question, answer) => {
  try {
    const response = await axios.post(`${API_URL}/create-flashcard/`, {
      username,
      question,
      answer,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating flashcard:', error);
    throw error;
  }
};
