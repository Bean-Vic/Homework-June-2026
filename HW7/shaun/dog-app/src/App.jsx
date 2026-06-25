import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [dogImage, setDogImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDogImage = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://dog.ceo/api/breeds/image/random");

      if (!response.ok) {
        throw new Error("Failed to fetch dog image");
      }

      const data = await response.json();

      if (data.status === "success") {
        setDogImage(data.message);
      } else {
        throw new Error("API returned an error");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDogImage();
  }, []);

  return (
    <div className="app">
      <h1>Random Dog Image</h1>

      {loading && <p>Loading...</p>}

      {error && <p className="error">{error}</p>}

      {!loading && dogImage && (
        <img src={dogImage} alt="Random dog" className="dog-image" />
      )}

      <button onClick={fetchDogImage} disabled={loading}>
        Get Another Dog
      </button>
    </div>
  );
}

export default App;