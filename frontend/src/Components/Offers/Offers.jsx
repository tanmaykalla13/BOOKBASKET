import React from "react";
import "./Offers.css";
import offerBook from "../../assets/offerBook.jpg";

const Offers = ({scrollToRef}) => {
  const handleScroll = () => {
    scrollToRef.current?.scrollIntoView({ behavior: "smooth" });
    
  };
  return (
    <div className="offers">
      <div className="offers-left">
        <h1>Exsclusive</h1>
        <h1>Offers For You</h1>
        <p>ONLY ON BEST SELLERS PRODUCTS</p>
        <button className="btn" onClick={handleScroll}>Check Now</button>
      </div>
      <div className="offers-right">
        <img src={offerBook} alt="" />
      </div>
    </div>
  );
};

export default Offers;
