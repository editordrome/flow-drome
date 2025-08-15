
import html2canvas from 'html2canvas';

export const generatePersonalizedImage = async (elementId: string, filename: string = 'material-personalizado') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found for image generation');
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: true,
      logging: false,
    });

    // Convert canvas to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 'image/png', 1.0);
  } catch (error) {
    console.error('Error generating image:', error);
  }
};
