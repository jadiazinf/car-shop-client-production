import { useState } from "react";
import "./styles.css";

type ViewImagesComponentProps = {
  images: string[] | File[];
  isCommingFrom?: "client" | "server";
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

  function isFile(value: any): value is File {
    return value instanceof File;
  }

  function isString(value: any): value is string {
    return typeof value === "string";
  }

  function isBase64(value: any): value is string {
    return typeof value === "string" && value.startsWith("data:image/");
  }

  function getSelectedImageByIndex() {
    const currentImage = props.images[currentImageIndex];

    if (isFile(currentImage)) {
      return URL.createObjectURL(currentImage);
    } else if (isBase64(currentImage)) {
      return currentImage;
    } else if (isString(currentImage)) {
      return `${
        props.isCommingFrom === "server"
          ? import.meta.env.VITE_API_BASE_ROUTE + "/"
          : ""
      }${currentImage}`;
    }

    return "";
  }

  function getImageUrls() {
    return props.images.map((image) => {
      if (isFile(image)) {
        return URL.createObjectURL(image);
      } else if (isBase64(image)) {
        return image;
      } else if (isString(image)) {
        return `${
          props.isCommingFrom === "server"
            ? import.meta.env.VITE_API_BASE_ROUTE + "/"
            : ""
        }${image}`;
      }
      return "";
    });
  }

  return (
    <div className="slider-container">
      <div className="main-image-container">
        <img
          src={getSelectedImageByIndex()}
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
        {getImageUrls().map((image, index) => (
          <div
            key={index}
            className={`slot ${
              currentImageIndex === index ? "active" : "not-active"
            }`}
            onClick={() => setCurrentImageIndex(index)}
          >
            <img src={image} alt={`Imagen ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
