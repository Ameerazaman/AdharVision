import axios, { AxiosInstance, AxiosError } from 'axios';

export const aadharApi: AxiosInstance = axios.create({
  baseURL: "http://localhost:5000/adhaar",

  withCredentials: true
});

aadharApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response) {
      console.error("Error Response:", error.response.data);
    } else if (error.request) {
      console.error("No Response:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);
