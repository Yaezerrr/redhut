import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

const EXTRA_PRICES = { eggs: 1500, sausages: 2000, wings: 2500 };
const LAGOS_LGAS = [
  "Agege",
  "Ajeromi-Ifelodun",
  "Alimosho",
  "Amuwo-Odofin",
  "Apapa",
  "Badagry",
  "Epe",
  "Eti-Osa",
  "Ibeju-Lekki",
  "Ifako-Ijaiye",
  "Ikeja",
  "Ikorodu",
  "Kosofe",
  "Lagos Island",
  "Lagos Mainland",
  "Mushin",
  "Ojo",
  "Oshodi-Isolo",
  "Shomolu",
  "Surulere",
];

export default function CheckoutPage({ cart }) {
  const navigate = useNavigate();
  const hutRef = useRef(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    streetNumber: "",
    streetName: "",
    busStop: "",
    area: "",
    instructions: "",
  });

  const [showLGADropdown, setShowLGADropdown] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Update form state on input change
  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  // Toggle LGA dropdown visibility
  const handleLGAInputClick = () => {
    setShowLGADropdown((prev) => !prev);
  };

  // Select an LGA and close dropdown
  const handleLGASelect = (lga) => {
    setForm((f) => ({ ...f, area: lga }));
    setShowLGADropdown(false);
    setShowSummary(true);
  };

  // Calculate total price from cart items and extras
  const calculateTotal = () =>
    cart.reduce((sum, item) => {
      const extrasTotal = Object.entries(item.extras || {}).reduce(
        (sub, [extra, qty]) => sub + qty * EXTRA_PRICES[extra],
        0
      );
      return sum + item.base + extrasTotal;
    }, 0);

  // Handle form submit: send form + cart data to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hutRef.current) return;

    hutRef.current.classList.add("animate-hut");
    setSubmitting(true);

    try {
      // Send POST request to backend
      await axios.post("http://localhost:5000/api/order", {
        customer: form,
        cart,
        total: calculateTotal(),
      });

      alert("Order placed successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-page-wrapper">
      <div className="checkout-page">
        <h2 className="checkout-heading">Checkout</h2>

        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="name-row">
            <label>
              First Name:
              <input
                name="firstName"
                type="text"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Last Name:
              <input
                name="lastName"
                type="text"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <label>
            Phone Number:
            <div className="phone-input-container">
              <span className="phone-prefix">+234</span>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="80xxxxxxx"
                required
              />
            </div>
          </label>

          <label>
            Street Number:
            <input
              name="streetNumber"
              type="text"
              value={form.streetNumber}
              onChange={handleChange}
              placeholder="e.g. 22"
              required
            />
          </label>

          <label>
            Street Name:
            <input
              name="streetName"
              type="text"
              value={form.streetName}
              onChange={handleChange}
              placeholder="e.g. Allen Avenue"
              required
            />
          </label>

          <label>
            Nearest Bus Stop:
            <input
              name="busStop"
              type="text"
              value={form.busStop}
              onChange={handleChange}
              placeholder="e.g. Computer Village"
              required
            />
          </label>

          <label style={{ position: "relative" }}>
            Local Government Area (LGA):
            <input
              name="area"
              type="text"
              value={form.area}
              placeholder="Click to select your LGA"
              onClick={handleLGAInputClick}
              readOnly
              required
              style={{ cursor: "pointer" }}
            />
            {showLGADropdown && (
              <div className="lga-dropdown">
                {LAGOS_LGAS.map((lga, idx) => (
                  <div
                    key={idx}
                    className="lga-option"
                    onClick={() => handleLGASelect(lga)}
                    style={{ cursor: "pointer" }}
                  >
                    {lga}
                  </div>
                ))}
              </div>
            )}
          </label>

          {showSummary && (
            <div className="filled-info-summary">
              <p>
                <strong>Name:</strong> {form.firstName} {form.lastName}
              </p>
              <p>
                <strong>Phone:</strong> +234 {form.phone}
              </p>
              <p>
                <strong>Address:</strong> {form.streetNumber} {form.streetName}, near {form.busStop}
              </p>
              <p>
                <strong>LGA:</strong> {form.area}
              </p>
              {form.instructions && (
                <p>
                  <strong>Instructions:</strong> {form.instructions}
                </p>
              )}
            </div>
          )}

          <label>
            Delivery Instructions (optional):
            <textarea
              name="instructions"
              value={form.instructions}
              onChange={handleChange}
              placeholder="e.g. Call me upon arrival"
            />
          </label>

          <div className="submit-container">
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? "Placing order..." : "Place Order"}
            </button>
            <img
              ref={hutRef}
              src={`${process.env.PUBLIC_URL}/hut50.png`}
              alt="hut logo"
              className="submit-hut-logo"
            />
          </div>
        </form>
      </div>

      {cart.length > 0 && (
        <div className="checkout-cart-preview">
          <h4>🛒 Cart Summary</h4>
          {cart.map((item, idx) => (
            <div key={idx} className="cart-preview-item">
              <img src={item.img} alt={item.name} />
              <div className="cart-item-details">
                <small>{item.name}</small>
                <p>₦{item.base.toLocaleString()}</p>
                {Object.entries(item.extras || {}).map(
                  ([extra, qty]) =>
                    qty > 0 && (
                      <div key={extra} className="extra-line">
                        <small>
                          + {extra} ×{qty} = ₦{(qty * EXTRA_PRICES[extra]).toLocaleString()}
                        </small>
                      </div>
                    )
                )}
              </div>
            </div>
          ))}
          <p className="cart-preview-total">
            <strong>Total: ₦{calculateTotal().toLocaleString()}</strong>
          </p>
        </div>
      )}
    </div>
  );
}