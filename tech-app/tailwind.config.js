/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}","./app/**/*.{js,jsx,ts,tsx}","./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Modern Primary - Deep Ocean Blue (Professional, Trustworthy)
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',    // Main brand color - Sky blue
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Modern Secondary - Emerald Green (Success, Growth)
        secondary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',    // Fresh emerald
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // Accent Colors for Different Priorities
        accent: {
          purple: '#8b5cf6',   // For high priority
          orange: '#f59e0b',   // For medium priority
          rose: '#f43f5e',     // For critical/urgent
          indigo: '#6366f1',   // For info/notifications
        },
        // Status Colors (Enhanced)
        status: {
          success: '#10b981',    // Emerald green
          warning: '#f59e0b',    // Amber
          error: '#ef4444',      // Red
          info: '#3b82f6',       // Blue
          pending: '#f97316',    // Orange
          completed: '#22c55e',  // Green
        },
        // Enhanced Neutral Palette
        neutral: {
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
        },
        // Background Colors
        background: {
          primary: '#fafbfc',    // Light gray-blue
          secondary: '#f8fafc',  // Slightly warmer white
          card: '#ffffff',       // Pure white
          elevated: '#ffffff',   // White with shadow
        },
        // Text Colors
        text: {
          primary: '#1f2937',    // Dark gray
          secondary: '#6b7280',  // Medium gray
          tertiary: '#9ca3af',   // Light gray
          inverse: '#ffffff',    // White text
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 30px -5px rgba(0, 0, 0, 0.05)',
        'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}