import { useState, useEffect } from 'react';
import { createDogService } from '../api/dogServiceFactory';

const dogService = createDogService();

function DogApp() {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDog = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = await dogService.getRandomDog();
      setImageUrl(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDog();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          🐶 Random Dog
        </h1>

        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mb-6">
          {loading && (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-3 text-gray-600">Loading...</p>
            </div>
          )}

          {error && !loading && (
            <div className="text-center p-6">
              <p className="text-red-500 font-medium">⚠️ {error}</p>
              <p className="text-sm text-gray-500 mt-2">Click the button to retry</p>
            </div>
          )}

          {!loading && !error && imageUrl && (
            <img
              src={imageUrl}
              alt="A random dog"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <button
          onClick={fetchDog}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          {loading ? 'Fetching...' : 'Get Another Dog 🐕'}
        </button>
      </div>
    </div>
  );
}

export default DogApp;
