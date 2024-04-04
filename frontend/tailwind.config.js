/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
    fontFamily: {
      'sans': ['"Roboto"', 'sans-serif'],
      'serif': ['"Roboto Slab"', 'serif'],
      'mono': ['"Roboto Mono"', 'monospace'],
      'lemon': ['Lemon', 'cursive']
    }
  },
  plugins: [],
}

