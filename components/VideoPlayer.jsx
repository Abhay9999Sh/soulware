"use client";

import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { Play, PlayCircle } from "lucide-react";

export default function VideoPlayer({ 
  videoUrl, 
  title = "Mental Health Video", 
  description = "",
  className = "" 
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Lazy loading with intersection observer
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true // Only load once when it comes into view
  });

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleLoadedData = () => {
    setIsLoaded(true);
  };

  return (
    <div ref={ref} className={`relative bg-gray-100 rounded-xl overflow-hidden shadow-lg ${className}`}>
      {/* Video Title */}
      {title && (
        <div className="bg-white p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
      )}
      
      {/* Video Container */}
      <div className="relative aspect-video bg-gray-200">
        {inView ? (
          <>
            {/* Video Element */}
            <video
              className="w-full h-full object-cover"
              controls
              preload="metadata"
              onLoadedData={handleLoadedData}
              onPlay={handlePlay}
              poster={`${videoUrl.replace('.mp4', '.jpg')}`} // Try to get thumbnail
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Loading State */}
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
          </>
        ) : (
          /* Placeholder before lazy loading */
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="text-center">
              <PlayCircle className="w-16 h-16 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Video will load when visible</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}