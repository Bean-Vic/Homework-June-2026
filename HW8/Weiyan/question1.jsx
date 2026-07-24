import React, { useState, useEffect } from 'react';

function RandomDogImage() {
    const [imageUrl, setImageUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const handleFetchImage = async () => {
        setIsLoading(true);
    
        try {
            const response = await fetch('https://dog.ceo/api/breeds/image/random');
            const data = await response.json();

            if (data.status === 'success') {
                setImageUrl(data.message);
            }
        } catch (error) {
            console.error('Failed to fetch the dog image:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { handleFetchImage(); }, []);

    return (
        <div className="max-w-sm mx-auto mt-10 text-center">
            <h2 className="mb-4 text-xl font-semibold">Random Dog Generator</h2>

            <div className="mb-4">
            {isLoading ? (
                <p>loading...</p>
            ) : (
                <img src={imageUrl} alt="A random image of a dog" className="w-full h-64 object-cover rounded"/>
            )}
            </div>

            <button
            onClick={handleFetchImage}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
            Get Another Dog
            </button>
        </div>
    );
}

export default RandomDogImage;
