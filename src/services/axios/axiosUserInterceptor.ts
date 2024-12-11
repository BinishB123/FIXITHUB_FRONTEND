import axios from 'axios';

const axiosUserInstance = axios.create({
    baseURL: 'http://localhost:3000/api/user',
    withCredentials: true
});


axiosUserInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshResponse = await axiosUserInstance.post('/auth/token');
                if (refreshResponse.status === 200) {
                    return axiosUserInstance(originalRequest);
                }
            } catch (refreshError) {
                console.log('Refresh token expired. User needs to log in again.');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default axiosUserInstance;
