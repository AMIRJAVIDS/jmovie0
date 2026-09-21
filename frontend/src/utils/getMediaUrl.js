export const getMediaUrl = (path) => {
  if (!path) return "";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${import.meta.env.VITE_MEDIA_BASE_URL}${path}`;
};
