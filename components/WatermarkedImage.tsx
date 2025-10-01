import React from 'react';

interface WatermarkedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

const WatermarkedImage: React.FC<WatermarkedImageProps> = ({ alt, ...props }) => {
  return (
    <div className="relative inline-block w-full h-full leading-none">
      <img alt={alt} {...props} />
      <span
        className="absolute bottom-2 right-2 text-white text-xs font-sans pointer-events-none select-none"
        style={{ opacity: 0.5, textShadow: '0px 0px 4px black' }}
        aria-hidden="true"
      >
        © A Laiz Prod
      </span>
    </div>
  );
};

export default WatermarkedImage;