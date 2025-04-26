import { useState } from 'react';
import Image from 'next/image';

interface BusinessLogoProps {
  businessName: string;
  logoUrl?: string;
  onLogoChange: (logoUrl: string) => void;
}

const BusinessLogo: React.FC<BusinessLogoProps> = ({ 
  businessName, 
  logoUrl, 
  onLogoChange 
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(logoUrl || null);
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const result = event.target.result as string;
          setPreviewUrl(result);
          onLogoChange(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-primary-200 mb-2 bg-white flex items-center justify-center">
        {previewUrl ? (
          <Image 
            src={previewUrl} 
            alt={`${businessName} logo`} 
            width={80} 
            height={80}
            className="object-contain"
          />
        ) : (
          <div className="text-center text-gray-400 text-sm p-2">
            No logo
          </div>
        )}
      </div>
      <label 
        htmlFor={`logo-upload-${businessName.replace(/\s+/g, '-').toLowerCase()}`} 
        className="text-primary-600 text-sm hover:text-primary-800 cursor-pointer"
      >
        {previewUrl ? 'Change logo' : 'Add logo'}
      </label>
      <input 
        id={`logo-upload-${businessName.replace(/\s+/g, '-').toLowerCase()}`} 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleLogoUpload} 
      />
    </div>
  );
};

export default BusinessLogo; 