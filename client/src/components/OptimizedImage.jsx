import { useState, useEffect } from "react";
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

  // Reset state when source changes
  useEffect(() => {
    setIsLoaded(false);
    setError(false);
  }, [src]);

  return (
    <div className={`relative overflow-hidden w-full h-full ${className}`}>
      {/* SKELETON LOADER - Only show if not loaded and no error */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 skeleton z-10 w-full h-full" />
      )}

      {/* ACTUAL IMAGE */}
      <img
        key={optimizedUrl} // Force re-render on URL change
        src={optimizedUrl}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${props.imgClassName || ""}`}
        {...props}
      />

      {/* ERROR FALLBACK */}
      {error && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400 text-[10px] text-center p-2 font-black uppercase tracking-widest z-20">
          Image Unavailable
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
