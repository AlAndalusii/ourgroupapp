import React from 'react';

interface BusinessLogoGeneratorProps {
  businessName: string;
  size?: number;
  backgroundColor?: string;
  textColor?: string;
}

/**
 * Generates a placeholder SVG logo for a business
 */
const BusinessLogoGenerator = ({
  businessName,
  size = 200,
  backgroundColor = '#0ea5e9',
  textColor = '#ffffff'
}: BusinessLogoGeneratorProps): string => {
  // Get initials from the business name (up to 2 letters)
  const getInitials = () => {
    const words = businessName.split(/\s+/);
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    } else {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
  };

  const initials = getInitials();
  const fontSize = size * 0.4; // Make font size relative to SVG size

  // Create SVG logo placeholder
  const svgContent = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="${backgroundColor}"/>
      <text 
        x="50%" 
        y="50%" 
        font-family="Arial, sans-serif" 
        font-weight="bold" 
        font-size="${fontSize}" 
        fill="${textColor}" 
        dominant-baseline="middle" 
        text-anchor="middle"
      >
        ${initials}
      </text>
    </svg>
  `;

  // Convert SVG to a data URL
  const dataUrl = `data:image/svg+xml;base64,${btoa(svgContent)}`;

  return dataUrl;
};

export default BusinessLogoGenerator; 