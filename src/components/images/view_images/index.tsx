import { useState } from "react";
import "./styles.css";

type ViewImagesComponentProps = {
  images_urls?: string[];
  images?: File[];
  isCommingFrom: "client" | "server";
};

export default function ViewImagesComponent(props: ViewImagesComponentProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const totalImages = props.images_urls
    ? props.images_urls.length
    : props.images
    ? props.images.length
    : 0;

  function handlePreviousImage() {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : totalImages - 1
    );
  }

  function handleNextImage() {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < totalImages - 1 ? prevIndex + 1 : 0
    );
  }

  function getSelectedImageByIndex() {
    if (props.images_urls) return props.images_urls[currentImageIndex];

    if (props.images)
      return URL.createObjectURL(props.images[currentImageIndex]);

    return undefined;
  }

  function images() {
    if (props.images_urls) return props.images_urls;

    if (props.images)
      return props.images.map((image) => URL.createObjectURL(image));

    return [];
  }

  return (
    <div className="slider-container">
      <div className="main-image-container">
        <img
          src={`${
            props.isCommingFrom === "server"
              ? import.meta.env.VITE_API_BASE_ROUTE + "/"
              : ""
          }${getSelectedImageByIndex()}`}
          alt={`Imagen ${currentImageIndex + 1}`}
          className="main-image"
        />
        <button
          className="nav-button prev-button"
          onClick={handlePreviousImage}
        >
          ❮
        </button>
        <button className="nav-button next-button" onClick={handleNextImage}>
          ❯
        </button>
      </div>
      <div className="image-slots">
        {images().map((image, index) => (
          <div
            key={index}
            className={`slot ${
              currentImageIndex === index ? "active" : "not-active"
            }`}
            onClick={() => setCurrentImageIndex(index)}
          >
            <img
              src={`${
                props.isCommingFrom === "server"
                  ? import.meta.env.VITE_API_BASE_ROUTE + "/"
                  : ""
              }${image}`}
              alt={`Imagen ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
