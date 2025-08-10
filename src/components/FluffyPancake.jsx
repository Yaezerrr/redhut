import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const pancakeOptions = [
  {
    id: 29,
    name: "Chocolate Pancake",
    img: `${process.env.PUBLIC_URL}/hut29.jpg`,
    price: "₦4000",
    description: "Rich chocolate pancakes made with cocoa and chocolate chips.",
  },
  {
    id: 30,
    name: "Vanilla Pancake",
    img: `${process.env.PUBLIC_URL}/hut30.jpg`,
    price: "₦2000",
    description: "Classic vanilla pancakes topped with whipped cream and syrup.",
  },
  {
    id: 31,
    name: "Red-Velvet Pancake",
    img: `${process.env.PUBLIC_URL}/hut47.jpg`,
    price: "₦3500",
    description: "Fluffy pancakes layered with fresh strawberries and cream.",
  },
  {
    id: 32,
    name: "Banana Pancake",
    img: `${process.env.PUBLIC_URL}/hut49.jpg`,
    price: "₦3500",
    description: "Sweet banana pancakes with honey drizzle and toasted nuts.",
  },
  {
    id: 33,
    name: "Cinnamon Pancake",
    img: `${process.env.PUBLIC_URL}/hut48.jpg`,
    price: "₦4000",
    description: "Warm cinnamon pancakes with a dusting of powdered sugar.",
  },
];

const EXTRA_PRICES = { eggs: 1500, sausages: 2000, wings: 2500 };

export default function FluffyPancake({ cart, setCart, showCart, setShowCart }) {
  const navigate = useNavigate();

  const parsePrice = (str) => parseInt(str.replace(/[₦,]/g, ""), 10);

  const addToCart = (item) => {
    setCart((prev) => [
      ...prev,
      { ...item, base: parsePrice(item.price), extras: { eggs: 0, sausages: 0, wings: 0 } },
    ]);
  };

  const toggleExtra = (idx, extra) => {
    setCart((prev) =>
      prev.map((item, i) =>
        i !== idx
          ? item
          : {
              ...item,
              extras: {
                ...item.extras,
                [extra]: item.extras[extra] ? 0 : 1,
              },
            }
      )
    );
  };

  const incrementExtra = (idx, extra) => {
    setCart((prev) =>
      prev.map((item, i) =>
        i !== idx
          ? item
          : {
              ...item,
              extras: {
                ...item.extras,
                [extra]: (item.extras[extra] || 0) + 1,
              },
            }
      )
    );
  };

  const removeFromCart = (idx) => setCart((prev) => prev.filter((_, i) => i !== idx));

  const resetCart = () => setCart([]);

  const totalNaira = () =>
    cart.reduce((sum, item) => {
      const extrasSum = Object.entries(item.extras || {}).reduce(
        (s, [k, qty]) => s + qty * EXTRA_PRICES[k],
        0
      );
      return sum + item.base + extrasSum;
    }, 0);

  return (
    <div className="order-page">
      <div className="fixed-cart-header">
        <h2 className="menu-heading">Fluffy Pancakes</h2>

        <div className="cart-icon" onClick={() => setShowCart(!showCart)}>
          🛒 <span className="cart-count">{cart.length}</span>
        </div>

        {showCart && (
          <div className="cart-dropdown">
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                {cart.map((item, idx) => (
                  <div key={idx} className="cart-item">
                    <img src={item.img} alt={item.name} />
                    <div className="item-info">
                      <strong>{item.name}</strong>
                      <p>₦{item.base.toLocaleString()}</p>

                      <div className="extras-row">
                        {Object.entries(EXTRA_PRICES).map(([extraKey, price]) => (
                          <div key={extraKey} className="extra-control">
                            <button
                              className={`extra-btn ${
                                item.extras[extraKey] ? "selected" : ""
                              }`}
                              onClick={() => toggleExtra(idx, extraKey)}
                            >
                              {extraKey} ₦{price / 1000}k
                            </button>
                            {item.extras[extraKey] > 0 && (
                              <>
                                <span
                                  className="plus-btn"
                                  onClick={() => incrementExtra(idx, extraKey)}
                                  title={`Add more ${extraKey}`}
                                >
                                  ➕
                                </span>
                                {item.extras[extraKey] > 1 && (
                                  <span className="qty">x{item.extras[extraKey]}</span>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(idx)}
                      title="Remove from cart"
                    >
                      ❌
                    </button>
                  </div>
                ))}

                <div className="cart-total">
                  <strong>Total:</strong> ₦{totalNaira().toLocaleString()}
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

      <div className="pancake-list">
        {pancakeOptions.map((pancake) => (
          <div key={pancake.id} className="pancake-item">
            <img src={pancake.img} alt={pancake.name} className="food-img" />
            <div className="pancake-details">
              <h3 className="food-name">{pancake.name}</h3>
              <p className="food-price">{pancake.price}</p>
              <p className="pancake-desc">{pancake.description}</p>
              <button
                className="add-to-cart"
                onClick={() => addToCart(pancake)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}