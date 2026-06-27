import { useState, useEffect } from 'react';

function DogApp() {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDog = async () => {
    setLoading(true);
    setError(null);  // reset error
    try {
      const response = await fetch('https://dog.ceo/api/breeds/image/random');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status !== 'success') {
        throw new Error('API returned non-success status');
      }
      setImageUrl(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);  // close loading
    }
  };

  // auto loading
  useEffect(() => {
    fetchDog();
  }, []);
  
  return (
    <div>
      <h1>🐶 Random Dog</h1>

      {loading && <p>Loading...</p>}

      {error && (
        <div>
          <p style={{ color: 'red' }}>Error: {error}</p>
        </div>
      )}

      {!loading && !error && imageUrl && (
        <img src={imageUrl} alt="A random dog" width="400" />
      )}

      <div>
        <button onClick={fetchDog} disabled={loading}>
          {loading ? 'Loading...' : 'Get Another Dog'}
        </button>
      </div>
    </div>
  );
}

export default DogApp;
