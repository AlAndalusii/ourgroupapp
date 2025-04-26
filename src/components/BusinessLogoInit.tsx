import BusinessLogoGenerator from './BusinessLogoGenerator';
import fs from 'fs';
import path from 'path';

// Generate and save logo placeholders
export const generateBusinessLogos = async () => {
  const businesses = [
    { name: 'ThewebTailors', color: '#0ea5e9' },
    { name: 'BestFlightAlerts', color: '#8b5cf6' },
    { name: 'Freelance work', color: '#10b981' }
  ];

  for (const business of businesses) {
    const logoDataUrl = BusinessLogoGenerator({
      businessName: business.name,
      backgroundColor: business.color
    });

    // Extract base64 data from data URL
    const base64Data = logoDataUrl.replace(/^data:image\/svg\+xml;base64,/, '');
    
    // Convert to Buffer
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Save to file
    const fileName = business.name.replace(/\s+/g, '').toLowerCase();
    const filePath = path.join(process.cwd(), 'public', 'logos', `${fileName}.svg`);
    
    try {
      fs.writeFileSync(filePath, buffer);
      console.log(`Generated logo for ${business.name} at ${filePath}`);
    } catch (error) {
      console.error(`Error saving logo for ${business.name}:`, error);
    }
  }
};

// Note: This is a utility component and is not meant to be rendered
export default function BusinessLogoInit() {
  return null;
} 