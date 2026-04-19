import { useState, useEffect, useRef } from "react";
import { optimizeCloudinaryUrl, getImageUrl, getLqipUrl } from "../utils/imageUtils";

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
  priority = false, // If true, sets loading="eager" and fetchpriority="high"
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  // 1. Resolve the base URL (handles local vs remote)
  const resolvedUrl = getImageUrl(src);

  // 2. Apply Cloudinary transformations if applicable
  const optimizedUrl = optimizeCloudinaryUrl(resolvedUrl, {
    width,
    height,
    crop,
  });

  // 3. Generate LQIP (Placeholder) URL
  const lqipUrl = getLqipUrl(resolvedUrl);

  // Reset state when source changes
  useEffect(() => {
    // Check if current image in ref is already complete (cached)
    if (imgRef.current?.complete) {
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
    }
    setError(false);
  }, [optimizedUrl]);

  return (
    <div className={`relative overflow-hidden w-full h-full ${className} bg-gray-100`}>
      {/* 1. SKELETON (Lowest layer, always there as bg) */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 skeleton z-0 w-full h-full" />
      )}

      {/* 2. LQIP PLACEHOLDER (Middle layer, blurs up) */}
      {!error && lqipUrl !== resolvedUrl && (
        <img
          src={lqipUrl}
          className={`absolute inset-0 w-full h-full object-cover blur-lg scale-110 z-10 transition-opacity duration-1000 ${
            isLoaded ? "opacity-0" : "opacity-100"
          }`}
          alt="loading placeholder"
        />
      )}

      {/* 3. ACTUAL IMAGE (Top layer, fades in) */}
      <img
        ref={imgRef}
        key={optimizedUrl} // Ensure re-mount on URL change for clean state
        src={optimizedUrl}
        alt={alt}
        loading={priority ? "eager" : loading}
        fetchpriority={priority ? "high" : "auto"}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        className={`relative z-20 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${props.imgClassName || ""}`}
        {...props}
      />

      {/* ERROR FALLBACK */}
      {error && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400 text-[10px] text-center p-2 font-black uppercase tracking-widest z-30">
          Image Unavailable
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
