import request from '/@/utils/request';
import {ElLoading, ElMessage} from "element-plus";

interface IeditInit {
    state: any;
    route:any;
}
export const editInit = async (data:IeditInit) => {
    data.state.params = <any>data.route;
    let id = data.state.params.query?.id;
    if (id) {
        data.state.form = await request({
            url: data.state.url + '/one/' + id,
            method: 'get',
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
        await request({
            url: data.state.url,
            method: 'post',
            data: data.state.form,
        });
    } else {
        await request({
            url: data.state.url,
            method: 'put',
            data: data.state.form,
        });
    }
    tabClose({proxy:data.proxy, route:data.route});
};

interface ItabClose {
    proxy:any;
    route:any;
}
export const tabClose = (data:ItabClose) => {
    data.proxy.mittBus.emit('onCurrentContextmenuClick', Object.assign({}, {contextMenuClickId: 1, ...data.route}));
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
        await request({
            url: data.state.url,
            method: 'post',
            data: data.state.form,
        }).catch(() => {
            isSuccess=false;
        });
    } else {
        await request({
            url: data.state.url,
            method: 'put',
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
        await request({
            url: data.state.url,
            method: 'post',
            data: data.state.form,
        });
    } else {
        await request({
            url: data.state.url,
            method: 'put',
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
        data.state.form = await request({
            url: data.state.url + '/one/' + data.id,
            method: 'get',
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



