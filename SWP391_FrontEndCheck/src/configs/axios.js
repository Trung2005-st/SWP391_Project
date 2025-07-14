import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/",

  // lưu ý, cái register hiện tại chưa sài đc do cái axios
});
api.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
// cái này bị lỗi toast ko import đc
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Nếu không có response (network error / backend down)
//     // hoặc status 401, 403 (token invalid/expired)
//     const isAuthError =
//       !error.response || [401, 403].includes(error.response.status);

//     if (isAuthError) {
//       // xóa token và clear Redux
//       localStorage.removeItem("token");
//       // nếu bạn đã import store và logout action:
//       // store.dispatch(logout());
//       // redirect về login
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthError =
      !error.response || [401, 403].includes(error.response.status);

    const url = error.config?.url || "";

    // Bypass redirect logic for public endpoints like login/register
    const isPublicEndpoint =
      url.includes("/login") || url.includes("/register");

    if (isAuthError && !isPublicEndpoint) {
      localStorage.removeItem("token");

      // Optional toast if you want user feedback
      toast.error("Session expired. Please log in again.");

      // Redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
