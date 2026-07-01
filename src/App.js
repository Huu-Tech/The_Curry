import { useState } from "react";
import { AuthProvider, useAuth } from "./AuthContext";
import LoginPage    from "./LoginPage";
import PhoneEntry   from "./PhoneEntry";
import OtpVerify    from "./OtpVerify";
import SetupProfile from "./SetupProfile";
import HomePage     from "./HomePage";
import AboutPage    from "./AboutPage";
import MenuPage     from "./MenuPage";

// ─────────────────────────────────────────────────────────────────────────────
// All screens in the app
// ─────────────────────────────────────────────────────────────────────────────
const SCREENS = {
  LOGIN:   "LOGIN",
  PHONE:   "PHONE",
  OTP:     "OTP",
  PROFILE: "PROFILE",
  HOME:    "HOME",
  MENU:    "MENU",
  ABOUT:   "ABOUT",
  ORDERS:  "ORDERS",   // placeholder for teammate
};

function AppInner() {
  const { user } = useAuth();
  const [screen, setScreen] = useState(SCREENS.LOGIN);
  const [phone, setPhone]   = useState("");

  // If already logged in and somehow on LOGIN, redirect to HOME
  if (user && screen === SCREENS.LOGIN) setScreen(SCREENS.HOME);

  // Central navigate function — passed as prop to every page
  const navigate = (route) => {
    const map = {
      home:   SCREENS.HOME,
      menu:   SCREENS.MENU,
      about:  SCREENS.ABOUT,
      orders: SCREENS.ORDERS,
      login:  SCREENS.LOGIN,
    };
    setScreen(map[route] || SCREENS.HOME);
  };

  // ── Auth pages ────────────────────────────────────────────────────────────
  if (screen === SCREENS.LOGIN) {
    return (
      <LoginPage
        onCreateAccount={() => setScreen(SCREENS.PHONE)}
        onGoogleSignIn={() => console.log("TODO: Google OAuth")}
      />
    );
  }
  if (screen === SCREENS.PHONE) {
    return (
      <PhoneEntry
        onOtpSent={(ph) => { setPhone(ph); setScreen(SCREENS.OTP); }}
        onBackToLogin={() => setScreen(SCREENS.LOGIN)}
      />
    );
  }
  if (screen === SCREENS.OTP) {
    return (
      <OtpVerify
        phone={phone}
        onVerified={() => setScreen(SCREENS.PROFILE)}
        onBack={() => setScreen(SCREENS.PHONE)}
      />
    );
  }
  if (screen === SCREENS.PROFILE) {
    return (
      <SetupProfile
        phone={phone}
        onComplete={() => setScreen(SCREENS.HOME)}
      />
    );
  }

  // ── Main app pages (need to be logged in) ────────────────────────────────
  const userInitials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "RK";

  if (screen === SCREENS.HOME) {
    return (
      <HomePage
        onNavigate={navigate}
        onCartOpen={() => console.log("TODO: open cart drawer")}
        userInitials={userInitials}
      />
    );
  }
  if (screen === SCREENS.MENU) {
    return (
      <MenuPage
        onCartOpen={() => console.log("TODO: open cart drawer")}
        onNavigate={navigate}
        userInitials={userInitials}
      />
    );
  }
  if (screen === SCREENS.ABOUT) {
    return (
      <AboutPage
        onNavigate={navigate}
        onCartOpen={() => console.log("TODO: open cart drawer")}
        userInitials={userInitials}
      />
    );
  }
  if (screen === SCREENS.ORDERS) {
    // Placeholder until your teammate builds it
    return (
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:"1rem", background:"#f1ebeb", fontFamily:"Georgia,serif" }}>
        <h2 style={{ color:"#660810" }}>Orders page coming soon</h2>
        <p style={{ color:"#7a6a6a", fontFamily:"Arial,sans-serif", fontSize:"0.9rem" }}>Your teammate is building this!</p>
        <button onClick={() => navigate("home")} style={{ padding:"0.7rem 1.5rem", background:"#660810", color:"#fff", border:"none", borderRadius:"6px", cursor:"pointer", fontFamily:"Arial,sans-serif" }}>Back to home</button>
      </div>
    );
  }
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
