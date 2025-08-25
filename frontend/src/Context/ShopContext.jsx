import { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const getDefaultCart = (products) => {
  const cart = {};
  products.forEach((p) => {
    cart[p.id] = 0;
  });
  return cart;
};

const ShopContextProvider = (props) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    // Fetch products first
    fetch(`${import.meta.env.VITE_API_BASE_URL}/getproducts`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.products);
        setCartItems(getDefaultCart(data.products)); // initialize cart with 0s
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  useEffect(() => {
    if (products.length > 0 && localStorage.getItem("auth-token")) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/getcart`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // Ensure only product IDs that exist are updated
          setCartItems((prevCart) => {
            const updatedCart = { ...prevCart };
            Object.keys(data).forEach((id) => {
              if (updatedCart.hasOwnProperty(id)) {
                updatedCart[id] = data[id];
              }
            });
            return updatedCart;
          });

          console.log("Cart data fetched:", data);
        })
        .catch((error) => {
          console.error("Error fetching cart data:", error);
        });
    }
  }, [products]); // Only run this after products are loaded

  const addToCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    if (localStorage.getItem("auth-token")) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/addtocart`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId: itemId }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error("Error adding to cart:", error);
        });
    }
  };
  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (localStorage.getItem("auth-token")) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/removefromcart`, {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId: itemId }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error("Error removing from cart:", error);
        });
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    products.forEach((product) => {
      if (cartItems[product.id] > 0) {
        totalAmount += product.new_price * cartItems[product.id];
      }
    });
    return totalAmount;
  };

  const getTotalCart = () => {
    let count = 0;
    products.forEach((product) => {
      if (cartItems[product.id] > 0) {
        count += cartItems[product.id];
      }
    });
    return count;
  };

  const clearCart = () => {
    setCartItems(getDefaultCart(products));
    setDiscount(0);
    if (localStorage.getItem("auth-token")) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/clearcart`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => console.log("Cart cleared on backend:", data))
        .catch((error) => console.error("Error clearing cart:", error));
    }
  };

  const contextValue = {
    getTotalCart,
    getTotalCartAmount,
    products,
    cartItems,
    addToCart,
    removeFromCart,
    discount,
    setDiscount,
    clearCart,
  };
  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
