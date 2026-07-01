import { createContext, useContext, useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// AuthContext — shared auth state across all pages
//
// Any page can call:
//   const { user, login, logout, register } = useAuth();
//
// Your backend teammate replaces the TODO sections with real API calls.
// ─────────────────────────────────────────────────────────────────────────────

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // user = { phone, email } if logged in, null if not
  const [user, setUser] = useState(null);

  // ── Called after OTP verified + profile set up ──────────────────────────
  const register = ({ phone, email }) => {
    const userData = { phone, email };
    localStorage.setItem("tc_user", JSON.stringify(userData));
    setUser(userData);
  };

  // ── Called on successful login ───────────────────────────────────────────
  const login = ({ email, phone }) => {
    const userData = { phone, email };
    localStorage.setItem("tc_user", JSON.stringify(userData));
    setUser(userData);
  };

  // ── Called on logout ─────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("tc_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
