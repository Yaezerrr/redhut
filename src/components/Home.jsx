import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const doodleImages = [
    ...Array.from({ length: 18 }, (_, i) => `${process.env.PUBLIC_URL}/hut${i + 1}.png`),
    ...Array.from({ length: 16 }, (_, i) => `${process.env.PUBLIC_URL}/hut${31 + i}.png`),
  ];

  const navigate = useNavigate();

  return (
    <>
      <div className="doodle-container">
        {doodleImages.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`hut${i + 1}`}
            className="hut-doodle"
            style={{
              top: `${Math.random() * 100}vh`,
              left: `${Math.random() * 100}vw`,
              animationDelay: `${i * 0.6}s`,
            }}
          />
        ))}
      </div>

      <div className="hero-section">
        <img src={`${process.env.PUBLIC_URL}/hut.jpg`} alt="logo" className="logo" />
        <div className="button-group">
          <button className="hero-button" onClick={() => navigate("/order")}>
            Place Order
          </button>
          <button className="hero-button secondary" onClick={() => alert("Learn More clicked!")}>
            Learn More
          </button>
        </div>
      </div>
    </>
  );
}

export default Home;