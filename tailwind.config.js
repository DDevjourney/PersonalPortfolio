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
        // 4.87:1 sobre `paper`. El valor anterior (#6B6862) daba 4.45:1 y se
        // quedaba justo por debajo del 4.5:1 que WCAG AA pide para texto
        // normal, que es el tamaño en el que se usa casi siempre.
        'ink-soft': '#65625C',
        'ink-faint': '#B7B3AC',
        // Rojo de acento para resaltar detalles. Solo 2.8:1 sobre `paper`: no
        // llega al 4.5:1 de WCAG AA para texto, así que se reserva para
        // elementos decorativos o texto que ya se lee por otro canal.
        accent: '#F54949',
      },
      fontFamily: {
        // Titulares geométricos / cuerpo
        display: ['Anton', 'Archivo', 'sans-serif'],
        archivo: ['Archivo', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        // Contenido dentro de cada sección (muro de skills, títulos de
        // tarjetas), para que no compita con los titulares en Anton.
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
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
