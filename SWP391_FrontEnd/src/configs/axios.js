import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/",

  // lưu ý, cái register hiện tại chưa sài đc do cái axios
});

export default api;
