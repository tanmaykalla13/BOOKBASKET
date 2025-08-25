import { useContext, useMemo } from "react";
import "./ProductDisplay.css";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { ShopContext } from "../../Context/ShopContext";
const ProductDisplay = (props) => {
  const { product } = props;
  const { addToCart } = useContext(ShopContext);
  const { rating, reviews } = useMemo(() => {
    const randomRating = Math.floor(Math.random() * 3) + 3;
    const randomReviews = Math.floor(Math.random() * 300) + 1;
    return { rating: randomRating, reviews: randomReviews };
  }, []);
  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
        </div>
        <div className="productdisplay-img">
          <img src={product.image} alt="" className="productdisplay-main-img" />
        </div>
      </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-stars">
          {[...Array(5)].map((_, index) =>
            index < rating ? (
              <StarIcon key={index} />
            ) : (
              <StarBorderIcon key={index} />
            )
          )}
          <p>({reviews})</p>
        </div>
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">
            ₹{product.old_price}
          </div>
          <div className="productdisplay-right-price-new">
            ₹{product.new_price}
          </div>
        </div>
        <div className="productdisplay-right-description">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Minima,
          reprehenderit neque maxime velit pariatur dolorum reiciendis rem
          veritatis aliquam culpa.
        </div>
        <button className="btn"
          onClick={() => {
            addToCart(product.id);
          }}
        >
          Add to Cart
        </button>
        <p className="productdisplay-right-category">
          <span>Sale: </span>
          Save{" "}
          <span>
          {Math.round(
            ((product.old_price - product.new_price) / product.old_price) * 100
          )}
          %</span>
        </p>
        <p className="productdisplay-right-category">
          <span>Category: </span>
          {product.category === "fiction"
            ? "Fiction"
            : product.category === "non-fiction"
            ? "Non-Fiction"
            : product.category === "children"
            ? "Children"
            : "General"}
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;
