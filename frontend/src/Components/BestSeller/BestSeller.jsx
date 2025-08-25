import { useEffect, useState } from "react";
import "./BestSeller.css";
import Item from "../Item/Item";

const BestSeller = ({ refProp }) => {
  const [bestSellerProducts, setBestSellerProducts] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/bestsellers`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setBestSellerProducts(data.bestsellers);
      });
  }, []);

  return (
    <div ref={refProp} className="bestseller">
      <h1>Best Sellers</h1>
      <hr />
      <div className="bestseller-item">
        {bestSellerProducts.map((item, i) => {
          return (
            <Item
              key={i}
              id={item.id}
              name={item.name}
              img={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          );
        })}
      </div>
    </div>
  );
};

export default BestSeller;
