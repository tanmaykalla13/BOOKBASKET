import React, { useContext, useState } from "react";
import "./Checkout.css";
import { ShopContext } from "../../Context/ShopContext";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";

const Checkout = () => {
  const { getTotalCartAmount, discount, clearCart } = useContext(ShopContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [orderNumber, setOrderNumber] = useState("");
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    paymentMethod: "visa",
  });

  // EmailJS Configuration
  const EMAIL_SERVICE_ID = "service_49a5pe6";
  const EMAIL_TEMPLATE_ID = "template_hwjtmrh";
  const EMAIL_PUBLIC_KEY = "sQ1L7fGWHbk36eiZW";

  const sendConfirmationEmail = async (orderDetails) => {
    try {
      const templateParams = {
        to_name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        email: shippingInfo.email,
        order_number: orderDetails.orderNumber,
        subtotal: Math.round(getTotalCartAmount()),
        discount_amount: Math.round(getTotalCartAmount() * discount),
        total_amount: Math.round(getTotalCartAmount() * (1 - discount)),
        shipping_address: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}, ${shippingInfo.country}`,
        phone: shippingInfo.phone,
        estimated_delivery: formatDate(
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        ),
        order_date: formatDate(new Date()),
        payment_method: paymentInfo.paymentMethod.toUpperCase(),
        card_last_four: paymentInfo.cardNumber.slice(-4),
      };

      const result = await emailjs.send(
        EMAIL_SERVICE_ID,
        EMAIL_TEMPLATE_ID,
        templateParams,
        EMAIL_PUBLIC_KEY
      );

      console.log("Email sent successfully:", result);
      setEmailSent(true);
      return true;
    } catch (error) {
      console.error("Failed to send email:", error);
      // Don't block the order completion if email fails
      return false;
    }
  };

  const handleShippingSubmit = () => {
    if (
      !shippingInfo.firstName ||
      !shippingInfo.lastName ||
      !shippingInfo.email ||
      !shippingInfo.phone ||
      !shippingInfo.address ||
      !shippingInfo.city ||
      !shippingInfo.state ||
      !shippingInfo.zipCode
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingInfo.email)) {
      alert("Please enter a valid email address");
      return;
    }

    setCurrentStep(2);
  };

  const handlePaymentSubmit = async () => {
    if (
      !paymentInfo.cardholderName ||
      !paymentInfo.cardNumber ||
      !paymentInfo.expiryDate ||
      !paymentInfo.cvv
    ) {
      alert("Please fill in all payment details");
      return;
    }

    setIsProcessingOrder(true);

    try {
      const newOrderNumber = `ORD-${Date.now()}`;
      setOrderNumber(newOrderNumber);

      // Send confirmation email
      await sendConfirmationEmail({ orderNumber: newOrderNumber });

      setCurrentStep(3);
    } catch (error) {
      console.error("Order processing failed:", error);
      alert("There was an issue processing your order. Please try again.");
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const formatCardNumber = (value) => {
    return value
      .replace(/\s/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value.replace(/\D/g, ""));
    if (formatted.length <= 19) {
      setPaymentInfo({ ...paymentInfo, cardNumber: formatted });
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    setPaymentInfo({ ...paymentInfo, expiryDate: value });
  };

  function formatDate(date) {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  const StepIndicator = () => (
    <div className="step-indicator">
      <div className="step-container">
        {[1, 2, 3].map((step) => (
          <div key={step} className="step-item">
            <div
              className={`step-circle ${currentStep >= step ? "active" : ""}`}
            >
              {step === 1 && <span className="step-icon">🚚</span>}
              {step === 2 && <span className="step-icon">💳</span>}
              {step === 3 && <span className="step-icon">✅</span>}
            </div>
            {step < 3 && (
              <div
                className={`step-line ${currentStep > step ? "active" : ""}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  if (currentStep === 1) {
  return (
    <div className="checkout-container">
      <div className="checkout-wrapper">
        <StepIndicator />

        <div className="checkout-card">
          <h2 className="checkout-title">
            <span className="title-icon">📍</span>
            Shipping Information
          </h2>

          <div className="form-container">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="firstName">
                  First Name *
                </label>
                <div className="input-container">
                  <span className="input-icon">👤</span>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    className="form-input"
                    value={shippingInfo.firstName}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        firstName: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="lastName">
                  Last Name *
                </label>
                <div className="input-container">
                  <span className="input-icon">👤</span>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    className="form-input"
                    value={shippingInfo.lastName}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        lastName: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address *
              </label>
              <div className="input-container">
                <span className="input-icon">✉️</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="form-input"
                  value={shippingInfo.email}
                  onChange={(e) =>
                    setShippingInfo({
                      ...shippingInfo,
                      email: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">
                Phone Number *
              </label>
              <div className="input-container">
                <span className="input-icon">📞</span>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className="form-input"
                  value={shippingInfo.phone}
                  onChange={(e) =>
                    setShippingInfo({
                      ...shippingInfo,
                      phone: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="address">
                Address *
              </label>
              <textarea
                id="address"
                name="address"
                rows="3"
                autoComplete="street-address"
                className="form-textarea"
                value={shippingInfo.address}
                onChange={(e) =>
                  setShippingInfo({
                    ...shippingInfo,
                    address: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="city">
                  City *
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  autoComplete="address-level2"
                  className="form-input"
                  value={shippingInfo.city}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, city: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="state">
                  State *
                </label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  autoComplete="address-level1"
                  className="form-input"
                  value={shippingInfo.state}
                  onChange={(e) =>
                    setShippingInfo({
                      ...shippingInfo,
                      state: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="zipCode">
                  ZIP Code *
                </label>
                <input
                  id="zipCode"
                  name="zipCode"
                  type="text"
                  autoComplete="postal-code"
                  className="form-input"
                  value={shippingInfo.zipCode}
                  onChange={(e) =>
                    setShippingInfo({
                      ...shippingInfo,
                      zipCode: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="country">
                Country
              </label>
              <select
                id="country"
                name="country"
                autoComplete="country-name"
                className="form-select"
                value={shippingInfo.country}
                onChange={(e) =>
                  setShippingInfo({
                    ...shippingInfo,
                    country: e.target.value,
                  })
                }
              >
                <option value="India">India</option>
                <option value="USA">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="Canada">Canada</option>
              </select>
            </div>

            <div className="button-row">
              <Link
                to="/cart"
                onClick={() => setCurrentStep(1)}
                className="btn btn-secondary btn-half"
              >
                Back to Cart
              </Link>
              <button
                type="button"
                onClick={handleShippingSubmit}
                className="btn btn-half"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


 if (currentStep === 2) {
  return (
    <div className="checkout-container">
      <div className="checkout-wrapper">
        <StepIndicator />

        <div className="checkout-card">
          <h2 className="checkout-title">
            <span className="title-icon">💳</span>
            Payment Method
          </h2>

          <div className="form-container">
            <div className="payment-methods">
              {[
                { id: "visa", label: "VISA", class: "visa" },
                { id: "mastercard", label: "MC", class: "mastercard" },
                { id: "amex", label: "AMEX", class: "amex" },
                { id: "discover", label: "DISC", class: "discover" },
              ].map((method) => (
                <label key={method.id} className="payment-method" htmlFor={method.id}>
                  <input
                    id={method.id}
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    className="payment-radio"
                    checked={paymentInfo.paymentMethod === method.id}
                    onChange={(e) =>
                      setPaymentInfo({
                        ...paymentInfo,
                        paymentMethod: e.target.value,
                      })
                    }
                  />
                  <div
                    className={`payment-card ${method.class} ${
                      paymentInfo.paymentMethod === method.id ? "selected" : ""
                    }`}
                  >
                    {method.label}
                  </div>
                </label>
              ))}
            </div>

            <p className="payment-subtitle">Credit or Debit Card</p>

            <div className="form-group">
              <label className="form-label" htmlFor="cardholderName">
                Cardholder Name *
              </label>
              <div className="input-container">
                <span className="input-icon">👤</span>
                <input
                  id="cardholderName"
                  name="name"
                  type="text"
                  autoComplete="cc-name"
                  placeholder="John Doe"
                  className="form-input"
                  value={paymentInfo.cardholderName}
                  onChange={(e) =>
                    setPaymentInfo({
                      ...paymentInfo,
                      cardholderName: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="cardNumber">
                Card Number *
              </label>
              <div className="input-container">
                <span className="input-icon">💳</span>
                <input
                  id="cardNumber"
                  name="cardNumber"
                  type="text"
                  autoComplete="cc-number"
                  placeholder="1234 5678 9012 3456"
                  className="form-input"
                  value={paymentInfo.cardNumber}
                  onChange={handleCardNumberChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="expiryDate">
                  Expiry Date *
                </label>
                <div className="input-container">
                  <span className="input-icon">📅</span>
                  <input
                    id="expiryDate"
                    name="expiryDate"
                    type="text"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    maxLength="5"
                    className="form-input"
                    value={paymentInfo.expiryDate}
                    onChange={handleExpiryChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="cvv">
                  CVV *
                </label>
                <div className="input-container">
                  <span className="input-icon">🔒</span>
                  <input
                    id="cvv"
                    name="cvv"
                    type="text"
                    autoComplete="cc-csc"
                    placeholder="123"
                    maxLength="4"
                    className="form-input"
                    value={paymentInfo.cvv}
                    onChange={(e) =>
                      setPaymentInfo({
                        ...paymentInfo,
                        cvv: e.target.value.replace(/\D/g, ""),
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="button-row">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="btn btn-secondary btn-half"
                disabled={isProcessingOrder}
              >
                Back to Shipping
              </button>
              <button
                type="button"
                onClick={handlePaymentSubmit}
                className="btn btn-half"
                disabled={isProcessingOrder}
              >
                {isProcessingOrder ? "Processing..." : "Complete Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


  if (currentStep === 3) {
    return (
      <div className="checkout-container">
        <div className="checkout-wrapper">
          <StepIndicator />
          <div className="checkout-card confirmation-card">
            <div className="confirmation-header">
              <div className="success-icon">✅</div>
              <h2 className="confirmation-title">Order Confirmed!</h2>
              <p className="confirmation-subtitle">
                Thank you for your purchase. Your order has been confirmed and
                will be shipped soon.
              </p>
              {emailSent && (
                <div className="email-confirmation">
                  <span className="email-icon">📧</span>
                  <p className="email-text">
                    Confirmation email sent to {shippingInfo.email}
                  </p>
                </div>
              )}
            </div>

            <div className="order-details">
              <h3 className="order-number-title">Order Number</h3>
              <p className="order-number">{orderNumber}</p>

              <div className="order-summary">
                <h4 className="summary-title">Order Summary</h4>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{Math.round(getTotalCartAmount())}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                {discount > 0 && (
                  <div className="summary-row">
                    <span>Discount</span>
                    <span>-₹{Math.round(getTotalCartAmount() * discount)}</span>
                  </div>
                )}
                <hr className="summary-divider" />
                <div className="summary-row total-row">
                  <span>Total</span>
                  <span>
                    ₹{Math.round(getTotalCartAmount() * (1 - discount))}
                  </span>
                </div>
              </div>
            </div>

            <div className="delivery-info">
              <h4 className="delivery-title">
                <span className="delivery-icon">🚚</span>
                Delivery Information
              </h4>
              <p className="delivery-text">
                Estimated delivery:{" "}
                <span className="delivery-date">
                  {formatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))}
                </span>
              </p>
              <p className="delivery-text">
                Order confirmation sent to:{" "}
                <span className="delivery-email">{shippingInfo.email}</span>
              </p>
              <p className="delivery-text">
                Track your order with:{" "}
                <span className="tracking-number">{orderNumber}</span>
              </p>
            </div>

            <div className="confirmation-actions">
              <Link
                to="/"
                className="btn btn-secondary btn-half"
                onClick={() => {
                  clearCart();
                  setCurrentStep(1);
                  setEmailSent(false);
                }}
              >
                Continue Shopping
              </Link>

              <button
                onClick={() => alert("🚚 Tracking feature coming soon!")}
                className="btn btn-half"
              >
                Track Order
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Checkout;
