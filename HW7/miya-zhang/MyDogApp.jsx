import { useEffect, useState } from "react";
import "./MiyaDogApp.css";

function MiyaDogApp() {
  const [dogImage, setDogImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getDogImage = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://dog.ceo/api/breeds/image/random");

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const data = await response.json();
      setDogImage(data.message);
    } catch (err) {
      setError("Sorry, I could not load the dog image.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDogImage();
  }, []);

  return (
    <div className="dog-page">
      <div className="dog-card">
        <h1>Random Dog Image</h1>
        <p>Click the button to get another cute dog photo.</p>

        {loading && <p className="message">Loading...</p>}

        {error && <p className="error">{error}</p>}

        {!loading && dogImage && (
          <img src={dogImage} alt="Random dog" className="dog-image" />
        )}

        <button onClick={getDogImage} disabled={loading}>
          Get Another Dog
        </button>
      </div>
    </div>
  );
}

export default MiyaDogApp;
