/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-primary-dark)',
        },
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        background: 'var(--color-bg)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          alt: 'var(--color-surface-alt)',
        },
        border: 'var(--color-border)',
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          disabled: 'var(--color-text-disabled)',
        },
        overlay: 'var(--color-overlay)',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Poppins', 'Segoe UI', 'sans-serif'],
        body: ['var(--font-body)', 'Inter', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['56px', '64px'],
        'h1': ['40px', '48px'],
        'h2': ['32px', '40px'],
        'h3': ['24px', '32px'],
        'h4': ['20px', '28px'],
        'body-lg': ['18px', '28px'],
        'body': ['16px', '26px'],
        'body-sm': ['14px', '22px'],
        'button': ['16px', '24px'],
        'overline': ['13px', '18px'],
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        6: '24px',
        8: '32px',
        12: '48px',
        16: '64px',
        24: '96px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(16, 24, 17, 0.06)',
        md: '0 4px 12px rgba(16, 24, 17, 0.10)',
        lg: '0 8px 24px rgba(16, 24, 17, 0.14)',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '16px',
        full: '9999px',
      },
    },
  },
  plugins: [],
};
