import './assets/style.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import "tailwindcss";
import "tailwindcss-primeui";

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/router'

// PrimeVue core setup
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura' // Use Aura preset

// Services
import ToastService from 'primevue/toastservice'

// Directives
import Ripple from 'primevue/ripple'
import StyleClass from 'primevue/styleclass'
import BadgeDirective from 'primevue/badgedirective'

// Components
import Button from 'primevue/button'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Toast from 'primevue/toast'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import Galleria from 'primevue/galleria'

// Create app
const app = createApp(App)

// PrimeVue setup (only once!)
app.use(PrimeVue, {
  ripple: true,
  style: true,
  theme: {
    preset: Aura.lightIndigo // can also use Aura.dark etc.
  }
})

app.use(createPinia())
app.use(router)
app.use(ToastService)

// Directives
app.directive('ripple', Ripple)
app.directive('styleclass', StyleClass)
app.directive('badge', BadgeDirective)

// Components
app.component('PrimeButton', Button)
app.component('PrimeCard', Card)
app.component('PrimeTag', Tag)
app.component('InputText', InputText)
app.component('Dropdown', Dropdown)
app.component('PrimeToast', Toast)
app.component('PrimeAccordion', Accordion)
app.component('PrimeAccordionPanel', AccordionPanel)
app.component('PrimeGalleria', Galleria)

// Global filters
app.config.globalProperties.$filters = {
  currencyGBP(value: number | string) {
    return Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      currencyDisplay: 'symbol'
    }).format(Number(value))
  },
  formatDate: (value: string) => {
    return new Intl.DateTimeFormat('en-GB').format(new Date(value))
  },
  formatDateTime: (value: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }
    return new Intl.DateTimeFormat('en-GB', options).format(new Date(value))
  }
}

app.mount('#app')
