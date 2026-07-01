import "./AboutPage.css";
import { SiteNav } from "./HomePage";

/**
 * AboutPage
 * Props:
 *   onNavigate(route) — navigate between pages
 *   onCartOpen()      — open cart
 *   userInitials      — e.g. "RK"
 */
export default function AboutPage({ onNavigate, onCartOpen, userInitials = "RK" }) {
  return (
    <div className="about-page">
      <SiteNav
        activePage="about"
        onNavigate={onNavigate}
        onCartOpen={onCartOpen}
        userInitials={userInitials}
      />

      {/* ── Hero ── */}
      <section className="about-hero">
        <p className="about-eyebrow">Our story</p>
        <h1 className="about-hero-quote">
          "Bringing the taste of home, one Madurai recipe at a time."
        </h1>
      </section>

      {/* ── Story ── */}
      <section className="about-story">
        <div className="story-grid">
          <div className="story-img">🍛</div>
          <div>
            <p className="story-eyebrow">Where it began</p>
            <h2 className="story-title">From Madurai's streets to Bengaluru's tables</h2>
            <p className="story-body">
              The Curry started in Kothanur with a simple idea: recreate the bold, unmistakable
              flavours of Madurai's home kitchens and street stalls for the Tamil community living
              far from it — and for anyone curious enough to try.
            </p>
            <p className="story-body">
              Every recipe, from the kari dosa to the slow-roasted mutton curry, is built on
              home-ground masala and techniques passed down through generations, not shortcuts.
            </p>
            <div className="story-divider" />
            <div className="founder-row">
              <div className="founder-avatar">SJ</div>
              <div>
                <p className="founder-name">Samuel Jebakumar</p>
                <p className="founder-title">Founder</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Promise ── */}
      <section className="about-promise">
        <div className="promise-inner">
          <p className="promise-eyebrow">What we stand for</p>
          <h2 className="promise-title">The Curry's promise</h2>
          <div className="promise-grid">
            {[
              { icon: "🌶️", title: "Home-ground masala", desc: "Spices ground fresh daily, never store-bought blends" },
              { icon: "🥬", title: "Fresh ingredients", desc: "Sourced daily, nothing frozen or pre-cooked" },
              { icon: "🏠", title: "Madurai hospitality", desc: "Warm service, just like eating at home" },
            ].map((p) => (
              <div className="promise-card" key={p.title}>
                <div className="promise-icon">{p.icon}</div>
                <p className="promise-card-title">{p.title}</p>
                <p className="promise-card-desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <div className="about-stats">
        {[
          { num: "4.2★", label: "Average rating" },
          { num: "1,073+", label: "Reviews" },
          { num: "40+", label: "Dishes on the menu" },
          { num: "Kothanur", label: "Bengaluru" },
        ].map((s) => (
          <div className="about-stat" key={s.label}>
            <div className="about-stat-num">{s.num}</div>
            <div className="about-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── CTA ── */}
      <section className="about-cta">
        <h2 className="about-cta-title">Taste Madurai for yourself</h2>
        <p className="about-cta-sub">Order online or visit us for the full experience</p>
        <div className="about-cta-actions">
          <button className="btn-cta-primary" onClick={() => onNavigate("menu")}>Order now</button>
          <button className="btn-cta-ghost" onClick={() => onNavigate("home")}>Back to home</button>
        </div>
      </section>

      {/* ── Address strip ── */}
      <div className="about-address">
        <div className="address-strip">
          <div className="address-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
            No. 189, K Narayanapura Main Rd, Kothanur, Bengaluru
          </div>
          <div className="address-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.77-1.77a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round"/></svg>
            +91 98765 43210
          </div>
          <div className="address-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Open till 11:00 pm
          </div>
        </div>
      </div>
    </div>
  );
}
