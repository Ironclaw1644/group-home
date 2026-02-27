import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0f2d45',
          teal: '#0c9ea6',
          aqua: '#6fe2df',
          sand: '#f5f1ea',
          slate: '#536779'
        }
      },
      boxShadow: {
        card: '0 10px 30px rgba(15,45,69,0.08)'
      },
      borderRadius: {
        xl2: '1.25rem'
      }
    }
  },
  plugins: []
};

export default config;
