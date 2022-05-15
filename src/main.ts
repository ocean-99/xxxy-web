import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { store, key } from './store';
import { directive } from '/@/utils/directive';
import { i18n } from '/@/i18n/index';
import other from '/@/utils/other';

import ElementPlus from 'element-plus';
import VForm3 from 'vform3-builds';
import 'element-plus/dist/index.css';
import 'vform3-builds/dist/designer.style.css'
import '/@/theme/index.scss';
import mitt from 'mitt';
import VueGridLayout from 'vue-grid-layout';
import './iconfont.js';

const app = createApp(App);

directive(app);
other.elSvg(app);

app.use(router).use(store, key).use(ElementPlus, { i18n: i18n.global.t }).use(VForm3).use(i18n).use(VueGridLayout).mount('#app');
app.config.globalProperties.mittBus = mitt();
