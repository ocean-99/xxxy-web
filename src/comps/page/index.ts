import request from '/@/utils/request';
import { ElMessage, ElMessageBox } from 'element-plus';
import router from '/@/router';
import { uuid } from '/@/utils/xutil';

export async function listQuery(state: any) {
	const data: any = await request({
		url: state.url,
		method: 'get',
		params: state.form,
	});
	state.list = data.items;
	state.total = data.total;
	state.loading = false;
}

export function listSelect(selection: any, state: any) {
	state.ids = selection.map((item: any) => item.id);
	state.single = selection.length !== 1;
	state.multiple = !selection.length;
}

export async function listDelete(state: any) {
	const delIds = state.ids.join(',');
	if (delIds.length <= 0) {
		ElMessage.warning('请选择后再进行删除');
		return;
	}
	ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await request({
				url: state.url + '/' + delIds,
				method: 'delete',
			});
			await listQuery(state);
		})
		.catch(() => ElMessage.info('已取消删除'));
}


export const tabAdd = (url: string) => {
	router.push({
		path: url + '/edit',
		query: { uuid: uuid() },
	});
};


export const tabEdit = (url: string, id: string) => {
	router.push({
		path: url + '/edit',
		query: { id: id },
	});
};

export const tabView = (url: string, id: string) => {
	router.push({
		path: url + '/view',
		query: { id: id },
	});
};

export const pageAdd = (url: string) => {
	// if(url.indexOf("?")>0){
	// 	window.open('/#/page/'+url+'&type=add');
	// }else{
	// 	window.open('/#/page/'+url+'?type=add');
	// }
	window.open('/#/page/'+url);
};

export const pageEdit = (url: string) => {
	window.open('/#/page/'+url);
};

export const pageView = (url: string) => {
	window.open('/#/page/'+url);
};




