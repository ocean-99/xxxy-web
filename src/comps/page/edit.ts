import request from '/@/utils/request';
import {ElLoading, ElMessage} from "element-plus";

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

export const tabSave = async (formRef: any, state: any, proxy: any, route: any) => {
    const canSubmit = await checkSubmit(formRef);
    if (!canSubmit) {
        return false;
    }

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
    proxy.mittBus.emit('onCurrentContextmenuClick', Object.assign({}, {contextMenuClickId: 1, ...route}));
};

export const pageSave = async (formRef: any, state: any) => {
    const loading = ElLoading.service({
        lock: true,
        fullscreen: true,
        text:'',
        background: 'rgba(0, 0, 0, 0.1)',
    });
    const canSubmit = await checkSubmit(formRef);
    if (!canSubmit) {
        loading.close();
        return false;
    }

    let isSuccess=true;
    if (!state.form.crtim) {
        await request({
            url: state.url,
            method: 'post',
            data: state.form,
        }).catch(() => {
            isSuccess=false;
        });
    } else {
        await request({
            url: state.url,
            method: 'put',
            data: state.form,
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

export const drawerSave = async (formRef: any, state: any) => {
    const canSubmit = await checkSubmit(formRef);
    if (!canSubmit) {
        return false;
    }

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
        state.form = {avtag: true};
    }
    state.show = true;
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



