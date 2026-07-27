/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta editorial: fondo papel + casi-negro
        paper: '#E8E6E1',
        'paper-light': '#EDEBE7',
        ink: '#1A1A1A',
        'ink-soft': '#6B6862',
        'ink-faint': '#B7B3AC',
      },
      fontFamily: {
        // Titulares geométricos / cuerpo
        display: ['Anton', 'Archivo', 'sans-serif'],
        archivo: ['Archivo', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      maxWidth: {
        content: '1200px',
      },
      transitionDuration: {
        DEFAULT: '300ms',
      },
      transitionTimingFunction: {
        // Expo out: arranca rápido y frena largo. Misma sensación que el
        // easing de Lenis, para que scroll y cartas se muevan "igual".
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
