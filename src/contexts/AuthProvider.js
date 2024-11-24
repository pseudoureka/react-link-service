import { createContext, useContext, useEffect, useState } from "react";
import axios from "../lib/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  updateMe: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  async function getMe() {
    const res = await axios.get("/users/me");
    const nextUser = res.data;
    setUser(nextUser);
  }

  async function login({ email, password }) {
    await axios.post("/auth/login", {
      email,
      password,
    });

    await getMe();
  }

  async function logout() {
    // @TODO 로그아웃
  }

  async function updateMe(formData) {
    const res = await axios.patch("/users/me", formData);
    const nextUser = res.data;
    setUser(nextUser);
  }

  useEffect(() => {
    getMe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(required) {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error("반드시 AuthProvider 안에서 작성되어야 합니다.");
  }

  useEffect(() => {
    if (required && !context.user) {
      navigate("/login");
    }
  }, [required, navigate, context.user]);

  return context;
}
