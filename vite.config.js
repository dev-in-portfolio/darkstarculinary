import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        restaurantConsulting: resolve(__dirname, 'restaurant-consulting.html'),
        privateEvents: resolve(__dirname, 'private-events.html'),
        contact: resolve(__dirname, 'contact.html'),
      },
    },
  },
});