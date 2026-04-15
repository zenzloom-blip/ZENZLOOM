import { useState } from "react";
import { optimizeCloudinaryUrl, getImageUrl } from "../utils/imageUtils";

/**
 * A wrapper for the <img> tag that adds Cloudinary optimization and skeleton loading.
 */
const OptimizedImage = ({
  src,
  alt,
  className = "",
  width,
  height,
  crop = "fill",
  loading = "lazy",
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // 1. Resolve the base URL (handles local vs remote)
  const resolvedUrl = getImageUrl(src);

  // 2. Apply Cloudinary transformations if applicable
  const optimizedUrl = optimizeCloudinaryUrl(resolvedUrl, {
    width,
    height,
    crop,
  });

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* SKELETON LOADER */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 skeleton z-10" />
      )}

      {/* ACTUAL IMAGE */}
      <img
        src={optimizedUrl}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-all duration-700 ${
          isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
        } ${props.imgClassName || ""}`}
        {...props}
      />

      {/* ERROR FALLBACK */}
      {error && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400 text-xs text-center p-2 font-bold uppercase tracking-widest">
          Failed to load image
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
