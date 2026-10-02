import React, { useState, useEffect } from 'react';
import defaultCbeLogo from '../assets/images/cbe_new_gold_logo_1790860237511.jpg';

interface CbeLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  customUrl?: string;
  isDarkBg?: boolean;
  onClick?: () => void;
}

export const CbeLogo: React.FC<CbeLogoProps> = ({
  className = '',
  size = 'md',
  customUrl,
  isDarkBg = false,
  onClick,
}) => {
  const [activeUrl, setActiveUrl] = useState<string>(() => {
    return customUrl || localStorage.getItem('cbe_custom_logo_url') || defaultCbeLogo;
  });
  const [processedUrl, setProcessedUrl] = useState<string>('');

  useEffect(() => {
    const url = customUrl || localStorage.getItem('cbe_custom_logo_url') || defaultCbeLogo;
    setActiveUrl(url);

    if (url) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;

          // Remove white/near-white background pixels so the golden logo is 100% transparent and seamlessly sits on any background
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            if (r > 220 && g > 220 && b > 220) {
              data[i + 3] = 0; // completely transparent
            } else if (r > 190 && g > 190 && b > 190 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20) {
              const factor = (255 - Math.max(r, g, b)) / 65;
              data[i + 3] = Math.floor(data[i + 3] * factor);
            }
          }
          ctx.putImageData(imgData, 0, 0);
          setProcessedUrl(canvas.toDataURL('image/png'));
        }
      };
      img.onerror = () => {
        setProcessedUrl(url);
      };
    } else {
      setProcessedUrl(url);
    }
  }, [customUrl, isDarkBg]);

  const sizeClass = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-24 h-24',
    xl: 'w-28 h-28',
  }[size];

  const currentDisplaySrc = processedUrl || activeUrl;

  return (
    <div
      onClick={onClick}
      className={`relative flex items-center justify-center shrink-0 select-none ${sizeClass} ${className} ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
    >
      {currentDisplaySrc ? (
        <img
          src={currentDisplaySrc}
          alt="Commercial Bank of Ethiopia Official 3D Gold Logo"
          className={`w-full h-full object-contain ${!isDarkBg ? 'mix-blend-multiply' : ''}`}
          style={{ backgroundColor: 'transparent' }}
        />
      ) : (
        /* Precise 3D Golden Spiral Vector that is 100% transparent */
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <defs>
            <radialGradient id="goldSphere" cx="45%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#fff2c2" />
              <stop offset="25%" stopColor="#f3ca65" />
              <stop offset="60%" stopColor="#c59223" />
              <stop offset="90%" stopColor="#87580e" />
              <stop offset="100%" stopColor="#4a2e05" />
            </radialGradient>

            <linearGradient id="spiralGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffe599" />
              <stop offset="35%" stopColor="#dfa732" />
              <stop offset="70%" stopColor="#b37e1a" />
              <stop offset="100%" stopColor="#6e4708" />
            </linearGradient>
          </defs>

          <g opacity="0.95">
            {[
              { angle: -38, rx: 46, ry: 20, cx: 48, cy: 46, strokeW: 0.9, op: 0.8 },
              { angle: -26, rx: 47, ry: 21, cx: 49, cy: 48, strokeW: 0.85, op: 0.75 },
              { angle: -14, rx: 48, ry: 22, cx: 50, cy: 50, strokeW: 0.85, op: 0.7 },
              { angle: -2, rx: 49, ry: 23, cx: 51, cy: 52, strokeW: 0.85, op: 0.65 },
              { angle: 10, rx: 50, ry: 24, cx: 52, cy: 53, strokeW: 0.9, op: 0.7 },
              { angle: 22, rx: 50, ry: 24, cx: 52, cy: 54, strokeW: 0.95, op: 0.75 },
              { angle: 34, rx: 49, ry: 23, cx: 51, cy: 53, strokeW: 0.9, op: 0.8 },
              { angle: 46, rx: 48, ry: 22, cx: 50, cy: 51, strokeW: 0.85, op: 0.75 },
              { angle: 58, rx: 46, ry: 20, cx: 49, cy: 49, strokeW: 0.8, op: 0.7 },
              { angle: 70, rx: 44, ry: 19, cx: 48, cy: 48, strokeW: 0.75, op: 0.65 },
              { angle: 82, rx: 42, ry: 18, cx: 47, cy: 47, strokeW: 0.7, op: 0.6 },
            ].map((ring, idx) => (
              <ellipse
                key={idx}
                cx={ring.cx}
                cy={ring.cy}
                rx={ring.rx}
                ry={ring.ry}
                fill="none"
                stroke="url(#spiralGold)"
                strokeWidth={ring.strokeW}
                opacity={ring.op}
                transform={`rotate(${ring.angle} ${ring.cx} ${ring.cy})`}
              />
            ))}
          </g>

          <circle cx="50" cy="50" r="18" fill="url(#goldSphere)" />
          <text x="50" y="47" textAnchor="middle" fill="#583407" fontSize="8" fontWeight="bold" fontFamily="serif">
            CBE
          </text>
          <text x="50" y="55" textAnchor="middle" fill="#6d420a" fontSize="5" fontWeight="bold">
            ኢንግባ
          </text>
        </svg>
      )}
    </div>
  );
};
