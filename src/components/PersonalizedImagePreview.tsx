
import React, { useState } from 'react';
import { MaterialTemplate } from '../data/materialTemplates';

interface PersonalizationData {
  nomeUnidade: string;
  telefone: string;
  instagram: string;
  email: string;
}

interface PersonalizedImagePreviewProps {
  template: MaterialTemplate;
  personalizationData: PersonalizationData;
  id?: string;
}

const PersonalizedImagePreview = ({ template, personalizationData, id = 'personalized-preview' }: PersonalizedImagePreviewProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const renderField = (fieldKey: keyof PersonalizationData, fieldConfig: any) => {
    const value = personalizationData[fieldKey];
    const isEmpty = !value || value.trim() === '' || value === '@';
    const displayText = isEmpty ? fieldConfig.placeholder : value;
    
    // Se o campo estiver vazio, usa transparência, senão usa a cor original
    const textColor = isEmpty ? 'transparent' : fieldConfig.style.color;

    return (
      <div
        key={fieldKey}
        className="absolute pointer-events-none whitespace-nowrap"
        style={{
          ...fieldConfig.position,
          fontFamily: fieldConfig.style.fontFamily,
          fontSize: fieldConfig.style.fontSize,
          color: textColor,
          fontWeight: fieldConfig.style.fontWeight,
          textShadow: isEmpty ? 'none' : fieldConfig.style.textShadow,
          backgroundColor: fieldConfig.style.backgroundColor,
          padding: fieldConfig.style.padding,
          borderRadius: fieldConfig.style.borderRadius,
          textAlign: fieldConfig.position.textAlign || 'left',
          lineHeight: '1.2',
          maxWidth: '85%',
          zIndex: 10
        }}
      >
        {displayText}
      </div>
    );
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully');
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    console.error('Error loading image:', template.imageUrl);
    setImageError(true);
    setImageLoaded(false);
  };

  return (
    <div id={id} className="relative max-w-md mx-auto bg-white">
      {imageError && (
        <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Erro ao carregar a imagem</p>
        </div>
      )}
      
      <img 
        src={template.imageUrl} 
        alt={template.name}
        className={`w-full rounded-lg shadow-lg ${imageLoaded ? 'block' : 'hidden'}`}
        crossOrigin="anonymous"
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
      
      {!imageLoaded && !imageError && (
        <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Carregando imagem...</p>
        </div>
      )}
      
      {imageLoaded && (
        <div className="absolute inset-0">
          {Object.entries(template.fields).map(([fieldKey, fieldConfig]) =>
            renderField(fieldKey as keyof PersonalizationData, fieldConfig)
          )}
        </div>
      )}
    </div>
  );
};

export default PersonalizedImagePreview;
