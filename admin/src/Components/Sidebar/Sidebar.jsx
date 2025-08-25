import React from "react";
import "./Sidebar.css";
import { Link, useLocation } from "react-router-dom";
import add_product_icon from "../../assets/Product_Cart.svg";
import list_product_icon from "../../assets/Product_list_icon.svg";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <Link to="/addproduct" className="sidebar-link">
        <div
          className={`sidebar-item ${
            location.pathname === "/addproduct" ? "active" : ""
          }`}
        >
          <img src={add_product_icon} alt="Add Product" />
          <p>Add Product</p>
        </div>
      </Link>
      <Link to="/listproduct" className="sidebar-link">
        <div
          className={`sidebar-item ${
            location.pathname === "/listproduct" ? "active" : ""
          }`}
        >
          <img src={list_product_icon} alt="Product List" />
          <p>Product List</p>
        </div>
      </Link>
    </div>
  );
};

export default Sidebar;
