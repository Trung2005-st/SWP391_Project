// src/utils/requireAuthLoader.js
import { redirect } from "react-router-dom";
import { ROUTES } from "../configs/routes";

/**
 * Giải mã payload của JWT (phần giữa)
 */
function parseJwt(token) {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Loader chạy trước khi vào các route protected.
 * Nếu không có token hoặc đã hết hạn -> redirect về LOGIN
 */
export function requireAuthLoader() {
  const token = localStorage.getItem("token");
  if (!token) {
    // chưa login
    return redirect(ROUTES.LOGIN);
  }

  const payload = parseJwt(token);
  if (!payload || typeof payload.exp !== "number") {
    // token không hợp lệ
    localStorage.removeItem("token");
    return redirect(ROUTES.LOGIN);
  }

  // kiểm tra hết hạn (exp là timestamp seconds)
  if (Date.now() >= payload.exp * 1000) {
    localStorage.removeItem("token");
    return redirect(ROUTES.LOGIN);
  }

  // OK: cho phép tiếp tục
  return null;
}
