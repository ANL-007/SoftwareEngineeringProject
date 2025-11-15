import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

export const getFlashcards = async (username) => {
  try {
    const response = await axios.get(`${API_URL}/flashcards/`, {
      params: { username },
    });
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

export const getAllClasses = async () => {
  try {
    const response = await axios.get(`${API_URL}/classes/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all classes:', error);
    return [];
  }
};

export const joinClass = async (username, classId) => {
  try {
    const response = await axios.post(`${API_URL}/join-class/`, {
      username,
      class_id: classId,
    });
    return response.data;
  } catch (error) {
    console.error('Error joining class:', error);
    throw error;
  }
};

export const createClass = async (username, className, classNumber, description, role = 'Leader') => {
  try {
    const response = await axios.post(`${API_URL}/create-class/`, {
      username,
      class_name: className,
      class_number: classNumber,
      description,
      role,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating class:', error);
    throw error;
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
