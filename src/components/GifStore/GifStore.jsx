const colorGifs = {
  black: '/gifs/black.gif',
  blue: '/gifs/blue.gif',
  brown: '/gifs/brown.gif',
  gold: '/gifs/gold.gif',
  green: '/gifs/green.gif',
  grey: '/gifs/grey.gif',
  orange: '/gifs/orange.gif',
  pink: '/gifs/pink.gif',
  purple: '/gifs/purple.gif',
  red: '/gifs/red.gif',
  silver: '/gifs/silver.gif',
  white: '/gifs/white.gif',
  yellow: '/gifs/yellow.gif',
};

// Export the GIFs and any necessary functions
const GifStore = {
  colorGifs, // Ensure this is properly exported
  getGif: (color) => {
    if (colorGifs[color]) {
      return colorGifs[color];
    } else {
      console.warn(`No GIF found for color: ${color}`); // Add warning for unmatched colors
      return null;
    }
  },
};

export default GifStore;

