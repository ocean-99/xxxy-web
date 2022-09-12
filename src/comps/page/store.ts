const pageList = [] as any;

export const putPage = (data: any) => {
	let flag=false;
	for (const page of pageList) {
		if (page.id == data.id) {
			flag=true;
			page.flush=data.flush;
			break;
		}
	}
	if(!flag){
		pageList.push(data);
	}
};

export const getPage = (id:string) => {
	for (const page of pageList) {
		if (page.id == id) {
			return page;
		}
	}
	return null;
};


