import { createContext, useState, useEffect } from "react";
import { api } from "../api";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

function loadStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser); // {id, email, role} or null

  // Validate the stored token once on load
  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    api
      .get("/auth/me")
      .then(({ user }) => saveSession(localStorage.getItem("token"), user))
      .catch(() => logOut());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function saveSession(token, user) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  }

  async function signUp(email, password, role = "buyer") {
    try {
      const data = await api.post("/auth/signup", { email, password, role });
      saveSession(data.token, data.user);
      return { success: true, message: "User registered successfully", user: data.user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  async function logIn(email, password) {
    try {
      const data = await api.post("/auth/login", { email, password });
      saveSession(data.token, data.user);
      return { success: true, message: "Logged in successfully", user: data.user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  function logOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signUp, user, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}
