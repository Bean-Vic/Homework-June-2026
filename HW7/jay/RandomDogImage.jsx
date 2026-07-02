import { useState, useEffect, useCallback } from "react";

const DOG_API_URL = "https://dog.ceo/api/breeds/image/random";

export default function RandomDogImage() {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDog = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(DOG_API_URL);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== "success" || !data.message) {
        throw new Error("API did not return a valid dog image.");
      }

      setImageUrl(data.message);
    } catch (err) {
      setError(err.message || "Something went wrong fetching the dog.");
      setImageUrl("");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDog();
  }, [fetchDog]);

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>🐶 Random Dog</h2>

      <div style={styles.imageWrapper}>
        {loading && <p style={styles.status}>Loading…</p>}

        {!loading && error && (
          <p style={{ ...styles.status, ...styles.error }}>⚠️ {error}</p>
        )}

        {!loading && !error && imageUrl && (
          <img src={imageUrl} alt="A random dog" style={styles.image} />
        )}
      </div>

      <button
        onClick={fetchDog}
        disabled={loading}
        style={{
          ...styles.button,
          ...(loading ? styles.buttonDisabled : {}),
        }}
      >
        {loading ? "Fetching…" : "Get Another Dog"}
      </button>
    </div>
  );
}

const styles = {
  card: {
    maxWidth: 420,
    margin: "40px auto",
    padding: 24,
    borderRadius: 16,
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
    textAlign: "center",
    fontFamily: "system-ui, -apple-system, sans-serif",
    background: "#fff",
  },
  title: {
    margin: "0 0 16px",
    fontSize: 22,
    color: "#333",
  },
  imageWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 280,
    marginBottom: 16,
    background: "#f5f5f5",
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    maxWidth: "100%",
    maxHeight: 320,
    objectFit: "cover",
    display: "block",
  },
  status: {
    margin: 0,
    color: "#666",
    fontSize: 16,
  },
  error: {
    color: "#c0392b",
  },
  button: {
    padding: "10px 20px",
    fontSize: 16,
    fontWeight: 600,
    color: "#fff",
    background: "#4f46e5",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    transition: "background 0.2s ease",
  },
  buttonDisabled: {
    background: "#a5a5a5",
    cursor: "not-allowed",
  },
};
