import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `http://localhost:3000`,
});

function useAxios() {
  return axiosInstance;
}

export default useAxios;
