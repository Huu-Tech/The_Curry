import { useState } from "react";
import { useAuth } from "./AuthContext";
import "./auth.css";

// ─────────────────────────────────────────────────────────────────────────────
// SetupProfile — Step 3 of registration
// Collects email + password, saves to backend, logs user in
// ─────────────────────────────────────────────────────────────────────────────

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: "", segs: [] };
  let score = 0;
  if (password.length >= 8)              score++;
  if (/[A-Z]/.test(password))           score++;
  if (/[0-9]/.test(password))           score++;
  if (/[^A-Za-z0-9]/.test(password))    score++;

  const levels = [
    { label: "Too short",  cls: "weak" },
    { label: "Weak",       cls: "weak" },
    { label: "Fair",       cls: "fair" },
    { label: "Good",       cls: "good" },
    { label: "Strong 💪",  cls: "strong" },
  ];
  const segs = Array(4).fill("").map((_, i) => {
    if (i < score) return levels[score].cls;
    return "";
  });
  return { score, label: levels[score].label, segs };
}

export default function SetupProfile({ phone, onComplete }) {
  const { register } = useAuth();
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [confirm, setConfirm]       = useState("");
  const [showPass, setShowPass]     = useState(false);
  const [showConf, setShowConf]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");

  const strength = getPasswordStrength(password);

  const validate = () => {
    if (!email.includes("@") || !email.includes(".")) return "Please enter a valid email address.";
    if (password.length < 8)    return "Password must be at least 8 characters.";
    if (strength.score < 2)     return "Please choose a stronger password.";
    if (password !== confirm)   return "Passwords don't match.";
    return null;
  };

  const handleSubmit = async () => {
    setError("");
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    try {
      // TODO (backend): POST /api/auth/register
      // {
      //   phone,
      //   email,
      //   password,   ← backend MUST hash this (bcrypt) before storing
      // }
      // const res = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ phone, email, password }),
      // });
      // if (!res.ok) throw new Error((await res.json()).message);
      // const { token } = await res.json();
      // localStorage.setItem('tc_token', token); // save auth token

      await new Promise((r) => setTimeout(r, 1200));
      register({ phone, email });  // update global auth state
      onComplete();
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <aside className="auth-panel">
        <div className="panel-top">
          <div className="logo-mark">
            <div className="logo-dot-wrap">
              <span className="logo-dot center" /><span className="logo-dot top" />
              <span className="logo-dot left" /><span className="logo-dot right" />
            </div>
          </div>
          <div>
            <h1 className="brand-name">The Curry</h1>
            <p className="brand-sub">Taste of Madurai</p>
          </div>
        </div>

        <div className="step-indicator">
          <div className="step-item">
            <div className="step-num done">✓</div>
            <span className="step-label done">Mobile number</span>
          </div>
          <div className="step-connector" />
          <div className="step-item">
            <div className="step-num done">✓</div>
            <span className="step-label done">Verify OTP</span>
          </div>
          <div className="step-connector" />
          <div className="step-item">
            <div className="step-num active">3</div>
            <span className="step-label active">Set up profile</span>
          </div>
        </div>

        <blockquote className="panel-quote">
          <p>"Where every bite carries the soul of Madurai's streets."</p>
          <cite>— The Curry, since 2024</cite>
        </blockquote>
      </aside>

      <main className="auth-content">
        <div className="auth-card">
          <p className="form-eyebrow">Create account — Step 3 of 3</p>
          <h2 className="form-heading">Almost there!</h2>
          <div className="heading-accent" />
          <p className="form-sub">
            Set up your email and a password. You'll use these to sign in next time.
          </p>

          {error && <p className="form-error">{error}</p>}

          {/* Email */}
          <div className="field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="field">
            <label htmlFor="password">Set a password</label>
            <div className="pass-wrap">
              <input
                id="password"
                type={showPass ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="pass-toggle"
                onClick={() => setShowPass((p) => !p)}
                type="button"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
            {password && (
              <>
                <div className="strength-bar-wrap">
                  {strength.segs.map((cls, i) => (
                    <div key={i} className={`strength-seg ${cls}`} />
                  ))}
                </div>
                <p className="strength-text">{strength.label}</p>
              </>
            )}
          </div>

          {/* Confirm */}
          <div className="field">
            <label htmlFor="confirm">Confirm password</label>
            <div className="pass-wrap">
              <input
                id="confirm"
                type={showConf ? "text" : "password"}
                placeholder="Re-enter your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={confirm && confirm !== password ? "has-error" : ""}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
              <button
                className="pass-toggle"
                onClick={() => setShowConf((p) => !p)}
                type="button"
              >
                {showConf ? "Hide" : "Show"}
              </button>
            </div>
            {confirm && confirm !== password && (
              <p className="strength-text" style={{ color: "#cc3333" }}>Passwords don't match</p>
            )}
          </div>

          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
            style={{ marginTop: "0.5rem" }}
          >
            {loading ? "Creating your account…" : "Create account"}
          </button>
        </div>
      </main>
    </div>
  );
}
