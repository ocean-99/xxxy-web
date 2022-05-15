import request from '/@/utils/request';

export const editInit = async (state: any, route: any) => {
	state.params = <any>route;
	let id = state.params.query?.id;
	if (id) {
		state.form = await request({
			url: state.url + '/one/' + id,
			method: 'get',
		});
	} else {
		state.form.avtag = true;
	}
};

export const tabSave = async (state: any, proxy: any, route: any) => {
	if (!state.form.crtim) {
		await request({
			url: state.url,
			method: 'post',
			data: state.form,
		});
	} else {
		await request({
			url: state.url,
			method: 'put',
			data: state.form,
		});
	}
	tabClose(proxy, route);
};

export const tabClose = (proxy: any, route: any) => {
	proxy.mittBus.emit('onCurrentContextmenuClick', Object.assign({}, { contextMenuClickId: 1, ...route }));
};

export const pageSave = async (state: any) => {
	if (!state.form.crtim) {
		await request({
			url: state.url,
			method: 'post',
			data: state.form,
		});
	} else {
		await request({
			url: state.url,
			method: 'put',
			data: state.form,
		});
	}
	window.close();
};

export const pageClose = () => {
	window.close();
};

export const drawerSave = async (state: any) => {
	if (!state.form.crtim) {
		await request({
			url: state.url,
			method: 'post',
			data: state.form,
		});
	} else {
		await request({
			url: state.url,
			method: 'put',
			data: state.form,
		});
	}
	state.show = false;
};

export const drawerOpen = async (state: any, id: string) => {
	if (id) {
		state.form = await request({
			url: state.url + '/one/' + id,
			method: 'get',
		});
	} else {
		state.form={avtag:true};
	}
	state.show = true;
};



