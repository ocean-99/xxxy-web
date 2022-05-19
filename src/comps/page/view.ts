import request from '/@/utils/request';
import router from '/@/router';
import {ElMessage,ElLoading} from "element-plus";

import { ArrowDown } from '@element-plus/icons-vue';
import {NextLoading} from "/@/utils/loading";



export const viewInit = async (state: any, route: any) => {
	state.params = <any>route;
	let id = state.params.query?.id;
	if (id) {
		state.form = await request({
			url: state.url + '/one/' + id,
			method: 'get',
		});
	} else {
		state.form = { avtag: true };
	}
};

export const tabEdit = async (state: any, proxy: any, route: any) => {
	tabClose(proxy, route);
	router.push({
		path: state.url + '/edit',
		query: { id: state.form.id },
	});
};

export const tabClose = (proxy: any, route: any) => {
	proxy.mittBus.emit('onCurrentContextmenuClick', Object.assign({}, { contextMenuClickId: 1, ...route }));
};


export const pageClose = (duration:number) => {
	if(!duration){
		window.close();
	}
	// ElLoading.service({
	// 	lock: true,
	// 	fullscreen: true,
	// 	// spinner:'el-icon-loading',
	// 	text:'保存成功，'+(duration/1000)+'秒后页面按自动关闭',
	// 	background: 'rgba(0, 0, 0, 0.1)',
	// });
	ElLoading.service({
		lock: true,
		fullscreen: true,
		spinner:'el-icon-loading',
		text:'',
		background: 'rgba(0, 0, 0, 0.1)',
	});
	ElMessage({
		showClose: true,
		message: '保存成功，'+(duration/1000)+'秒后页面按自动关闭',
		type: 'success',
		duration:duration
	})
	setTimeout(() => {
		window.close();
	}, duration);

};
