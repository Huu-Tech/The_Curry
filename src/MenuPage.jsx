import { useState, useMemo, useRef } from "react";
import "./MenuPage.css";

// ─────────────────────────────────────────────────────────────────────────────
// Menu data
// TODO (backend): replace this with a real fetch, e.g.
//   const [menuData, setMenuData] = useState([]);
//   useEffect(() => { fetch('/api/menu').then(r => r.json()).then(setMenuData); }, []);
// Keep the same shape: array of categories, each with an items array.
// ─────────────────────────────────────────────────────────────────────────────
const MENU_DATA = [
  {
    id: "biryani", name: "Biryani", emoji: "🍛",
    items: [
      { id: "b1", name: "Chicken biryani", desc: "Seeraga samba rice, Madurai-style masala, served with raita", price: 220, veg: false, bestseller: true },
      { id: "b2", name: "Mutton biryani", desc: "Tender mutton slow-cooked with home-ground spices", price: 260, veg: false, bestseller: false },
      { id: "b3", name: "Plain biryani rice", desc: "Fragrant seeraga samba rice, served with side gravy", price: 140, veg: true, bestseller: false },
    ],
  },
  {
    id: "dosa", name: "Dosa & Tiffin", emoji: "🥞",
    items: [
      { id: "d1", name: "Kari dosa", desc: "Crisp dosa stuffed with spicy mutton kari masala", price: 150, veg: false, bestseller: true },
      { id: "d2", name: "Ghee dosa", desc: "Crisp dosa finished with ghee, served with chutney", price: 110, veg: true, bestseller: false },
      { id: "d3", name: "Idly with veg kurma", desc: "Soft idlies served with a side of veg kurma", price: 90, veg: true, bestseller: false },
    ],
  },
  {
    id: "parotta", name: "Parotta", emoji: "🫓",
    items: [
      { id: "p1", name: "Chicken kothu parotta", desc: "Shredded parotta tossed with egg and curry's special gravy", price: 190, veg: false, bestseller: true },
      { id: "p2", name: "Chicken poricha parotta", desc: "Fried parotta topped with chicken and special gravy", price: 180, veg: false, bestseller: false },
      { id: "p3", name: "Plain parotta (3 pcs)", desc: "Layered, flaky parotta — pair with any curry", price: 90, veg: true, bestseller: false },
    ],
  },
  {
    id: "seafood", name: "Seafood", emoji: "🐟",
    items: [
      { id: "s1", name: "Fish fry meals", desc: "Crispy fried fish, rice, sambar and fish curry", price: 240, veg: false, bestseller: false },
      { id: "s2", name: "Prawns roast", desc: "Pan-roasted prawns with shallots and gingelly oil", price: 280, veg: false, bestseller: true },
    ],
  },
  {
    id: "mutton-chicken", name: "Mutton & Chicken", emoji: "🍗",
    items: [
      { id: "m1", name: "Mutton curry", desc: "Boneless mutton roasted with shallots and gingelly oil", price: 250, veg: false, bestseller: false },
      { id: "m2", name: "Kalakki", desc: "Mutton liver roasted in tawa with curry's special masala", price: 230, veg: false, bestseller: false },
    ],
  },
  {
    id: "combos", name: "Meal Combos", emoji: "🍱",
    items: [
      { id: "c1", name: "Non-veg meals — chicken meal", desc: "Chicken sukka, parotta, omelette, white rice and fish curry", price: 320, veg: false, bestseller: true },
      { id: "c2", name: "Mini chicken biryani + 2 parotta", desc: "Mini chicken biryani served with two soft parottas", price: 210, veg: false, bestseller: false },
    ],
  },
  {
    id: "desserts", name: "Desserts", emoji: "🍮",
    items: [
      { id: "ds1", name: "Madurai jigarthanda", desc: "Chilled milk, nannari syrup and a scoop of ice cream", price: 120, veg: true, bestseller: false },
      { id: "ds2", name: "Paal payasam", desc: "Slow-simmered rice pudding with jaggery and ghee", price: 100, veg: true, bestseller: false },
    ],
  },
];

function GoogleSearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}
function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" />
      <path d="M2.5 3h2l2.6 12.6a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="cart-float-arrow">
      <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * MenuPage
 * Props:
 *   userInitials  — e.g. "RK", shown in the top-right avatar
 *   onCartOpen()  — called when the user clicks the cart icon or floating bar
 *   onNavigate(route) — called when Home / About / Orders nav links are clicked
 */
export default function MenuPage({ userInitials = "RK", onCartOpen, onNavigate }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [vegOnly, setVegOnly] = useState(false);
  const [nonVegOnly, setNonVegOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState({}); // { itemId: qty }
  const sectionRefs = useRef({});

  const totalItems = useMemo(() => MENU_DATA.reduce((sum, c) => sum + c.items.length, 0), []);

  // Filtered categories based on search + diet toggles
  const visibleCategories = useMemo(() => {
    return MENU_DATA.map((cat) => {
      let items = cat.items;
      if (vegOnly)    items = items.filter((i) => i.veg);
      if (nonVegOnly) items = items.filter((i) => !i.veg);
      if (search.trim()) {
        const q = search.toLowerCase();
        items = items.filter((i) => i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q));
      }
      return { ...cat, items };
    }).filter((cat) => cat.items.length > 0);
  }, [vegOnly, nonVegOnly, search]);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = useMemo(() => {
    let total = 0;
    MENU_DATA.forEach((cat) => cat.items.forEach((item) => {
      if (cart[item.id]) total += cart[item.id] * item.price;
    }));
    return total;
  }, [cart]);

  const addToCart    = (id) => setCart((c) => ({ ...c, [id]: 1 }));
  const incrementQty = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const decrementQty = (id) => setCart((c) => {
    const next = { ...c };
    if (next[id] <= 1) delete next[id];
    else next[id] -= 1;
    return next;
  });

  const scrollToCategory = (catId) => {
    setActiveCategory(catId);
    if (catId === "all") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    sectionRefs.current[catId]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="menu-page">
      {/* ── Top nav ── */}
      <nav className="menu-nav">
        <div className="nav-brand">
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
          <button className="nav-link" onClick={() => onNavigate?.("home")}>Home</button>
          <button className="nav-link active">Menu</button>
          <button className="nav-link" onClick={() => onNavigate?.("about")}>About</button>
          <button className="nav-link" onClick={() => onNavigate?.("orders")}>Orders</button>
        </div>

        <div className="nav-actions">
          <div className="nav-search">
            <GoogleSearchIcon />
            <input
              type="text"
              placeholder="Search for dishes"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="cart-btn" onClick={onCartOpen} aria-label="Open cart">
            <CartIcon />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          <div className="nav-avatar">{userInitials}</div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="menu-hero">
        <h1 className="hero-title">Full menu</h1>
        <p className="hero-sub">{totalItems} dishes · Madurai-style biryanis, parottas, dosas and more</p>
      </div>

      {/* ── Body ── */}
      <div className="menu-body">
        {/* Sidebar */}
        <aside className="menu-sidebar">
          <div className="sidebar-block">
            <div className="sidebar-label">Categories</div>
            <button
              className={`cat-item${activeCategory === "all" ? " active" : ""}`}
              onClick={() => scrollToCategory("all")}
            >
              <span>All items</span>
              <span className="cat-count">{totalItems}</span>
            </button>
            {MENU_DATA.map((cat) => (
              <button
                key={cat.id}
                className={`cat-item${activeCategory === cat.id ? " active" : ""}`}
                onClick={() => scrollToCategory(cat.id)}
              >
                <span>{cat.name}</span>
                <span className="cat-count">{cat.items.length}</span>
              </button>
            ))}
          </div>

          <div className="sidebar-block">
            <div className="sidebar-label">Dietary</div>
            <div className="diet-row">
              <span className="diet-row-label"><span className="diet-dot veg" />Veg only</span>
              <button
                className={`toggle${vegOnly ? " on" : ""}`}
                onClick={() => { setVegOnly((v) => !v); if (!vegOnly) setNonVegOnly(false); }}
                aria-label="Toggle veg only"
              />
            </div>
            <div className="diet-row">
              <span className="diet-row-label"><span className="diet-dot nonveg" />Non-veg only</span>
              <button
                className={`toggle${nonVegOnly ? " on" : ""}`}
                onClick={() => { setNonVegOnly((v) => !v); if (!nonVegOnly) setVegOnly(false); }}
                aria-label="Toggle non-veg only"
              />
            </div>
          </div>
        </aside>

        {/* Dish listing */}
        <main className="menu-content">
          {visibleCategories.length === 0 && (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" strokeLinecap="round" />
              </svg>
              <p>No dishes match your search or filters.</p>
            </div>
          )}

          {visibleCategories.map((cat) => (
            <section
              key={cat.id}
              className="menu-section"
              ref={(el) => (sectionRefs.current[cat.id] = el)}
            >
              <div className="section-head">
                <h2 className="section-title">{cat.name}</h2>
                <div className="section-line" />
                <span className="section-count">{cat.items.length} items</span>
              </div>

              {cat.items.map((item) => {
                const qty = cart[item.id] || 0;
                return (
                  <div className="dish-card" key={item.id}>
                    <div className="dish-thumb">{cat.emoji}</div>
                    <div className="dish-info">
                      <div className="dish-name-row">
                        <span className={`dish-diet ${item.veg ? "veg" : "nonveg"}`} />
                        <span className="dish-name">{item.name}</span>
                        {item.bestseller && <span className="dish-badge">Bestseller</span>}
                      </div>
                      <p className="dish-desc">{item.desc}</p>
                    </div>
                    <div className="dish-action">
                      <span className="dish-price">₹{item.price}</span>
                      {qty === 0 ? (
                        <button className="add-btn" onClick={() => addToCart(item.id)}>Add</button>
                      ) : (
                        <div className="qty-stepper">
                          <button className="qty-btn" onClick={() => decrementQty(item.id)} aria-label="Decrease quantity">−</button>
                          <span className="qty-val">{qty}</span>
                          <button className="qty-btn" onClick={() => incrementQty(item.id)} aria-label="Increase quantity">+</button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </section>
          ))}
        </main>
      </div>

      {/* ── Floating cart bar ── */}
      <button className={`cart-float${cartCount > 0 ? " visible" : ""}`} onClick={onCartOpen}>
        <span className="cart-float-count">{cartCount}</span>
        <span className="cart-float-text">View cart</span>
        <span className="cart-float-total">₹{cartTotal}</span>
        <ArrowRightIcon />
      </button>
    </div>
  );
}
