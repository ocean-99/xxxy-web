import request from '/@/utils/request';
import router from '/@/router';

export const viewClose = (proxy: any, route: any) => {
	proxy.mittBus.emit('onCurrentContextmenuClick', Object.assign({}, { contextMenuClickId: 1, ...route }));
};

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

export const viewEdit = async (state: any, proxy: any, route: any) => {
	viewClose(proxy, route);
	router.push({
		path: state.url + '/edit',
		query: { id: state.form.id },
	});
};

