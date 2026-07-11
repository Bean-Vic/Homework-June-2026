import { useEffect, useState } from 'react'
import './App.css'

const API_URL = 'https://rickandmortyapi.com/graphql'

// GraphQL query using variables ($page for pagination, $name for search)
const CHARACTERS_QUERY = `
  query Characters($page: Int, $name: String) {
    characters(page: $page, filter: { name: $name }) {
      info {
        pages
        count
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
`

function App() {
  const [characters, setCharacters] = useState([])
  const [info, setInfo] = useState(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchCharacters() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: CHARACTERS_QUERY,
            variables: { page, name: search || null },
          }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`)
        }

        const json = await response.json()

        // GraphQL errors come back with a 200 status in the errors array
        if (json.errors) {
          throw new Error(json.errors[0].message)
        }

        setCharacters(json.data.characters.results)
        setInfo(json.data.characters.info)
      } catch (err) {
        setError(err.message)
        setCharacters([])
        setInfo(null)
      } finally {
        setLoading(false)
      }
    }

    fetchCharacters()
  }, [page, search])

  function handleSearchSubmit(e) {
    e.preventDefault()
    const value = new FormData(e.target).get('name').trim()
    setSearch(value)
    setPage(1) // reset to first page on a new search
  }

  return (
    <div className="app">
      <h1>Rick and Morty Characters</h1>

      <form className="search-form" onSubmit={handleSearchSubmit}>
        <input name="name" type="text" placeholder="Search by name..." defaultValue={search} />
        <button type="submit">Search</button>
      </form>

      {loading && <p className="status-msg">Loading...</p>}

      {error && <p className="status-msg error">Error: {error}</p>}

      {!loading && !error && (
        <>
          <ul className="character-grid">
            {characters.map((character) => (
              <li key={character.id} className="character-card">
                <img src={character.image} alt={character.name} />
                <div className="character-details">
                  <h2>{character.name}</h2>
                  <p>
                    <span className={`dot ${character.status.toLowerCase()}`} />
                    {character.status} - {character.species}
                  </p>
                  <p className="origin">Origin: {character.origin.name}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="pagination">
            <button onClick={() => setPage(page - 1)} disabled={!info?.prev}>
              Previous
            </button>
            <span>
              Page {page} of {info?.pages ?? '?'}
            </span>
            <button onClick={() => setPage(page + 1)} disabled={!info?.next}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default App
