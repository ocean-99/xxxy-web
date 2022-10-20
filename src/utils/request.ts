import axios from 'axios';
import {ElMessage, ElMessageBox} from 'element-plus';
import {Session} from '/@/utils/storage';
import {saveAs} from 'file-saver';

// 配置新建一个 axios 实例
const service = axios.create({
    baseURL: import.meta.env.VITE_API_URL as any,
    timeout: 50000,
    headers: {'Content-Type': 'application/json'},
});

// 添加请求拦截器
service.interceptors.request.use(
    (config) => {
        // 在发送请求之前做些什么 token
        if (Session.get('token')) {
            (<any>config.headers).common['Authorization'] = `${Session.get('token')}`;
        }
        return config;
    },
    (error) => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 添加响应拦截器
service.interceptors.response.use(
    (response) => {
        // 对响应数据做点什么
        const res = response.data;
        if (res.code && res.code !== 200) {
            // `token` 过期或者账号已在别处登录
            if (res.code === 401 || res.code === 4001) {
                Session.clear(); // 清除浏览器全部临时缓存
                // const vppath = import.meta.env.VITE_PUBLIC_PATH;
                ElMessageBox.alert('你已被登出，请重新登录', '提示', {})
                    .then(() => {
                        window.location.href = import.meta.env.VITE_PUBLIC_PATH; // 去登录页
                    })
                    .catch(() => {
                        window.location.href = import.meta.env.VITE_PUBLIC_PATH; // 去登录页
                    });
            } else if (res.code === 402) {
                ElMessage.error('账号密码错误');
            } else if (res.code === 500) {
                ElMessage.error('服务器内部错误:' + res.msg);
            } else if (res.code === 222) {
                return response.data;
            } else if (res.code === 202) { //202一个不在用了，待删除
                ElMessage({
                    type: "warning",
                    message: res.msg,
                    offset:300,
                    center: true,
                    dangerouslyUseHTMLString: true,
                })
            } else {
                ElMessage.error('未知错误' + res.code + ':' + res.msg);
            }
            return Promise.reject(service.interceptors.response);
        } else {
            // console.log(response);
            if (response.data.size) {
                let blob = new Blob([res], {type: "application/xlsx"});
                let filename = decodeURI(response.headers['download-filename']);
                // let filename=decodeURI(response.headers['FileDownloadName']);
                saveAs(blob, filename)
                // let url = window.URL.createObjectURL(blob);
                // const link = document.createElement("a"); // 创建a标签
                // link.href = url;
                // link.download = decodeURI(response.headers['download-filename']); // 重命名文件
                // link.click();
                // URL.revokeObjectURL(url);
            } else {
                return response.data.data;
            }
        }
    },
    (error) => {
        // 对响应错误做点什么
        if (error.message.indexOf('timeout') != -1) {
            ElMessage.error('网络超时');
        } else if (error.message == 'Network Error') {
            ElMessage.error('网络连接错误');
        } else if (error.response.status == 401) {
            Session.clear(); // 清除浏览器全部临时缓存
            // const vppath = import.meta.env.VITE_PUBLIC_PATH;
            ElMessageBox.alert('你已被登出，请重新登录', '提示', {})
                .then(() => {
                    window.location.href = import.meta.env.VITE_PUBLIC_PATH; // 去登录页
                })
                .catch(() => {
                    window.location.href = import.meta.env.VITE_PUBLIC_PATH; // 去登录页
                });
        } else if (error.response.status == 403) {
            ElMessage.error('权限不足');
        } else if (error.response.status == 404) {
            ElMessage.error('接口地址不存在');
        }  else if (error.response.status == 500) {
            ElMessage.error('服务器内部错误');
        } else {
            if (error.response.data) ElMessage.error(error.response.statusText);
            else ElMessage.error('未知错误');
        }
        return Promise.reject(error);
    }
);

// 导出 axios 实例
export default service;
