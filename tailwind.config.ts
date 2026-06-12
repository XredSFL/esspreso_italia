import type { Config } from 'tailwindcss'

// Design tokens from CLAUDE.md §5 — keep in sync with the approved mockups.
export default <Partial<Config>>{
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './composables/**/*.{js,ts}',
    './app.vue',
    './error.vue',
    './nuxt.config.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        espresso: '#2A1A12',
        brown: '#4A2E1E',
        caramel: '#C0852D',
        caramelDark: '#A66F22',
        cream: '#F7F1E8',
        panel: '#F2ECE2',
        ink: '#33291F',
        body: '#574A3D',
        muted: '#9C8C79',
        line: '#E4DACB',
        success: '#3FAE5A',
        danger: '#A23B23',
      },
      fontFamily: {
        // Headings = serif (Playfair Display); body = Inter.
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        // Rounded corners ~10px per the design tokens.
        DEFAULT: '10px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        soft: '0 6px 24px rgba(42, 26, 18, 0.08)',
        card: '0 2px 10px rgba(42, 26, 18, 0.06)',
      },
    },
  },
  plugins: [],
}
