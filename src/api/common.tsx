import axios from 'axios';

export const apiUrl = 'http://localhost:3000'
export const axiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true,                
  headers: {
    'Content-Type': 'application/json', 
   

  
  }
});







