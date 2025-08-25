import { useContext, useState } from "react";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
import RemoveIcon from "@mui/icons-material/Remove";
import { Link } from "react-router-dom";

const CartItems = () => {
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const {
    getTotalCartAmount,
    products,
    cartItems,
    removeFromCart,
    discount,
    setDiscount,
  } = useContext(ShopContext);

  const promoCodes = {
    save10: 0.1,
    save20: 0.2,
    welcome5: 0.05,
  };

  const applyPromoCode = () => {
    const code = promoCode.trim().toLowerCase();
    if (promoCodes[code]) {
      setDiscount(promoCodes[code]);
      setPromoMessage(
        `Promo code applied! ${promoCodes[code] * 100}% discount`
      );
    } else {
      setDiscount(0);
      setPromoMessage("Invalid promo code");
    }
  };

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {products.map((e) => {
        if (cartItems[e.id] > 0) {
          return (
            <div key={e.id}>
              <div className="cartitems-format cartitems-format-main">
                <img src={e.image} alt="" className="carticon-product-icon" />
                <p>{e.name}</p>
                <p>₹{e.new_price}</p>
                <button className="cartitems-quantity">
                  {cartItems[e.id]}
                </button>
                <p>₹{e.new_price * cartItems[e.id]}</p>
                <div
                  className="removebtn"
                  onClick={() => {
                    removeFromCart(e.id);
                  }}
                >
                  <RemoveIcon />
                </div>
              </div>
              <hr />
            </div>
          );
        }
        return null;
      })}
      {getTotalCartAmount() === 0 && (
        <p className="empty-cart-message">Your cart is empty.</p>
      )}

      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <h3>₹{Math.round(getTotalCartAmount())}</h3>
            </div>
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            {discount > 0 && (
              <div className="cartitems-total-item">
                <p>Discount</p>
                <p>-₹{Math.round(getTotalCartAmount() * discount)}</p>
              </div>
            )}
            <hr />

            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>₹{Math.round(getTotalCartAmount() * (1 - discount))}</h3>
            </div>
          </div>
          {localStorage.getItem("auth-token") == null && (
            <p className="empty-cart-message">Please login to continue.</p>
          )}
          <Link
            to={
              getTotalCartAmount() === 0 ||
              localStorage.getItem("auth-token") == null
                ? "#"
                : "/checkout"
            }
            className={`btn ${
              getTotalCartAmount() === 0 ||
              localStorage.getItem("auth-token") == null
                ? "btn-disabled"
                : ""
            }`}
          >
            Proceed to Checkout
          </Link>
        </div>
        <div className="cartitems-promocode">
          <p>If you have a promo code, Enter it here</p>
          <div className="cartitems-promobox">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter Promo Code"
            />
            <button onClick={applyPromoCode} disabled={!promoCode.trim()}>
              Apply
            </button>

            {promoMessage && (
              <p
                className={`promo-message ${
                  promoMessage.toLowerCase().includes("invalid")
                    ? "error"
                    : "success"
                }`}
              >
                {promoMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
