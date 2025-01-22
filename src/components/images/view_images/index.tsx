import { useState } from "react";
import "./styles.css";
import { TypesHelpers } from "../../../helpers/types";

type ViewImagesComponentProps = {
  images: string[] | File[];
  isCommingFrom: "client" | "server";
};

export default function ViewImagesComponent(props: ViewImagesComponentProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const totalImages = props.images.length;

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
    if (TypesHelpers.isStringArray(props.images))
      return props.images[currentImageIndex];
    return URL.createObjectURL(props.images[currentImageIndex] as File);
  }

  function images() {
    if (TypesHelpers.isStringArray(props.images)) return props.images;
    if (TypesHelpers.isFileArray(props.images))
      return props.images.map((element) =>
        URL.createObjectURL(element as File)
      );

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
