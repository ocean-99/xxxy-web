import { createApp } from 'vue';
import pinia from '/@/stores/index';
import App from '/@/App.vue';
import router from '/@/router';
import { directive } from '/@/directive/index';
import { i18n } from '/@/i18n/index';
import other from '/@/utils/other';

import ElementPlus from 'element-plus';
import VForm3 from 'vform3-builds';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'vform3-builds/dist/designer.style.css'
import 'vxe-table/lib/style.css';
import '/@/theme/index.scss';
import VueGridLayout from 'vue-grid-layout';
import { setupVxe } from '/@/comps/vxe/vxe';

const app = createApp(App);

directive(app);
other.elSvg(app);

setupVxe(app);

app.use(pinia).use(router).use(ElementPlus).use(VForm3).use(i18n).use(VueGridLayout).mount('#app');
