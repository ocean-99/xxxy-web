import request from '/@/utils/request';
import router from '/@/router';
import {ElMessage, ElLoading} from "element-plus";

// import { ArrowDown } from '@element-plus/icons-vue';
// import {NextLoading} from "/@/utils/loading";

interface IviewInit {
    route: any;
    state: any;
}

export const viewInit = async (data:IviewInit) => {
    data.state.params = <any>data.route;
    let id = data.state.params.query?.id;
    if (id) {
        data.state.form = await request({
            url: data.state.url + '/one/' + id,
            method: 'get',
        });
    } else {
        data.state.form = {avtag: true};
    }
};

interface IviewToEdit {
    proxy: any;
    route: any;
    state: any;
}

export const viewToEdit = async (data: IviewToEdit) => {
    tabClose({proxy: data.proxy, route: data.route});
    await router.push({
        path: data.state.url + '/edit',
        query: {id: data.state.form.id},
    });
};


interface IviewTabClose {
    proxy: any;
    route: any;
}

export const tabClose = (data: IviewTabClose) => {
    data.proxy.mittBus.emit('onCurrentContextmenuClick', Object.assign({}, {contextMenuClickId: 1, ...data.route}));
};


export const pageClose = () => {
    window.close();
};


interface IviewPageSave {
    state: any;
    formRef: any;
}

export const pageSave = async (data: IviewPageSave) => {
    let isSuccess = true;
    const loading = ElLoading.service({
        lock: true,
        fullscreen: true,
        spinner: 'el-icon-loading',
        text: '',
        background: 'rgba(0, 0, 0, 0.1)',
    });

    const canSubmit = await checkSubmit(data.formRef);
    if (!canSubmit) {
        loading.close();
        return false;
    }

    await request({
        url: data.state.url,
        method: 'put',
        data: data.state.form,
    }).catch(() => {
        isSuccess = false;
    });

    if (isSuccess) {
        ElMessage({
            showClose: true,
            message: '保存成功，1秒后页面按自动关闭',
            type: 'success',
            duration: 1000
        })
        setTimeout(() => {
            window.close();
        }, 1000);
    } else {
        loading.close();
    }
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

