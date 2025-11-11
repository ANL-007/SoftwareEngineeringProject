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
