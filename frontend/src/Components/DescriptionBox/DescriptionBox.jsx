import React, { useState } from "react";
import "./DescriptionBox.css";

const DescriptionBox = () => {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="descriptionbox">
      <div className="descriptionbox-navigator">
        <div
          className={`descriptionbox-nav-box ${
            activeTab === "description" ? "active" : "fade"
          }`}
          onClick={() => setActiveTab("description")}
        >
          Description
        </div>
        <div
          className={`descriptionbox-nav-box ${
            activeTab === "reviews" ? "active" : "fade"
          }`}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews (3)
        </div>
      </div>

      <div className="descriptionbox-description">
        {activeTab === "description" ? (
          <>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Voluptatum quia aperiam fugit atque fugiat iusto suscipit quam
              autem eos voluptas obcaecati vitae et, modi nulla veritatis, natus
              quisquam perspiciatis. Ipsam a id doloribus excepturi, sequi ex
              distinctio quibusdam quos laudantium autem repellat, iusto sunt
              accusamus aliquam temporibus, quam nulla exercitationem.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut quos
              quis aspernatur animi sequi explicabo debitis cumque temporibus
              commodi porro beatae, eum quasi velit cupiditate, assumenda ad vel
              dolor excepturi.
            </p>
          </>
        ) : (
          <>
            <p>
              ⭐️⭐️⭐️⭐️ - "Great product! Really happy with the quality."
            </p>
            <p>
              ⭐️⭐️⭐️ - "Decent item, but delivery took longer than expected."
            </p>
            <p>⭐️⭐️⭐️⭐️⭐️ - "Absolutely perfect. Will buy again!"</p>
          </>
        )}
      </div>
    </div>
  );
};

export default DescriptionBox;
