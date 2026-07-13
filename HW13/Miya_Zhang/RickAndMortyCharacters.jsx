import { useEffect, useState } from "react";
import "./RickAndMortyCharacters.css";

const API_URL = "https://rickandmortyapi.com/graphql";

const GET_CHARACTERS = `
  query GetCharacters($page: Int, $name: String) {
    characters(page: $page, filter: { name: $name }) {
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

export default function RickAndMortyCharacters() {
  const [characters, setCharacters] = useState([]);
  const [page, setPage] = useState(1);
  const [inputName, setInputName] = useState("");
  const [searchName, setSearchName] = useState("");
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchCharacters() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: GET_CHARACTERS,
          variables: {
            page: page,
            name: searchName || null
          }
        })
      });

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const result = await response.json();

      if (result.errors) {
        setError(result.errors[0].message);
        setCharacters([]);
        setInfo(null);
        return;
      }

      setCharacters(result.data.characters.results || []);
      setInfo(result.data.characters.info);
    } catch (err) {
      setError("I could not load the characters. Please try again.");
      setCharacters([]);
      setInfo(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCharacters();
  }, [page, searchName]);

  function handleSearch(event) {
    event.preventDefault();
    setPage(1);
    setSearchName(inputName.trim());
  }

  function clearSearch() {
    setInputName("");
    setSearchName("");
    setPage(1);
  }

  return (
    <main className="page">
      <section className="header">
        <h1>Rick and Morty Characters</h1>
        <p>
          This page uses fetch and GraphQL variables to load character data from
          the Rick and Morty GraphQL API.
        </p>
      </section>

      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          value={inputName}
          onChange={(event) => setInputName(event.target.value)}
          placeholder="Search by character name"
        />
        <button type="submit">Search</button>
        <button type="button" onClick={clearSearch}>
          Clear
        </button>
      </form>

      {loading && <p className="message">Loading characters...</p>}

      {error && <p className="error">Error: {error}</p>}

      {!loading && !error && characters.length === 0 && (
        <p className="message">No characters found.</p>
      )}

      {!loading && !error && characters.length > 0 && (
        <section className="grid">
          {characters.map((character) => (
            <article className="card" key={character.id}>
              <img src={character.image} alt={character.name} />
              <div className="card-body">
                <h2>{character.name}</h2>
                <p>
                  <strong>Status:</strong> {character.status}
                </p>
                <p>
                  <strong>Species:</strong> {character.species}
                </p>
                <p>
                  <strong>Origin:</strong> {character.origin.name}
                </p>
              </div>
            </article>
          ))}
        </section>
      )}

      <section className="pagination">
        <button
          disabled={!info?.prev || loading}
          onClick={() => setPage((currentPage) => currentPage - 1)}
        >
          Previous
        </button>

        <span>
          Page {page}
          {info?.pages ? ` of ${info.pages}` : ""}
        </span>

        <button
          disabled={!info?.next || loading}
          onClick={() => setPage((currentPage) => currentPage + 1)}
        >
          Next
        </button>
      </section>
    </main>
  );
}
