import { useState, useEffect } from 'react';
import CharacterCard from './components/CharacterCard';

const API = 'https://rickandmortyapi.com/graphql';

// GraphQL query uses variables so it is configurable and reusable
const GET_CHARACTERS = `
  query GetCharacters($page: Int, $filter: FilterCharacter) {
    characters(page: $page, filter: $filter) {
      info {
        count
        pages
        next
        prev
      }
      results {
        id
        name
        status
        species
        image
        origin {
          name
        }
      }
    }
  }
`;

async function fetchCharacters(page, name) {
  // GraphQL variables — avoids hardcoding values inside the query string
  const variables = {
    page,
    filter: name ? { name } : {},
  };

  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: GET_CHARACTERS, variables }),
  });

  if (!res.ok) throw new Error(`Network error: ${res.status} ${res.statusText}`);

  const json = await res.json();
  // GraphQL errors are in the response body, not HTTP status
  if (json.errors) throw new Error(json.errors.map((e) => e.message).join(', '));

  return json.data.characters;
}

export default function App() {
  const [page, setPage]         = useState(1);
  const [search, setSearch]     = useState('');
  const [input, setInput]       = useState('');
  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchCharacters(page, search)
      .then((result) => { if (!cancelled) { setData(result); setLoading(false); } })
      .catch((err)   => { if (!cancelled) { setError(err.message); setLoading(false); } });

    return () => { cancelled = true; };
  }, [page, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(input.trim());
  };

  const handleReset = () => {
    setInput('');
    setSearch('');
    setPage(1);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-8">
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-center text-green-400 mb-1">
        Rick &amp; Morty
      </h1>
      <p className="text-center text-gray-500 text-sm mb-8">Powered by GraphQL</p>

      {/* Search bar (bonus) */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto mb-8">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search by name…"
          className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 placeholder-gray-500 focus:outline-none focus:border-green-400"
        />
        <button
          type="submit"
          className="px-5 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition-colors"
        >
          Search
        </button>
        {search && (
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            ✕
          </button>
        )}
      </form>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-green-400 border-t-transparent" />
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="text-center py-20">
          <p className="text-red-400 text-lg font-medium">⚠️ {error}</p>
          <button
            onClick={handleReset}
            className="mt-4 px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Reset
          </button>
        </div>
      )}

      {/* Character grid */}
      {!loading && !error && data && (
        <>
          <p className="text-center text-gray-500 text-sm mb-6">
            {data.info.count} character{data.info.count !== 1 ? 's' : ''} found
            {search && ` for "${search}"`}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-7xl mx-auto">
            {data.results.map((char) => (
              <CharacterCard key={char.id} character={char} />
            ))}
          </div>

          {/* Pagination (bonus) */}
          <div className="flex justify-center items-center gap-6 mt-10">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={!data.info.prev}
              className="px-5 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              ← Prev
            </button>
            <span className="text-gray-400 text-sm">
              Page <span className="text-white font-semibold">{page}</span> / {data.info.pages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!data.info.next}
              className="px-5 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
