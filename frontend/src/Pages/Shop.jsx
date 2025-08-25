import React, { useRef } from "react";
import Hero from "../Components/Hero/Hero";
import BestSeller from "../Components/BestSeller/BestSeller";
import Offers from "../Components/Offers/Offers";
import NewCollections from "../Components/NewCollections/NewCollections";
import NewsLetter from "../Components/NewsLetter/NewsLetter";

const Shop = () => {
  const newCollectionsRef = useRef(null);
  const bestsellersRef = useRef(null);
  return (
    <div>
      <Hero scrollToRef={newCollectionsRef}/>
      <BestSeller refProp={bestsellersRef}/>
      <Offers scrollToRef={bestsellersRef} />
      <NewCollections refProp={newCollectionsRef}/>
      <NewsLetter/>
    </div>
  );
};

export default Shop;
