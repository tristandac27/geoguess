import { useState, useEffect } from "react";
import { motion } from "framer-motion"; // ✅ Importation de motion
import "./StorePage.css";

function StorePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Erreur lors de la récupération des produits:", error));
  }, []);

  return (
    <div className="store-container">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        Boutique
      </motion.h1>
      <motion.div className="product-list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        {products.map((product) => (
          <motion.div key={product.id} className="product-card" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <img src={product.image} alt={product.title} className="product-image" />
            <h2 className="product-title">{product.title}</h2>
            <p className="product-price">{product.price} €</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default StorePage;
