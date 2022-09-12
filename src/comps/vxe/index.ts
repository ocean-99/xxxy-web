import request from '/@/utils/request';
import { VXETable } from 'vxe-table';
import XEUtils from 'xe-utils';
import { nextTick } from 'vue';

export const vListInit = (state: any, gridOptions: any) => {
	gridOptions.highlightHoverRow = true;
	gridOptions.checkboxConfig = {};
	// gridOptions.height = "auto";
	gridOptions.height = '600px';
	gridOptions.pagerConfig = { pageSize: 10 };
	gridOptions.proxyConfig = {
		ajax: {
			query: ({ page }) => {
				const qparams: any = Object.assign({}, state.form);
				qparams.page = `${page.currentPage}`;
				qparams.pageSize = `${page.pageSize}`;
				return request({
					method: 'get',
					url: state.url,
					params: qparams,
				});
			},
		},
	};
};

export const vListQuery = (gridRef: any) => {
	gridRef.commitProxy('query');
};

export const vListDelete = async (gridRef: any, url: string) => {
	const selectRecords = gridRef.getCheckboxRecords();
	if (selectRecords.length == 0) {
		await VXETable.modal.message({ content: '请选择后再进行删除', status: 'warning' });
		return;
	}
	let ids = '';
	for (const selectRecord of selectRecords) {
		ids += selectRecord.id + ',';
	}
	const type = await VXETable.modal.confirm('您确定要删除吗？');
	if (type === 'confirm') {
		await request({ method: 'delete', url: url + '/' + ids.substr(0, ids.length - 1) });
		await gridRef.commitProxy('query');
	}
};

export const vTreeQuery = async (state: any, tableRef: any) => {
	const filterName = XEUtils.toValueString(state.filterName).trim();
	if (filterName) {
		const options = { children: 'children' };
		const searchProps = ['name'];
		state.list = XEUtils.searchTree(state.odata, item => searchProps.some(key => XEUtils.toValueString(item[key]).indexOf(filterName) > -1), options);
		await nextTick(() => {
			tableRef.setAllTreeExpand(true);
		});
	} else {
		state.list = state.odata;
	}
};

export const vTreeFetch = async (state: any, tableRef: any) => {
	state.odata = await request({
		url: state.url + '/tree',
		method: 'get',
		params: state.form,
	});
	await vTreeQuery(state, tableRef);
	// handleSearch();
};


export const vTreeDelete = async (state: any, tableRef: any, id: string) => {
	const type = await VXETable.modal.confirm('您确定要删除吗？');
	if (type === 'confirm') {
		await request({
			url: state.url + '/' + id,
			method: 'delete',
		});
		await vTreeFetch(state, tableRef);
	}
};

