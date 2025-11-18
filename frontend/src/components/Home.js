import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const SAMPLE_CARDS = [
  { id: 1, title: 'Biology: Cell Structure', topic: 'Biology', cards: 24 },
  { id: 2, title: 'Spanish: Common Verbs', topic: 'Languages', cards: 18 },
  { id: 3, title: 'Calculus I: Limits', topic: 'Math', cards: 30 },
  { id: 4, title: 'History: WW2 Timeline', topic: 'History', cards: 12 },
];

function Home({ setActiveTab }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SAMPLE_CARDS;
    return SAMPLE_CARDS.filter(
      c => c.title.toLowerCase().includes(q) || c.topic.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="home-root">
      <header className="home-hero">
        <div className="hero-content">
          <h1>Welcome back to StudyHub</h1>
          <p className="hero-sub">Study smarter — organize, practice and share flashcards.</p>

          <div className="hero-controls">
            <input
              aria-label="Search flashcards"
              className="search-input"
              placeholder="Search topics, titles or tags..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <Link to="/public" className="cta-btn">Explore Public</Link>
          </div>
        </div>
      </header>

      <main className="home-main">
        <section className="quick-links">
          <Link to="/my-flashcards" className="quick-card" onClick={() => setActiveTab && setActiveTab('My Flashcards')}>
            <h3>My Flashcards</h3>
            <p>Review and edit your sets</p>
          </Link>
          <Link to="/public" className="quick-card" onClick={() => setActiveTab && setActiveTab('Public Flashcards')}>
            <h3>Public Collections</h3>
            <p>Browse top community decks</p>
          </Link>
          <Link to="/groups" className="quick-card" onClick={() => setActiveTab && setActiveTab('Groups')}>
            <h3>Groups</h3>
            <p>Join study groups and collaborate</p>
          </Link>
        </section>

        <section className="featured">
          <div className="section-header">
            <h2>Featured Flashcards</h2>
            <Link to="/public" className="see-all" onClick={() => setActiveTab && setActiveTab('Public Flashcards')}>See all</Link>
          </div>

          <div className="card-grid">
            {filtered.map(card => (
              <article key={card.id} className="card">
                <div className="card-top">
                  <h4>{card.title}</h4>
                  <span className="tag">{card.topic}</span>
                </div>
                <div className="card-meta">{card.cards} cards</div>
                <div className="card-actions">
                  <Link to={`/public/${card.id}`} className="link-button">Open</Link>
                  <button className="ghost">Preview</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
