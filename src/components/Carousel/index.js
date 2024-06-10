import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

const Caroussel = () => {
  return (
    <Carousel style={{ maxWidth: 600, maxHeight: 400, margin: "auto" }}>
      <div>
        <img
          src="https://images.pexels.com/photos/6312780/pexels-photo-6312780.jpeg"
          alt="carousel-image"
          style={{ maxWidth: "100%", maxHeight: "100%" }}
        />
        <p className="legend">1</p>
      </div>
      <div>
        <img
          src="https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="carousel-image"
          style={{ maxWidth: "100%", maxHeight: "100%" }}
        />
        <p className="legend">2</p>
      </div>
      <div>
        <img
          src="https://images.pexels.com/photos/326259/pexels-photo-326259.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="carousel-image"
          style={{ maxWidth: "100%", maxHeight: "100%" }}
        />
        <p className="legend">3</p>
      </div>
    </Carousel>
  );
};

export default Caroussel;
