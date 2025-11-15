/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        decha: {
          navy: '#0a0a0a',
          slate: '#1a1a1a',
          blue: '#007AFF', // Apple blue
          cyan: '#5AC8FA', // Apple cyan
          purple: '#AF52DE', // Apple purple
          pink: '#FF2D55', // Apple pink
          // Apple-inspired grays
          gray: {
            50: '#fafafa',
            100: '#f5f5f5',
            200: '#e5e5e5',
            300: '#d4d4d4',
            400: '#a3a3a3',
            500: '#737373',
            600: '#525252',
            700: '#404040',
            800: '#262626',
            900: '#171717',
            950: '#0a0a0a',
          }
        }
      },
      fontFamily: {
        // Apple system font stack
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Inter', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Menlo', 'Consolas', 'monospace'],
      },
      fontSize: {
        // Apple-style typography scale
        'display': ['72px', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'large-title': ['34px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'title-1': ['28px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        'title-2': ['22px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'title-3': ['20px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline': ['17px', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body': ['17px', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '400' }],
        'callout': ['16px', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '400' }],
        'subhead': ['15px', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '400' }],
        'footnote': ['13px', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '400' }],
      },
      spacing: {
        // Apple-style spacing scale
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        // Apple-style rounded corners
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },
      backdropBlur: {
        // Apple-style blur
        'xs': '2px',
      },
      boxShadow: {
        // Apple-style shadows
        'apple': '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)',
        'apple-lg': '0 4px 16px rgba(0, 0, 0, 0.2), 0 2px 6px rgba(0, 0, 0, 0.15)',
        'apple-xl': '0 8px 24px rgba(0, 0, 0, 0.25), 0 4px 8px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}