import { useState } from "react";
import { useAuth } from "./AuthContext";
import "./LoginPage.css";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

/**
 * LoginPage
 * Props:
 *   onCreateAccount() — navigate to registration flow
 *   onGoogleSignIn()  — trigger Google OAuth
 */
export default function LoginPage({ onCreateAccount, onGoogleSignIn }) {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState(""); // email or phone
  const [password, setPassword]     = useState("");
  const [showPass, setShowPass]     = useState(false);
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!identifier.trim() || !password.trim()) {
      setError("Please enter your email / phone and password.");
      return;
    }

    setLoading(true);
    try {
      // TODO (backend): POST /api/auth/login  { identifier, password }
      // const res = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ identifier, password }),
      // });
      // if (!res.ok) throw new Error('Invalid credentials');
      // const { token, user } = await res.json();
      // localStorage.setItem('tc_token', token);
      // login(user);

      await new Promise((r) => setTimeout(r, 900));
      login({ email: identifier, phone: "" });
    } catch {
      setError("Incorrect email/phone or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <aside className="login-panel">
        <div className="panel-top">
          <div className="logo-mark">
            <div className="logo-dot-wrap">
              <span className="logo-dot center" /><span className="logo-dot top" />
              <span className="logo-dot left" /><span className="logo-dot right" />
            </div>
          </div>
          <h1 className="brand-name">The Curry</h1>
          <p className="brand-sub">Taste of Madurai</p>
        </div>
        <div className="spice-strip">
          <div className="spice-item"><span className="spice-dot" />Chettinad<span className="spice-line" /></div>
          <div className="spice-item"><span className="spice-dot" />Madurai Kari<span className="spice-line" /></div>
          <div className="spice-item"><span className="spice-dot" />Jigarthanda<span className="spice-line" /></div>
        </div>
        <blockquote className="panel-quote">
          <p>"Where every bite carries the soul of Madurai's streets."</p>
          <cite>— The Curry, since 2024</cite>
        </blockquote>
      </aside>

      <main className="login-form-wrap">
        <div className="login-card">
          <p className="form-eyebrow">Welcome back</p>
          <h2 className="form-heading">Sign in to your table</h2>
          <div className="heading-accent" />
          <p className="form-sub">Reserve, reorder, and revisit your favourites</p>

          {error && <p className="form-error">{error}</p>}

          <div className="field">
            <label htmlFor="identifier">Email or phone number</label>
            <input
              id="identifier"
              type="text"
              placeholder="you@example.com or 9876543210"
              value={identifier}
              autoComplete="username"
              onChange={(e) => setIdentifier(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <div className="pass-wrap">
              <input
                id="password"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
              <button className="pass-toggle" onClick={() => setShowPass((p) => !p)} type="button">
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="forgot-row">
            <button className="forgot-link">Forgot password?</button>
          </div>

          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <div className="divider">
            <div className="divider-line" />
            <span className="divider-text">or continue with</span>
            <div className="divider-line" />
          </div>

          <button
            className="btn-google"
            onClick={() => onGoogleSignIn ? onGoogleSignIn() : console.log("Google sign-in")}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="form-footer">
            New here?{" "}
            <button onClick={onCreateAccount}>Create an account</button>
          </p>
        </div>
      </main>
    </div>
  );
}
