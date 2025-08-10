 import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import OrderPage from "./components/OrderPage";
import FluffyPancake from "./components/FluffyPancake";
import Checkout from "./components/CheckoutPage"; // Add this component
import "./App.css";

function App() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/order"
          element={
            <OrderPage
              cart={cart}
              setCart={setCart}
              showCart={showCart}
              setShowCart={setShowCart}
            />
          }
        />
        <Route
          path="/fluffy-pancakes"
          element={
            <FluffyPancake
              cart={cart}
              setCart={setCart}
              showCart={showCart}
              setShowCart={setShowCart}
            />
          }
        />
        <Route
          path="/checkout"
          element={
            <Checkout
              cart={cart}
              setCart={setCart}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;