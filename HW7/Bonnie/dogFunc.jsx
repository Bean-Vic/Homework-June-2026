// Write a functional component with React hooks:

//
// Note: use following API with GET method https://dog.ceo/api/breeds/image/random
// (https://dog.ceo/dog-api/)

import React,{useEffect,useState} from "react";

export const ForDogs =()=>{
    const [dogImage, setDogImage]=useState("");
    const [loading, setLoading] =useState(false);
    const [errorHandle, setErrorHandle] = useState(false);
    
    const fecthDog =async ()=>{
        try {
            setLoading(true);
            setErrorHandle(false);
            const response= await fetch("https://dog.ceo/api/breeds/image/random");
            
            if(!response.ok){
                throw new Error("Failed to fetch");
            }
            const data = await response.json();
            setDogImage(data.message)

        } catch (error) {
            setErrorHandle(true);
            console.log(error);

        }finally{
            setLoading(false);
        }
      
    };

    useEffect(()=>{
        fecthDog();
    },[])

    const handleChange=()=>{
        fecthDog(); 
    }
    
    // 1. Fetches a random dog image from a public API#
    // 2. Render the dog image base on API response#
    // 3. Build a "Get Another Dog" button to fetch a new image#
    // 4. have a loading state while API is loading#
     //5. use fetch() method to make API request#
    // 6. should properly handle failure API requests
    // 7. Extra Credit: Instead of using fetch() , use Axios with Factory design
    // pattern to make the API request
    //const responseJson = await dogData.json();
    
// 8. Bonus: Make you App look pretty by using 3rd party CSS components like
// MUI/tailwindCSS

    //console.log(responseJson)
    
        return(
            <>
            <h1>random dog</h1>
            {loading && <p>Loading....</p>}
            {errorHandle && <p>Error: can not fecth image....</p>  }
            {dogImage && <img src={dogImage} alt="random dog" width={300}/>}
            <button  onClick={handleChange}>get Another Dog</button>
            
            </>
        )
    
}




