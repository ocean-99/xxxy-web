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


export const pageClose = () => {
	window.close();
};

export const pageSave =async (formRef: any, state: any) => {
	let isSuccess=true;
	const loading = ElLoading.service({
		lock: true,
		fullscreen: true,
		spinner:'el-icon-loading',
		text:'',
		background: 'rgba(0, 0, 0, 0.1)',
	});

	const canSubmit = await checkSubmit(formRef);
	if (!canSubmit) {
		loading.close();
		return false;
	}

	await request({
		url: state.url,
		method: 'put',
		data: state.form,
	}).catch(() => {
		isSuccess=false;
	});

	if(isSuccess){
		ElMessage({
			showClose: true,
			message: '保存成功，1秒后页面按自动关闭',
			type: 'success',
			duration:1000
		})
		setTimeout(() => {
			window.close();
		}, 1000);
	}else{
		loading.close();
	}
};

const checkSubmit = async (formRef: any) => {
	let canSubmit = false;
	await formRef.validate((valid: any, fields: any) => {
		if (valid) {
			canSubmit = true;
		} else {
			let msgs = "";
			for (const prop in fields) {
				for (let i = 0; i < fields[prop].length; i++) {
					msgs += fields[prop][i].message + "； "
				}
			}
			ElMessage.warning(msgs)
		}
	})
	return canSubmit;
}

