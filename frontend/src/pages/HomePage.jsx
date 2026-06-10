import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listGames } from '../../redux/actions/gameActions';
import GameCard from '../components/GameCard';
import Loader from '../components/Loader';
import Message from '../components/Message';

const CATEGORIES = ['Action', 'RPG', 'Sports', 'Shooter', 'Open World', 'Sandbox', 'Battle Royale'];

function HomePage() {
  const dispatch = useDispatch();
  const { games, loading, error } = useSelector((state) => state.gamesList);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(listGames());
  }, [dispatch]);

  const featured = games.slice(0, 6);

  return (
    <div className="page home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-tagline">Next-Level Gaming Experience</p>
          <h1 className="hero-title">
            Discover Your<br />
            <span className="accent">Next Adventure</span>
          </h1>
          <p className="hero-desc">
            Browse thousands of games — from epic RPGs to adrenaline-pumping shooters.
            Find your next obsession at unbeatable prices.
          </p>
          <div className="hero-actions">
            <Link to="/games" className="btn-primary">Browse Games</Link>
            {userInfo ? (
              <Link to="/profile" className="btn-outline">
                My Profile
              </Link>
            ) : (
              <Link to="/register" className="btn-outline">
                Join Now
              </Link>
            )}
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-glow"></div>
          <div className="hero-card-stack">
            {games.slice(0, 3).map((game, i) => (
              <div key={game._id} className={`hero-stack-card hero-stack-${i}`}>
                <img
                  src={game.images?.[0] || 'https://placehold.co/200x260/0a0a1a/00d4ff?text=Game'}
                  alt={game.title}
                  onError={(e) => { e.target.src = 'https://placehold.co/200x260/0a0a1a/00d4ff?text=Game'; }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Browse by <span className="accent">Category</span></h2>
        </div>
        <div className="categories-grid">
          {CATEGORIES.map((cat) => (
            <Link key={cat} to={`/games?category=${cat}`} className="category-pill">
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Games */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Featured <span className="accent">Games</span></h2>
          <Link to="/games" className="see-all-link">View All &rarr;</Link>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <Message type="error">{error}</Message>
        ) : (
          <div className="games-grid">
            {featured.map((game) => (
              <GameCard key={game._id} game={game} />
            ))}
          </div>
        )}
      </section>

      {/* Stats Banner */}
      <section className="stats-banner">
        <div className="stat-item">
          <span className="stat-number">10+</span>
          <span className="stat-label">Games Available</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-number">5K+</span>
          <span className="stat-label">Happy Gamers</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-number">4.8</span>
          <span className="stat-label">Average Rating</span>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
