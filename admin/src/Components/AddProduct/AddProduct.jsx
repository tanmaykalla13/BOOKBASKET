import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../../assets/upload_area.svg";

const AddProduct = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    image: "",
    category: "fiction",
    new_price: "",
    old_price: "",
  });

  const validateForm = () => {
    if (!product.name || !product.old_price || !product.new_price || !image) {
      alert("Please fill in all the fields and upload an image.");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    let responseData;
    let productData = { ...product };
    let formData = new FormData();
    formData.append("product", image);
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        responseData = data;
      })
      .catch((error) => {
        alert("Image upload failed. Please try again.");
        console.error("Error:", error);
      });

    if (responseData.success) {
      productData.image = responseData.image_url;
      console.log(productData);
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/addproduct`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert("Product Added Successfully");
            setProduct({
              name: "",
              image: "",
              category: "fiction",
              new_price: "",
              old_price: "",
            });
            setImage(null);
          } else {
            alert("Product Not Added");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
    setLoading(false);
  };

  return (
    <div className="add-product">
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input
          value={product.name}
          onChange={handleChange}
          type="text"
          name="name"
          placeholder="Type Here"
        />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            value={product.old_price}
            onChange={handleChange}
            type="text"
            name="old_price"
            placeholder="Type Here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            value={product.new_price}
            onChange={handleChange}
            type="text"
            name="new_price"
            placeholder="Type Here"
          />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          value={product.category}
          onChange={handleChange}
          name="category"
          className="add-product-category"
        >
          <option value="fiction">Fiction</option>
          <option value="non_fiction">Non - Fiction</option>
          <option value="children">Children</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            alt="Upload"
            className="addproduct-img"
          />
        </label>
        <input
          onChange={handleImageChange}
          type="file"
          name="image"
          id="file-input"
          hidden
          accept="image/*"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="addproduct-btn"
        disabled={loading}
      >
        {loading ? "Adding..." : "ADD"}
      </button>
    </div>
  );
};

export default AddProduct;
