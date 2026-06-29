import { useState } from "react";
import { AuthProvider, useAuth } from "./AuthContext";
import LoginPage    from "./LoginPage";
import PhoneEntry   from "./PhoneEntry";
import OtpVerify    from "./OtpVerify";
import SetupProfile from "./SetupProfile";

// ─────────────────────────────────────────────────────────────────────────────
// Screens
// ─────────────────────────────────────────────────────────────────────────────
const SCREENS = {
  LOGIN:    "LOGIN",
  PHONE:    "PHONE",
  OTP:      "OTP",
  PROFILE:  "PROFILE",
  HOME:     "HOME",       // placeholder — your teammate will build this
};

// ─────────────────────────────────────────────────────────────────────────────
// Inner app — has access to AuthContext
// ─────────────────────────────────────────────────────────────────────────────
function AppInner() {
  const { user, logout }  = useAuth();
  const [screen, setScreen] = useState(user ? SCREENS.HOME : SCREENS.LOGIN);
  const [phone, setPhone]   = useState("");

  // If already logged in, go straight to home
  if (user && screen === SCREENS.LOGIN) setScreen(SCREENS.HOME);

  // ── Temporary Home placeholder ─────────────────────────────────────────────
  // DELETE this block once your teammate builds the real home page.
  // Replace with:  import HomePage from './HomePage';  and render <HomePage />
  if (screen === SCREENS.HOME) {
    return (
      <div style={{
        minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
        flexDirection:"column", gap:"1rem", background:"#f1ebeb",
        fontFamily:"Georgia,serif",
      }}>
        <h1 style={{ color:"#660810", fontSize:"2rem" }}>🍛 Welcome to The Curry!</h1>
        <p style={{ color:"#7a6a6a", fontFamily:"Arial,sans-serif" }}>
          Signed in as <strong>{user?.email}</strong>
        </p>
        <p style={{ color:"#7a6a6a", fontFamily:"Arial,sans-serif", fontSize:"0.85rem" }}>
          (This is a placeholder — your teammate's home page goes here)
        </p>
        <button
          onClick={() => { logout(); setScreen(SCREENS.LOGIN); }}
          style={{
            marginTop:"1rem", padding:"0.7rem 1.5rem", background:"#660810",
            color:"#fff", border:"none", borderRadius:"6px", cursor:"pointer",
            fontFamily:"Arial,sans-serif", fontSize:"0.9rem",
          }}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <>
      {screen === SCREENS.LOGIN && (
        <LoginPage
          onCreateAccount={() => setScreen(SCREENS.PHONE)}
          onGoogleSignIn={() => console.log("TODO: Google OAuth")}
        />
      )}

      {screen === SCREENS.PHONE && (
        <PhoneEntry
          onOtpSent={(ph) => { setPhone(ph); setScreen(SCREENS.OTP); }}
          onBackToLogin={() => setScreen(SCREENS.LOGIN)}
        />
      )}

      {screen === SCREENS.OTP && (
        <OtpVerify
          phone={phone}
          onVerified={() => setScreen(SCREENS.PROFILE)}
          onBack={() => setScreen(SCREENS.PHONE)}
        />
      )}

      {screen === SCREENS.PROFILE && (
        <SetupProfile
          phone={phone}
          onComplete={() => setScreen(SCREENS.HOME)}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root — wraps everything in AuthProvider
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
