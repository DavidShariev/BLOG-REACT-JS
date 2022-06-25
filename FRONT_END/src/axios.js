import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:4444",
});

instance.interceptors.request.use((config) => {
  //всегда проверять есть ли токен
  config.headers.Authorization = window.localStorage.getItem("token");

  return config;
});

export default instance;
