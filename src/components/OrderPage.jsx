import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
  useLayoutEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const EXTRA_PRICES = { eggs: 1500, sausages: 2000, wings: 2500 };

export default function OrderPage({ cart, setCart, showCart, setShowCart }) {
  const navigate = useNavigate();
  const foodRowRef = useRef(null);
  const animRef = useRef(null);
  const pauseT = useRef(null);
  const paused = useRef(false);
  const SPEED = 1.5;
  const PAUSE = 10000;
  const [active, setActive] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const items = [
    { id: 19, img: `${process.env.PUBLIC_URL}/hut19.jpg`, name: "Fluffy Pancakes", price: "₦2500" },
    { id: 20, img: `${process.env.PUBLIC_URL}/hut28.jpg`, name: "Crepes", price: "₦2700" },
    { id: 21, img: `${process.env.PUBLIC_URL}/hut27.jpg`, name: "French Toast", price: "₦2900" },
    { id: 22, img: `${process.env.PUBLIC_URL}/hut22.jpg`, name: "Waffles", price: "₦3100" },
    { id: 23, img: `${process.env.PUBLIC_URL}/hut26.jpg`, name: "Muffins", price: "₦3300" },
    { id: 24, img: `${process.env.PUBLIC_URL}/hut24.jpg`, name: "Creamy Donuts", price: "₦3500" },
    { id: 25, img: `${process.env.PUBLIC_URL}/hut28.jpg`, name: "JUMBO PACK (buy 3 get 1 free)", price: "₦3700" },
    { id: 26, img: `${process.env.PUBLIC_URL}/hut23.jpg`, name: "Cinnamon Rolls", price: "₦3900" },
    { id: 27, img: `${process.env.PUBLIC_URL}/hut27.jpg`, name: "Breakfast Combo", price: "₦4100" },
    { id: 28, img: `${process.env.PUBLIC_URL}/hut25.jpg`, name: "Scone", price: "₦4300" },
  ];
  const loopItems = [...items, ...items];

  useEffect(() => {
    let timeout;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsScrolling(false), 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const updateActive = useCallback(() => {
    const el = foodRowRef.current;
    if (!el) return;
    const cardW = el.firstChild?.offsetWidth || 300;
    setActive(Math.round((el.scrollLeft % (cardW * items.length)) / cardW));
  }, [items.length]);

  const startAuto = useCallback(() => {
    if (animRef.current || paused.current) return;
    const el = foodRowRef.current;
    const cardW = el.firstChild?.offsetWidth || 300;
    const fullW = cardW * items.length;

    const step = () => {
      if (paused.current) return (animRef.current = null);
      el.scrollLeft += SPEED;
      if (el.scrollLeft >= fullW * 2) el.scrollLeft -= fullW;
      updateActive();
      animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
  }, [updateActive, items.length]);

  const stopAuto = () => animRef.current && cancelAnimationFrame(animRef.current);

  const pauseAuto = useCallback(() => {
    paused.current = true;
    stopAuto();
    clearTimeout(pauseT.current);
    pauseT.current = setTimeout(() => {
      paused.current = false;
      startAuto();
    }, PAUSE);
  }, [startAuto]);

  useLayoutEffect(() => {
    const el = foodRowRef.current;
    el.scrollLeft = 0;
    startAuto();

    const ts = () => pauseAuto();
    const te = () => startAuto();
    el.addEventListener("touchstart", ts, { passive: true });
    el.addEventListener("touchend", te);
    el.addEventListener("mouseenter", ts);
    el.addEventListener("mouseleave", te);

    return () => {
      stopAuto();
      el.removeEventListener("touchstart", ts);
      el.removeEventListener("touchend", te);
      el.removeEventListener("mouseenter", ts);
      el.removeEventListener("mouseleave", te);
    };
  }, [pauseAuto, startAuto]);

  const parseNaira = (n) => parseInt(n.replace(/[₦,]/g, ""), 10);

  const addToCart = (item) =>
    item.name === "Fluffy Pancakes" &&
    setCart((p) => [
      ...p,
      { ...item, base: parseNaira(item.price), extras: { eggs: 0, sausages: 0, wings: 0 } },
    ]);

  const incExtra = (idx, extra) =>
    setCart((prev) =>
      prev.map((c, i) =>
        i !== idx ? c : { ...c, extras: { ...c.extras, [extra]: c.extras[extra] + 1 } }
      )
    );

  const toggleExtra = (idx, extra) =>
    setCart((prev) =>
      prev.map((c, i) =>
        i !== idx
          ? c
          : { ...c, extras: { ...c.extras, [extra]: c.extras[extra] ? 0 : 1 } }
      )
    );

  const removeItem = (idx) => setCart((p) => p.filter((_, i) => i !== idx));
  const resetCart = () => setCart([]);

  const total = cart.reduce(
    (sum, it) =>
      sum +
      it.base +
      Object.entries(it.extras).reduce(
        (s, [k, qty]) => s + qty * EXTRA_PRICES[k],
        0
      ),
    0
  );

  return (
    <div className="order-page">
      <div className="fixed-cart-header">
        <h2 className="menu-heading">MENU</h2>

        <div className="cart-icon" onClick={() => setShowCart(!showCart)}>
          🛒 <span className="cart-count">{cart.length}</span>
        </div>

        {showCart && (
          <div className={`cart-dropdown ${isScrolling ? "transparent" : ""}`}>
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                {cart.map((it, idx) => (
                  <div key={idx} className="cart-item">
                    <img src={it.img} alt={it.name} />
                    <div className="item-info">
                      <strong>{it.name}</strong>
                      <p>₦{it.base.toLocaleString()}</p>
                      <div className="extras-row">
                        {Object.entries(EXTRA_PRICES).map(([k, price]) => (
                          <div key={k} className="extra-control">
                            <button
                              className={`extra-btn ${it.extras[k] ? "selected" : ""}`}
                              onClick={() => toggleExtra(idx, k)}
                            >
                              {k} ₦{price / 1000}k
                            </button>
                            {it.extras[k] > 0 && (
                              <>
                                <span
                                  className="plus-btn"
                                  onClick={() => incExtra(idx, k)}
                                >
                                  +
                                </span>
                                <span className="qty">x{it.extras[k]}</span>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <button className="remove-btn" onClick={() => removeItem(idx)}>
                      ❌
                    </button>
                  </div>
                ))}

                <div className="cart-total">
                  <strong>Total:</strong> ₦{total.toLocaleString()}
                </div>

                <button className="reset-cart-btn" onClick={resetCart}>
                  Reset Cart
                </button>

                <button
                  className="checkout-btn"
                  onClick={() => navigate("/checkout")}
                >
                  Checkout
                </button>
              </>
            )}
          </div>
        )}

        <p className="note-text">
          *Note: Only Fluffy Pancakes and its combos are available for now.
        </p>
      </div>

      <div className="horizontal-scroll-wrapper">
        <div ref={foodRowRef} className="food-row">
          {loopItems.map((it, i) => (
            <div
              key={`${it.id}-${i}`}
              className="food-card"
              onClick={() => navigate("/fluffy-pancakes")}
            >
              <img src={it.img} alt={it.name} className="food-img" />
              <h3 className="food-name">{it.name}</h3>
              <p className="food-price">{it.price}</p>
              <button
                className="add-to-cart"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(it);
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="slick-dots">
        {items.map((_, i) => (
          <button
            key={i}
            className={`dot ${active === i ? "active" : ""}`}
            onClick={() => {
              pauseAuto();
              const cardW = foodRowRef.current.firstChild?.offsetWidth || 300;
              foodRowRef.current.scrollTo({ left: cardW * i, behavior: "smooth" });
            }}
          />
        ))}
      </div>
    </div>
  );
}