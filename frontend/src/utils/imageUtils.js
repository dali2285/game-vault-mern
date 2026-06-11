const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_BASE_URL = API.replace(/\/api\/?$/, '');

export const getImageSrc = (image) => {
  if (!image) return '';
  if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('data:')) {
    return image;
  }
  if (image.startsWith('/')) {
    return `${API_BASE_URL}${image}`;
  }
  return `${API_BASE_URL}/${image}`;
};

export const normalizeImages = (images = []) => {
  if (!Array.isArray(images)) return [];
  return images.map(getImageSrc);
};
