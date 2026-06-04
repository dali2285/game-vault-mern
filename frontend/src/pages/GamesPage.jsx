import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { listGames } from '../../redux/actions/gameActions';
import GameCard from '../components/GameCard';
import Loader from '../components/Loader';
import Message from '../components/Message';

const CATEGORIES = ['All', 'Action', 'RPG', 'Sports', 'Shooter', 'Open World', 'Sandbox', 'Battle Royale', 'Adventure'];
const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

function GamesPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);

  const { games, loading, error, pages } = useSelector((state) => state.gamesList);

  useEffect(() => {
    dispatch(listGames(search, category, sort, page));
  }, [dispatch, search, category, sort, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    dispatch(listGames(search, category, sort, 1));
  };

  const handleCategory = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  return (
    <div className="page games-page">
      <div className="games-page-header">
        <h1 className="page-title">All <span className="accent">Games</span></h1>

        {/* Search Bar */}
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="Search games..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="search-btn">Search</button>
        </form>
      </div>

      <div className="games-layout">
        {/* Sidebar Filters */}
        <aside className="games-sidebar">
          <div className="filter-group">
            <h3 className="filter-title">Category</h3>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${category === cat ? 'active' : ''}`}
                onClick={() => handleCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="filter-group">
            <h3 className="filter-title">Sort By</h3>
            <select
              className="sort-select"
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </aside>

        {/* Games Grid */}
        <div className="games-main">
          {loading ? (
            <Loader />
          ) : error ? (
            <Message type="error">{error}</Message>
          ) : games.length === 0 ? (
            <Message type="info">No games found. Try a different search or category.</Message>
          ) : (
            <>
              <div className="games-grid">
                {games.map((game) => (
                  <GameCard key={game._id} game={game} />
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="pagination">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      className={`page-btn ${page === p ? 'active' : ''}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default GamesPage;
