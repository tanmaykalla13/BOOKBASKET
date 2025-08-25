import "./CSS/LoginSignup.css";
import { useState } from "react";

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [agreed, setAgreed] = useState(false);
  const [agreeWarning, setAgreeWarning] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    password: "",
    email: "",
  });

  const handleLogin = async () => {
    console.log("Login", formData);
    let responseData;
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        responseData = data;
        if (responseData.success) {
          localStorage.setItem("auth-token", responseData.token);
          window.location.replace("/");
        } else {
          alert(responseData.message);
        }
      });
  };

  const handleSignUp = async () => {
    console.log("SignUp", formData);
    let responseData;
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/signup`, {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        responseData = data;
        if (responseData.success) {
          localStorage.setItem("auth-token", responseData.token);
          window.location.replace("/");
        } else {
          alert(responseData.message);
        }
      });
  };
  const handleContinue = () => {
    if (!agreed) {
      setAgreeWarning("Please agree to the terms to continue.");
      return;
    }
    setAgreeWarning("");

    if (state === "Login") {
      handleLogin();
    } else {
      handleSignUp();
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state == "Sign Up" && (
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text"
              placeholder="Your Name"
            />
          )}
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="Email Address"
          />
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            placeholder="Password"
          />
        </div>
        <div className="loginsignup-agree">
          <input
            type="checkbox"
            checked={agreed}
            onChange={() => {
              setAgreed(!agreed);
              setAgreeWarning("");
            }}
          />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>

        {agreeWarning && <p className="agree-warning">{agreeWarning}</p>}

        <button onClick={handleContinue}>Continue</button>

        {state === "Sign Up" ? (
          <p className="loginsignup-login">
            Already have an account?
            <span
              onClick={() => {
                setState("Login");
              }}
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Create an account?
            <span
              onClick={() => {
                setState("Sign Up");
              }}
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;
