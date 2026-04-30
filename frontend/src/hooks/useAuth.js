import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

export default function useAuth() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "" });
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  useEffect(() => {
    localStorage.setItem("token", token || "");
    localStorage.setItem("user", JSON.stringify(user || null));
  }, [token, user]);

  const api = (path, options) => apiRequest(path, token, options);

  async function register() {
    const res = await api("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(registerForm),
    });
    setToken(res.token);
    setUser(res.user);
    return res;
  }

  async function login() {
    const res = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(loginForm),
    });
    setToken(res.token);
    setUser(res.user);
    return res;
  }

  return {
    token,
    user,
    registerForm,
    setRegisterForm,
    loginForm,
    setLoginForm,
    api,
    register,
    login,
  };
}
