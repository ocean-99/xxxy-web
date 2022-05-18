import request from '/@/utils/request';
import {ElMessage} from "element-plus";
import {type} from "os";

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
    window.close();
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



