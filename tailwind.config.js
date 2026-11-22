/** Tokens de Los Olivos (mismos de GenFlow / crm-frontend). */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7f1', 100: '#b3e6d4', 200: '#80d5b7', 300: '#4dc49a', 400: '#1ab37d',
          500: '#00875c', 600: '#006d4a', 700: '#005a3d', 800: '#004730', 900: '#003423',
        },
        cream: '#f9fafb',
        'brown-deep': '#004730',
        'brown-warm': '#005a3d',
        gold: '#00875c',
        'gold-bright': '#1ab37d',
        sage: '#16a34a',
        danger: '#dc2626',
        warning: '#f59e0b',
        text1: '#111827',
        text2: '#374151',
        text3: '#6b7280',
      },
      fontFamily: {
        serif: ['Comfortaa', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Raleway', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: { sv: '10px' },
      boxShadow: {
        'sv-card': '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
