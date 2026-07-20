import axios from 'axios';

export const fetchRandomDog = () =>
  axios.get('https://dog.ceo/api/breeds/image/random');
