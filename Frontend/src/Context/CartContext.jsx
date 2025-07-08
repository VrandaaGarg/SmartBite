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
import appwriteService from "../config/service";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const toastTimeoutRef = useRef(null);
  const pendingToastRef = useRef(null);

  const showSingleToast = useCallback(
    (message, type) => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      pendingToastRef.current = { message, type };
      toastTimeoutRef.current = setTimeout(() => {
        if (pendingToastRef.current) {
          showToast(
            pendingToastRef.current.message,
            pendingToastRef.current.type
          );
          pendingToastRef.current = null;
        }
      }, 300);
    },
    [showToast]
  );

  // 🔃 Fetch Cart from Appwrite
  const fetchCart = useCallback(async () => {
    if (!user?.$id) {
      setCart([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const cartData = await appwriteService.getCartByUser(user.$id);
      const normalized = cartData.map((item) => ({
        cartId: item.$id,
        DishID: item.dishId,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        image: item.imgUrl,
        description: item.description || "",
      }));

      setCart(normalized);
    } catch (err) {
      console.error("Error fetching cart:", err);
      showSingleToast("Failed to load cart", "error");
      setCart([]); // Set empty cart on error
    } finally {
      setLoading(false);
    }
  }, [user, showSingleToast]);

  // 🧠 Watch for login & updates
  useEffect(() => {
    if (user?.$id) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [user, fetchCart]);

  // ➕ Add to Cart
  const addToCart = async (dish) => {
    if (!user?.$id) {
      showSingleToast("Please login to add items to cart", "error");
      return;
    }

    try {
      await appwriteService.addToCart({
        userId: user.$id,
        dishId: dish.DishID || dish.$id,
        quantity: 1,
        name: dish.Name || dish.name,
        imgUrl: dish.Image || dish.imgUrl,
        price: dish.Price || dish.price,
      });

      showSingleToast(`${dish.Name || dish.name} added to cart`, "success");
      fetchCart();
    } catch (err) {
      console.error("Error adding to cart:", err);
      showSingleToast("Error adding to cart", "error");
    }
  };

  const updateQuantity = async (DishID, newQuantity) => {
    if (newQuantity <= 0) return removeFromCart(DishID);

    if (!user?.$id) {
      showSingleToast("Please login first", "error");
      return;
    }

    try {
      // Find the cart item to get its cartId
      const cartItem = cart.find((item) => item.DishID === DishID);
      if (!cartItem) {
        throw new Error("Cart item not found");
      }

      await appwriteService.updateCartQuantity(cartItem.cartId, newQuantity);
      fetchCart();
    } catch (err) {
      console.error("Error updating quantity:", err);
      showSingleToast("Error updating quantity", "error");
    }
  };

  const removeFromCart = async (DishID) => {
    if (!user?.$id) {
      showSingleToast("Please login first", "error");
      return;
    }

    try {
      // Find the cart item to get its cartId
      const cartItem = cart.find((item) => item.DishID === DishID);
      if (!cartItem) {
        throw new Error("Cart item not found");
      }

      await appwriteService.removeFromCart(cartItem.cartId);
      showSingleToast("Item removed from cart", "info");
      fetchCart();
    } catch (err) {
      console.error("Error removing item:", err);
      showSingleToast("Error removing item", "error");
    }
  };

  const clearCart = async () => {
    if (!user?.$id) {
      showSingleToast("Please login first", "error");
      return;
    }

    try {
      await appwriteService.clearCart(user.$id);
      setCart([]);
      showSingleToast("Cart cleared", "info");
    } catch (err) {
      console.error("Error clearing cart:", err);
      showSingleToast("Error clearing cart", "error");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
