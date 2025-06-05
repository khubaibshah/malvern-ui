import preset from '@primevue/themes/preset'
import plugin from 'tailwindcss-primeui/plugin'

export default {
  presets: [preset],
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  plugins: [plugin]
}
