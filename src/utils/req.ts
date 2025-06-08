import request from "/@/utils/request";
import {ElLoading, ElMessage} from 'element-plus';

export const post = async (data: any, xdata?: any) => {
    if (!xdata) {
        xdata = {};
    }
    data.method = 'post';
    if (xdata.loading) {
        const loading = ElLoading.service({
            lock: true,
            fullscreen: true,
            text: xdata.tip,
            background: 'rgba(0, 0, 0, 0.1)',
        });

        const res = await request(data).finally(() => {
            loading.close();
        });
        if (xdata.finish) {
            if (res.code == 200) {
                ElMessage.success(xdata.finish);
            }
        }
        return res.data;
    } else {
        const res = await request(data);
        return res.data;
    }
}

export const get = async (data: any, xdata?: any) => {
    if (!xdata) {
        xdata = {};
    }
    data.method = 'get';
    if (xdata.loading) {
        const loading = ElLoading.service({
            lock: true,
            fullscreen: true,
            text: xdata.tip,
            background: 'rgba(0, 0, 0, 0.1)',
        });

        const res = await request(data).finally(() => {
            loading.close();
        });
        if (xdata.finish) {
            console.log(res)
            if (res.code == 200) {
                ElMessage.success(xdata.finish);
            }
        }
        return res.data;
    } else {
        const res = await request(data);
        return res.data;
    }
}

const dele = async (data: any, xdata?: any) => {
    if (!xdata) {
        xdata = {};
    }
    data.method = 'delete';
    if (xdata.loading) {
        const loading = ElLoading.service({
            lock: true,
            fullscreen: true,
            text: xdata.tip,
            background: 'rgba(0, 0, 0, 0.1)',
        });

        const res = await request(data).finally(() => {
            loading.close();
        });
        if (xdata.finish) {
            if (res.code == 200) {
                ElMessage.success(xdata.finish);
            }
        }
        return res.data;
    } else {
        const res = await request(data);
        return res.data;
    }
}

const put = async (data: any, xdata?: any) => {
    if (!xdata) {
        xdata = {};
    }
    data.method = 'put';
    if (xdata.loading) {
        const loading = ElLoading.service({
            lock: true,
            fullscreen: true,
            text: xdata.tip,
            background: 'rgba(0, 0, 0, 0.1)',
        });

        const res = await request(data).finally(() => {
            loading.close();
        });
        if (xdata.finish) {
            if (res.code == 200) {
                ElMessage.success(xdata.finish);
            }
        }
        return res.data;
    } else {
        const res = await request(data);
        return res.data;
    }
}




const req = {
    get: get,
    post: post,
    put: put,
    dele: dele,
}

export default req;

