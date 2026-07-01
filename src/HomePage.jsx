import { useState, useMemo } from "react";
import "./HomePage.css";

// ─────────────────────────────────────────────────────────────────────────────
// Shared nav component — used by HomePage and AboutPage
// ─────────────────────────────────────────────────────────────────────────────
export function SiteNav({ activePage, onNavigate, cartCount = 0, onCartOpen, userInitials = "RK" }) {
  return (
    <nav className="site-nav">
      <div className="nav-brand" onClick={() => onNavigate("home")} style={{ cursor: "pointer" }}>
        <div className="nav-logo">
          <div className="nav-logo-dot-wrap">
            <span className="nav-logo-dot center" /><span className="nav-logo-dot top" />
            <span className="nav-logo-dot left" /><span className="nav-logo-dot right" />
          </div>
        </div>
        <div className="nav-brand-text">
          <div className="nav-brand-name">The Curry</div>
          <div className="nav-brand-sub">Taste of Madurai</div>
        </div>
      </div>

      <div className="nav-links">
        {["home", "menu", "about", "orders"].map((page) => (
          <button
            key={page}
            className={`nav-link${activePage === page ? " active" : ""}`}
            onClick={() => onNavigate(page)}
          >
            {page.charAt(0).toUpperCase() + page.slice(1)}
          </button>
        ))}
      </div>

      <div className="nav-right">
        <div className="nav-search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input placeholder="Search for dishes" onFocus={() => onNavigate("menu")} readOnly />
        </div>
        <button className="cart-icon-btn" onClick={onCartOpen} aria-label="Open cart">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" />
            <path d="M2.5 3h2l2.6 12.6a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {cartCount > 0 && <span className="cart-icon-badge">{cartCount}</span>}
        </button>
        <div className="user-avatar">{userInitials}</div>
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Menu data — same source as MenuPage
// TODO (backend): fetch from /api/menu and pass as prop instead
// ─────────────────────────────────────────────────────────────────────────────
const FEATURED = [
  { id: "b1", name: "Chicken biryani", desc: "Slow-cooked with seeraga samba rice, raita on the side", price: 220, veg: false, bestseller: true, emoji: "🍛" },
  { id: "b2", name: "Mutton biryani", desc: "Tender mutton, Madurai-style masala, served hot", price: 260, veg: false, bestseller: false, emoji: "🍛" },
  { id: "s2", name: "Fish fry meals", desc: "Crispy fried fish, rice, sambar and curry", price: 240, veg: false, bestseller: false, emoji: "🐟" },
  { id: "p1", name: "Chicken kothu parotta", desc: "Shredded parotta tossed with egg and curry gravy", price: 190, veg: false, bestseller: true, emoji: "🫓" },
  { id: "d2", name: "Ghee dosa", desc: "Crisp dosa finished with ghee, served with chutney", price: 110, veg: true, bestseller: false, emoji: "🥞" },
  { id: "m1", name: "Prawn roast", desc: "Pan-roasted prawns with shallots and gingelly oil", price: 280, veg: false, bestseller: true, emoji: "🦐" },
];

const DESSERTS = [
  { id: "ds1", name: "Madurai jigarthanda", desc: "Chilled milk, nannari syrup and a scoop of ice cream", price: 120, veg: true, emoji: "🧋" },
  { id: "ds2", name: "Gulab jamun", desc: "Warm milk dumplings soaked in cardamom syrup", price: 90, veg: true, emoji: "🍮" },
  { id: "ds3", name: "Paal payasam", desc: "Slow-simmered rice pudding with jaggery and ghee", price: 100, veg: true, emoji: "🍚" },
];

// ─────────────────────────────────────────────────────────────────────────────
// DishCard — reusable card with add/qty stepper
// ─────────────────────────────────────────────────────────────────────────────
function DishCard({ item, qty, onAdd, onInc, onDec }) {
  return (
    <div className="dish-card-home">
      <div className="dish-img">
        <span>{item.emoji}</span>
        {item.bestseller && <span className="dish-img-badge">Bestseller</span>}
        <span className={`dish-diet-flag ${item.veg ? "veg" : "nonveg"}`} />
      </div>
      <div className="dish-body">
        <p className="dish-card-name">{item.name}</p>
        <p className="dish-card-desc">{item.desc}</p>
        <div className="dish-card-footer">
          <span className="dish-card-price">₹{item.price}</span>
          {qty === 0 ? (
            <button className="btn-add-card" onClick={() => onAdd(item.id)}>Add</button>
          ) : (
            <div className="qty-stepper-home">
              <button className="qty-btn-home" onClick={() => onDec(item.id)}>−</button>
              <span className="qty-val-home">{qty}</span>
              <button className="qty-btn-home" onClick={() => onInc(item.id)}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HomePage
// Props:
//   onNavigate(route)  — navigate to "menu", "about", "orders"
//   onCartOpen()       — open cart drawer
//   userInitials       — e.g. "RK"
// ─────────────────────────────────────────────────────────────────────────────
export default function HomePage({ onNavigate, onCartOpen, userInitials = "RK" }) {
  const [filter, setFilter]   = useState("all"); // "all" | "veg" | "nonveg"
  const [cart, setCart]       = useState({});

  const addToCart    = (id) => setCart((c) => ({ ...c, [id]: 1 }));
  const incrementQty = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const decrementQty = (id) => setCart((c) => {
    const next = { ...c };
    if (next[id] <= 1) delete next[id]; else next[id] -= 1;
    return next;
  });

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = useMemo(() => {
    let t = 0;
    [...FEATURED, ...DESSERTS].forEach((i) => { if (cart[i.id]) t += cart[i.id] * i.price; });
    return t;
  }, [cart]);

  const filteredFeatured = FEATURED.filter((i) => {
    if (filter === "veg") return i.veg;
    if (filter === "nonveg") return !i.veg;
    return true;
  });

  return (
    <div className="home-page">
      <SiteNav
        activePage="home"
        onNavigate={onNavigate}
        cartCount={cartCount}
        onCartOpen={onCartOpen}
        userInitials={userInitials}
      />

      {/* ── Hero ── */}
      <section className="home-hero">
        <div className="hero-inner">
          <p className="hero-eyebrow">Madurai street food, Bengaluru table</p>
          <h1 className="hero-title">
            Chettinad curries,<br />
            <span>slow-cooked the traditional way</span>
          </h1>
          <p className="hero-sub">
            Kari dosa, kothu parotta and biryanis made fresh with home-ground masala,
            just like back home in Madurai.
          </p>
          <div className="hero-actions">
            <button className="btn-hero-primary" onClick={() => onNavigate("menu")}>Order now</button>
            <button className="btn-hero-ghost" onClick={() => onNavigate("about")}>Our story</button>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <div className="stats-strip">
        {[
          { num: "4.2★", label: "Average rating" },
          { num: "1,073+", label: "Reviews" },
          { num: "40+", label: "Dishes on the menu" },
          { num: "Kothanur", label: "Bengaluru" },
        ].map((s) => (
          <div className="stat-item" key={s.label}>
            <div className="stat-num">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Today's menu ── */}
      <div className="home-section">
        <div className="section-header">
          <h2 className="section-title">Today's menu</h2>
          <button className="section-link" onClick={() => onNavigate("menu")}>View full menu →</button>
        </div>

        <div className="filter-pills">
          <button className={`pill${filter === "all" ? " active" : ""}`} onClick={() => setFilter("all")}>All items</button>
          <button className={`pill veg-pill${filter === "veg" ? " active" : ""}`} onClick={() => setFilter("veg")}>
            <span className="pill-dot" />Veg
          </button>
          <button className={`pill nonveg-pill${filter === "nonveg" ? " active" : ""}`} onClick={() => setFilter("nonveg")}>
            <span className="pill-dot" />Non-veg
          </button>
        </div>

        <div className="dish-grid">
          {filteredFeatured.map((item) => (
            <DishCard
              key={item.id} item={item} qty={cart[item.id] || 0}
              onAdd={addToCart} onInc={incrementQty} onDec={decrementQty}
            />
          ))}
        </div>
      </div>

      {/* ── Desserts ── */}
      <div className="dessert-strip">
        <div className="home-section">
          <div className="section-header">
            <h2 className="section-title">Desserts</h2>
          </div>
          <div className="dessert-grid">
            {DESSERTS.map((item) => (
              <DishCard
                key={item.id} item={item} qty={cart[item.id] || 0}
                onAdd={addToCart} onInc={incrementQty} onDec={decrementQty}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="home-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-mark"><div className="footer-logo-dot" /></div>
              <span className="footer-brand-name">The Curry</span>
            </div>
            <p className="footer-tagline">
              Authentic Madurai-style Chettinad cuisine, biryanis and street food,
              served fresh in Kothanur, Bengaluru.
            </p>
            <div className="footer-socials">
              {["f", "ig", "tw"].map((s) => (
                <button key={s} className="social-btn">{s === "f" ? "f" : s === "ig" ? "ig" : "tw"}</button>
              ))}
            </div>
          </div>

          <div>
            <p className="footer-col-title">Explore</p>
            {["Full menu", "Catering", "Reservations", "Reviews"].map((l) => (
              <button key={l} className="footer-link">{l}</button>
            ))}
          </div>

          <div>
            <p className="footer-col-title">Help</p>
            {["Track order", "Delivery info", "Contact us", "FAQs"].map((l) => (
              <button key={l} className="footer-link">{l}</button>
            ))}
          </div>

          <div>
            <p className="footer-col-title">Visit us</p>
            <div className="footer-address-line">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
              <span>No. 189, K Narayanapura Main Rd, Kothanur, Bengaluru</span>
            </div>
            <div className="footer-address-line">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.77-1.77a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span>+91 98765 43210</span>
            </div>
            <div className="footer-address-line">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>Open till 11:00 pm</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copy">© 2026 The Curry – Taste of Madurai. All rights reserved.</span>
          <div className="footer-legal">
            <button>Privacy policy</button>
            <button>Terms of service</button>
          </div>
        </div>
      </footer>

      {/* ── Floating cart ── */}
      <button className={`cart-float-home${cartCount > 0 ? " visible" : ""}`} onClick={onCartOpen}>
        <span className="cart-float-count">{cartCount}</span>
        <span className="cart-float-text">View cart</span>
        <span className="cart-float-total">₹{cartTotal}</span>
      </button>
    </div>
  );
}
