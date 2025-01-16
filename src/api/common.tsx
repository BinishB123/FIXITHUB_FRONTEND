import axios from 'axios';

export const apiUrl = 'api.binish.site'
export const axiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true,                
  headers: {
    'Content-Type': 'application/json', 
   

  
  }
});







