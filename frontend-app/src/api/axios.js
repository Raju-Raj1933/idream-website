import axios from "axios";

const instance = axios.create({
  baseURL: "https://iprep-project.onrender.com/api",
  withCredentials: true
});

export default instance;
