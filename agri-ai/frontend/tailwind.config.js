/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sage: {
          hint: '#BFCFBB',
          mint: '#A8BFA6',
          DEFAULT: '#8EA58C',
          moss: '#738A6E',
          evergreen: '#344C3D',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'sage-sm': '0 2px 8px rgba(52, 76, 61, 0.08)',
        'sage-md': '0 4px 24px rgba(52, 76, 61, 0.12)',
        'sage-lg': '0 8px 40px rgba(52, 76, 61, 0.16)',
        'sage-xl': '0 16px 64px rgba(52, 76, 61, 0.20)',
        'glass': '0 8px 32px rgba(52, 76, 61, 0.10), inset 0 1px 0 rgba(255,255,255,0.4)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'counter': 'counter 1s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'sage-gradient': 'linear-gradient(135deg, #BFCFBB 0%, #A8BFA6 50%, #8EA58C 100%)',
        'evergreen-gradient': 'linear-gradient(135deg, #344C3D 0%, #738A6E 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(191,207,187,0.4) 0%, rgba(168,191,166,0.2) 100%)',
      },
    },
  },
  plugins: [],
}
