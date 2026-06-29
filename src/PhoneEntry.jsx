import { useState } from "react";
import "./auth.css";

// ─────────────────────────────────────────────────────────────────────────────
// PhoneEntry — Step 1 of registration
// Collects phone number and triggers OTP send
// ─────────────────────────────────────────────────────────────────────────────

export default function PhoneEntry({ onOtpSent, onBackToLogin }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async () => {
    setError("");
    const digits = phone.replace(/\D/g, "");

    if (digits.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    try {
      // TODO (backend): POST /api/auth/send-otp  { phone: "+91" + digits }
      // const res = await fetch('/api/auth/send-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ phone: "+91" + digits }),
      // });
      // if (!res.ok) throw new Error('Failed to send OTP');

      await new Promise((r) => setTimeout(r, 1000)); // simulated delay
      onOtpSent("+91" + digits);
    } catch {
      setError("Couldn't send OTP. Please try again.");
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
            <div className="step-num active">1</div>
            <span className="step-label active">Mobile number</span>
          </div>
          <div className="step-connector" />
          <div className="step-item">
            <div className="step-num">2</div>
            <span className="step-label">Verify OTP</span>
          </div>
          <div className="step-connector" />
          <div className="step-item">
            <div className="step-num">3</div>
            <span className="step-label">Set up profile</span>
          </div>
        </div>

        <blockquote className="panel-quote">
          <p>"Where every bite carries the soul of Madurai's streets."</p>
          <cite>— The Curry, since 2024</cite>
        </blockquote>
      </aside>

      <main className="auth-content">
        <div className="auth-card">
          <button className="btn-back" onClick={onBackToLogin}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to sign in
          </button>

          <p className="form-eyebrow">Create account — Step 1 of 3</p>
          <h2 className="form-heading">What's your number?</h2>
          <div className="heading-accent" />
          <p className="form-sub">
            We'll send a one-time password to verify it's really you.
          </p>

          {error && <p className="form-error">{error}</p>}

          <div className="field">
            <label htmlFor="phone">Mobile number</label>
            <div className="phone-wrap">
              <span className="country-code">🇮🇳 +91</span>
              <input
                id="phone"
                type="tel"
                placeholder="98765 43210"
                value={phone}
                maxLength={10}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
              />
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={handleSendOtp}
            disabled={loading || phone.length < 10}
          >
            {loading ? "Sending OTP…" : "Send OTP"}
          </button>

          <p className="form-footer">
            Already have an account?{" "}
            <button onClick={onBackToLogin}>Sign in</button>
          </p>
        </div>
      </main>
    </div>
  );
}
