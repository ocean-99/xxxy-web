import req from '/@/utils/req';
import {ElLoading, ElMessage} from "element-plus";
import { getPage } from '/@/comps/page/store';
import mittBus from '/@/utils/mitt';

interface IeditInit {
    state: any;
    route:any;
}
export const editInit = async (data:IeditInit) => {
    data.state.params = <any>data.route;
    let id = data.state.params.query?.id;
    if (id) {
        data.state.form = await req.get({
            url: data.state.url + '/one/' + id,
        });
    } else {
        data.state.form.avtag = true;
    }
};


interface ItabSave {
    state: any;
    formRef:any;
    proxy:any;
    route:any;
    iouField?: string;
    flush?:any;
}
export const tabSave = async (data:ItabSave) => {
    const canSubmit = await checkSubmit(data.formRef);
    if (!canSubmit) {
        return false;
    }
    if(!data.iouField){
        data.iouField = "id";
    }
    if (!data.state.form[data.iouField]) {
        await req.post({
            url: data.state.url,
            data: data.state.form,
        });
    } else {
        await req.put({
            url: data.state.url,
            data: data.state.form,
        });
    }
    tabClose({proxy:data.proxy, route:data.route});
    if(data.flush){
        const page= getPage(data.flush);
        if(page){
            page.flush();
        }
    }
};

interface ItabClose {
    proxy:any;
    route:any;
}
export const tabClose = (data:ItabClose) => {
    mittBus.emit('onCurrentContextmenuClick', Object.assign({}, {contextMenuClickId: 1, ...data.route}));
};


interface IpageSave {
    state: any;
    formRef:any;
    iouField?: string;
}

export const pageSave = async (data:IpageSave) => {
    const loading = ElLoading.service({
        lock: true,
        fullscreen: true,
        text:'',
        background: 'rgba(0, 0, 0, 0.1)',
    });
    const canSubmit = await checkSubmit(data.formRef);
    if (!canSubmit) {
        loading.close();
        return false;
    }

    let isSuccess=true;
    if(!data.iouField){
        data.iouField = "id";
    }
    if (!data.state.form[data.iouField]) {
        await req.post({
            url: data.state.url,
            data: data.state.form,
        }).catch(() => {
            isSuccess=false;
        });
    } else {
        await req.put({
            url: data.state.url,
            data: data.state.form,
        }).catch(() => {
            isSuccess=false;
        });
    }
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

export const pageClose = () => {
    window.close();
};

interface IdrawerSave {
    state: any;
    formRef:any;
    iouField?: string;
}

export const drawerSave = async (data:IdrawerSave) => {
    const canSubmit = await checkSubmit(data.formRef);
    if (!canSubmit) {
        return false;
    }

    if(!data.iouField){
        data.iouField = "id";
    }
    if (!data.state.form[data.iouField]) {
        await req.post({
            url: data.state.url,
            data: data.state.form,
        });
    } else {
        await req.put({
            url: data.state.url,
            data: data.state.form,
        });
    }
    data.state.show = false;
};


interface IdrawerOpen {
    state: any;
    id:string;
}

export const drawerOpen = async (data:IdrawerOpen) => {
    if (data.id) {
        data.state.form = await req.get({
            url: data.state.url + '/one/' + data.id,
        });
    } else {
        data.state.form = {avtag: true};
    }
    data.state.show = true;
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

interface ImodalSave {
    state: any;
    formRef:any;
    iouField?: string;
}

export const modalSave = async (data:ImodalSave) => {
    const loading = ElLoading.service({
        lock: true,
        fullscreen: true,
        text:'',
        background: 'rgba(0, 0, 0, 0.1)',
    });
    let isSuccess=true;
    const canSubmit = await checkSubmit(data.formRef);
    if (!canSubmit) {
        loading.close();
        return false;
    }

    if(!data.iouField){
        data.iouField = "id";
    }
    let back;
    if (!data.state.form[data.iouField]) {
        back=await req.post({
            url: data.state.url,
            data: data.state.form,
        }).catch(() => {
            isSuccess=false;
        });
    } else {
        back=await req.put({
            url: data.state.url,
            data: data.state.form,
        }).catch(() => {
            isSuccess=false;
        });
    }
    loading.close();
    if(isSuccess){
        data.state.show = false;
    }
    return back;
};



