import { useContext, useState, useMemo } from "react";
import "./CSS/ShopCategory.css";
import Item from "../Components/Item/Item";
import { ShopContext } from "../Context/ShopContext";

const ShopCategory = (props) => {
  const { products } = useContext(ShopContext);
  const [sortOption, setSortOption] = useState("default");
  const [visibleCount, setVisibleCount] = useState(12);

  const filteredProducts = useMemo(() => {
    const categoryProducts = products.filter(
      (item) => item.category === props.category
    );

    if (sortOption === "lowToHigh") {
      return [...categoryProducts].sort((a, b) => a.new_price - b.new_price);
    } else if (sortOption === "highToLow") {
      return [...categoryProducts].sort((a, b) => b.new_price - a.new_price);
    }

    return categoryProducts;
  }, [products, props.category, sortOption]);

  if (!products) {
    return <div>Loading...</div>;
  }

  return (
    <div className="shop-category">
      <div className="shopcategory-indexSort">
        <p>
          <span>
            Showing 1 - {Math.min(visibleCount, filteredProducts.length)}
          </span>{" "}
          out of {filteredProducts.length} products
        </p>

        <div className="shopcategory-sort">
          <label htmlFor="sort">Sort by: </label>
          <div className="shopcategory-sort-field">
            <select
              id="sort"
              onChange={(e) => setSortOption(e.target.value)}
              value={sortOption}
            >
              <option value="default">Default</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="shopcategory-products">
        {filteredProducts.slice(0, visibleCount).map((item, i) => (
          <Item
            key={i}
            id={item.id}
            name={item.name}
            img={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
            className="item"
          />
        ))}
      </div>

      <div className="shopcategory-buttons">
        {visibleCount < filteredProducts.length && (
          <button
            className="shopcategory-loadmore"
            onClick={(e) => {
              e.preventDefault();
              setVisibleCount((prev) => prev + 12);
            }}
          >
            Explore More
          </button>
        )}

        {visibleCount > 12 && (
          <button
            className="shopcategory-showless"
            onClick={(e) => {
              e.preventDefault();
              setVisibleCount(12);
            }}
          >
            Show Less
          </button>
        )}
      </div>
    </div>
  );
};

export default ShopCategory;
