import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartTrigger, setCartTrigger] = useState(0); // 🔁 new trigger state
  const toastTimeoutRef = useRef(null);
  const pendingToastRef = useRef(null);

  const showSingleToast = useCallback(
    (message, type) => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      pendingToastRef.current = { message, type };
      toastTimeoutRef.current = setTimeout(() => {
        if (pendingToastRef.current) {
          showToast(pendingToastRef.current.message, pendingToastRef.current.type);
          pendingToastRef.current = null;
        }
      }, 300);
    },
    [showToast]
  );

  // 🔃 Fetch Cart
  const fetchCart = useCallback(async () => {
    if (!user?.CustomerID) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5500/api/cart/${user.CustomerID}`);
      const data = await res.json();
      const normalized = data.map(item => ({
        DishID: item.DishID, // 👈 important for remove/update
        quantity: item.Quantity,
        price: item.Price,
        name: item.Name,
        image: item.Image,
        description: item.Description,
      }));
      
      
      setCart(normalized);
    } catch (err) {
      console.error("Error fetching cart:", err);
      showSingleToast("Failed to load cart", "error");
    } finally {
      setLoading(false);
    }
  }, [user, showSingleToast]);

  // 🧠 Watch for login & updates
  useEffect(() => {
    if (user?.CustomerID) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [user, fetchCart, cartTrigger]); // 🔥 include cartTrigger

  // ➕ Add to Cart
  const addToCart = async (dish) => {
    try {
      const res = await fetch("http://localhost:5500/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          CustomerID: user.CustomerID,
          DishID: dish.DishID,
          Quantity: 1,
          Amount: dish.Price * 1, // ✅ required by backend
        }),
      });
  
      if (res.ok) {
        showSingleToast(`${dish.Name} added to cart`, "success");
        await fetchCart();
      } else {
        throw new Error("Failed to add to cart");
      }
    } catch (err) {
      console.error(err);
      showSingleToast("Error adding to cart", "error");
    }
  };
  
  
  const updateQuantity = async (DishID, newQuantity) => {
    if (newQuantity <= 0) return removeFromCart(DishID);

    try {
      const res = await fetch(`http://localhost:5500/api/cart/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          CustomerID: user.CustomerID,
          DishID,
          Quantity: newQuantity,
        }),
      });
      if (res.ok) {
        setCartTrigger((prev) => prev + 1);
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      console.error(err);
      showSingleToast("Error updating quantity", "error");
    }
  };

  const removeFromCart = async (DishID) => {
    try {
      const res = await fetch(`http://localhost:5500/api/cart/remove`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          CustomerID: user.CustomerID,
          DishID,
        }),
      });
  
      if (res.ok) {
        showSingleToast("Item removed from cart", "info");
        fetchCart(); // ✅ refresh
      } else {
        throw new Error("Failed to remove item");
      }
    } catch (err) {
      console.error(err);
      showSingleToast("Error removing item", "error");
    }
  };
  

  const clearCart = async () => {
    try {
      const res = await fetch(`http://localhost:5500/api/cart/clear/${user.CustomerID}`, {
        method: "DELETE",
      });
  
      if (res.ok) {
        setCart([]); // ⬅️ immediately clear UI
        showSingleToast("Cart cleared", "info");
      } else {
        throw new Error("Failed to clear cart");
      }
    } catch (err) {
      console.error(err);
      showSingleToast("Error clearing cart", "error");
    }
  };
  
  return (
    <CartContext.Provider
      value={{ cart, loading, addToCart, updateQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
