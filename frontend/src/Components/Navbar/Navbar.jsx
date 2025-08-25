import React, { useState, useContext } from "react";
import "./Navbar.css";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import nav_dropdown from "../../assets/nav_dropdown.png";
import { useRef } from "react";

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const { getTotalCart } = useContext(ShopContext);
  const menuRef = useRef();

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle("nav-menu-visible");
    e.target.classList.toggle("open");
  };

  return (
    <div className="navbar">
      <Link
        to="/"
        className="links"
        onClick={() => {
          setMenu("shop");
        }}
      >
        <div className="nav-logo">
          <img src={logo} alt="" />
        </div>
      </Link>
      <img
        className="nav-dropdown"
        onClick={dropdown_toggle}
        src={nav_dropdown}
        alt=""
      />
      <ul ref={menuRef} className="nav-menu">
        <li
          onClick={() => {
            setMenu("shop");
          }}
        >
          <Link to="/" className="links">
            Shop
          </Link>
          {menu === "shop" ? <hr /> : <></>}
        </li>
        <li
          onClick={() => {
            setMenu("fiction");
          }}
        >
          <Link to="/fiction" className="links">
            Fiction
          </Link>

          {menu === "fiction" ? <hr /> : <></>}
        </li>
        <li
          onClick={() => {
            setMenu("non-fiction");
          }}
        >
          <Link to="/non-fiction" className="links">
            Non-Fiction
          </Link>
          {menu === "non-fiction" ? <hr /> : <></>}
        </li>
        <li
          onClick={() => {
            setMenu("children");
          }}
        >
          <Link to="/children" className="links">
            Children
          </Link>
          {menu === "children" ? <hr /> : <></>}
        </li>
      </ul>
      <div className="nav-login-cart">
        {localStorage.getItem("auth-token") ? (
          <button
          className="btn btn-secondary"
            onClick={() => {
              localStorage.removeItem("auth-token");
              window.location.replace("/");
            }}
          >
            Logout
          </button>
        ) : (
          <Link to="/login" className="btn btn-secondary">
            Login
          </Link>
        )}

        <Link to="/cart" className="links">
          <ShoppingCartOutlinedIcon fontSize="large" />
        </Link>
        <div className="nav-cart-count">{getTotalCart()}</div>
      </div>
    </div>
  );
};

export default Navbar;
