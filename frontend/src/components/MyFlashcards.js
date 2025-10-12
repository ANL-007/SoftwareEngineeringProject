import React from 'react';

function MyFlashcards() {
  return <p>Flashcards</p>;
}

export default MyFlashcards;


/*
import React, { useEffect, useState } from 'react';
import { getFlashcards } from './api';

function Flashcards() {
  const [flashcards, setFlashcards] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getFlashcards();
      setFlashcards(data);
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Flashcards</h1>
      {flashcards.map(card => (
        <div key={card.id}>
          <h3>{card.front}</h3>
          <p>{card.back}</p>
        </div>
      ))}
    </div>
  );
}

export default Flashcards;
*/