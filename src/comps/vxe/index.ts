import request from '/@/utils/request';
import {VXETable} from "vxe-table";

export const vxeInit = (state: any, gridOptions: any) => {
	gridOptions.highlightHoverRow = true;
	gridOptions.checkboxConfig = {};
	// gridOptions.height = "auto";
	gridOptions.height = '600px';
	gridOptions.pagerConfig = {pageSize: 10};
	gridOptions.proxyConfig = {
		ajax: {
			query: ({page}) => {
				const qparams: any = Object.assign({}, state.form);
				qparams.page = `${page.currentPage}`;
				qparams.pageSize = `${page.pageSize}`;
				return request({
					method:'get',
					url: state.url,
					params: qparams
				});
			}
		}
	};
};

export const vxeQuery = (gridRef:any) => {
	gridRef.commitProxy("query");
};

export const vxeDelete=async (gridRef:any,url:string)=>{
	const selectRecords = gridRef.getCheckboxRecords();
	if (selectRecords.length == 0) {
		await VXETable.modal.message({content: "请选择后再进行删除", status: "warning"});
		return;
	}
	let ids = "";
	for (const selectRecord of selectRecords) {
		ids += selectRecord.id + ",";
	}
	const type = await VXETable.modal.confirm("您确定要删除吗？");
	if (type === "confirm") {
		await request({method:'delete',url: url + "/" + ids.substr(0, ids.length - 1)});
		await gridRef.commitProxy("query");
	}
}
