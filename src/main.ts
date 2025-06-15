import './assets/style.css'
// import 'primevue/resources/themes/aura-light-indigo/theme.css';
//change colour theme here
import 'primevue/resources/themes/aura-light-indigo/theme.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'
const pinia = createPinia();
import PrimeVue from 'primevue/config';

import "primeflex/primeflex.css"
import 'primeicons/primeicons.css'

import StyleClass from 'primevue/styleclass';
       
import Ripple from 'primevue/ripple';

import Button from "primevue/button"
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Textarea from 'primevue/textarea';
import Calendar from 'primevue/calendar';
import Badge from 'primevue/badge';
import Message from 'primevue/message';
import Checkbox from 'primevue/checkbox';
import Divider from 'primevue/divider';
import Carousel from 'primevue/carousel';
import VirtualScroller from 'primevue/virtualscroller';
import Tag from 'primevue/tag';
import Fieldset from 'primevue/fieldset';
import Card from 'primevue/card';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import ProgressBar from 'primevue/progressbar';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Tree from 'primevue/tree';
import Steps from 'primevue/steps';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import FloatLabel from 'primevue/floatlabel';
import Panel from 'primevue/panel';
import Dialog from 'primevue/dialog';
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions';
import Image from 'primevue/image';
import Menubar from 'primevue/menubar';
import MegaMenu from 'primevue/megamenu';
import Slider from 'primevue/slider';
import Dropdown from 'primevue/dropdown';
import Galleria from 'primevue/galleria';
import AnimateOnScroll from 'primevue/animateonscroll';

import ScrollTop from 'primevue/scrolltop';

import Skeleton from 'primevue/skeleton';



import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import BadgeDirective from 'primevue/badgedirective';
import App from './App.vue'
import router from './router/router'


const app = createApp(App)


app.use(ToastService);
app.use(PrimeVue, { ripple: true, style: true });
app.use(createPinia())
app.use(router)

app.directive('badge', BadgeDirective);
app.directive('styleclass', StyleClass);
app.directive('ripple', Ripple);
app.directive('styleclass', StyleClass);
app.directive('animateonscroll', AnimateOnScroll);

app.component('AccordionTab', AccordionTab);
app.component('Accordion', Accordion);
app.component('InputText', InputText);
app.component('Dropdown', Dropdown);
app.component('PrimeButton', Button);
app.component('DataTable', DataTable);
app.component('PrimeColumn', Column);
app.component('PrimeTextarea', Textarea);
app.component('PrimeCalendar', Calendar);
app.component('PrimeBadge', Badge);
app.component('PrimeMessage', Message);
app.component('PrimeToast', Toast);
app.component('PrimeCheckbox', Checkbox);
app.component('PrimeDivider', Divider);
app.component('PrimeCarousel', Carousel);
app.component('PrimeImage', Image);
app.component('VirtualScroller', VirtualScroller);
app.component('PrimeDataView', DataView)
app.component('PrimeDataViewLayoutOptions', DataViewLayoutOptions)
app.component('PrimeTag', Tag);
app.component('PrimeFieldset', Fieldset);
app.component('PrimeCard', Card);
app.component('IconField', IconField);
app.component('InputIcon', InputIcon);
app.component('ProgressBar', ProgressBar);
app.component('InputGroup', InputGroup);
app.component('InputGroupAddon', InputGroupAddon);
app.component('PrimeTree', Tree);
app.component('PrimeSteps', Steps);
app.component('PrimeFloatLabel', FloatLabel);
app.component('PrimePanel', Panel);
app.component('PrimeDialog', Dialog);
app.component('PrimeToast', Toast)
app.component('PrimeMenubar', Menubar)
app.component('PrimeMegaMenu', MegaMenu)
app.component('PrimeSlider', Slider)
app.component('PrimeGalleria', Galleria)
app.component('PrimeSkeleton', Skeleton)
app.component('PrimeScrollTop', ScrollTop)


app.config.globalProperties.$filters = {
    currencyGBP(value: number | string) {
        return Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: import.meta.env.VITE_APP_REGION === 'UK' ? 'GBP' : 'EUR',
            currencyDisplay: 'symbol',
        }).format(Number(value))
    },
    formatDate: (value: string) => {
        return new Intl.DateTimeFormat('en-GB').format(new Date(value));
    },
    formatDateTime: (value: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Intl.DateTimeFormat('en-GB', options).format(new Date(value));
    },
    
};


app.mount('#app')
