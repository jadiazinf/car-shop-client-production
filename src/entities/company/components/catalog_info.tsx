import CompanyModel from "../model";
import lostImage from "../../../static/images/car-shop-services.jpg";
import { FiExternalLink, FiMapPin, FiStar } from "react-icons/fi";

interface IProps {
  company: CompanyModel;
  onClick?: (id: number) => void;
  rating?: number;
  category?: string;
}

function CompanyCatalogInfoComponent({ company, onClick, rating, category }: IProps) {
  const getImageSrc = () => {
    if (company.profile_image_url) {
      return `${import.meta.env.VITE_API_BASE_ROUTE}/${company.profile_image_url}`;
    }
    return lostImage;
  };

  const handleClick = () => {
    if (onClick && company.id) {
      onClick(company.id);
    }
  };

  return (
    <div
      className={`flex flex-row rounded-xl border border-gray-200 shadow-sm overflow-hidden
        w-full h-64 hover:shadow-md transition-all duration-300 bg-white
        ${onClick ? "cursor-pointer hover:border-gray-300" : ""}`}
      onClick={handleClick}
    >
      {/* Sección de imagen - Ajustada para mejor proporción */}
      <div className="relative w-2/5 min-w-[200px] h-full overflow-hidden bg-gray-100">
        <img
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          src={getImageSrc()}
          alt={company.name || "Company image"}
          onError={(e) => {
            (e.target as HTMLImageElement).src = lostImage;
          }}
          style={{
            objectPosition: "center center", // Asegura que la imagen esté centrada
          }}
        />

        {/* Badge de categoría */}
        {category && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-xs">
            <span className="text-xs font-medium text-gray-800">{category}</span>
          </div>
        )}
      </div>

      {/* Sección de información - Con más espacio */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-gray-900 line-clamp-2 pr-2">
              {company.name}
            </h3>

            {onClick && (
              <FiExternalLink className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 mt-1" />
            )}
          </div>

          <div className="flex items-center text-gray-500 mb-4">
            <FiMapPin className="mr-1.5 flex-shrink-0" />
            <p className="text-sm line-clamp-2" title={company.address}>
              {company.address}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          {/* Rating */}
          {rating !== undefined && (
            <div className="flex items-center">
              <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                <FiStar className="text-yellow-400 mr-1 fill-current" />
                <span className="text-sm font-medium text-gray-700">
                  {rating.toFixed(1)}
                </span>
              </div>
            </div>
          )}

          {/* CTA */}
          {onClick && (
            <button
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            >
              Ver detalles
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompanyCatalogInfoComponent;
