/**
 * window.localStorage 浏览器永久缓存
 * @method set 设置永久缓存
 * @method get 获取永久缓存
 * @method remove 移除永久缓存
 * @method clear 移除全部永久缓存
 */
export const Local = {
	// 设置永久缓存
	set(key: string, val: any) {
		window.localStorage.setItem(key, JSON.stringify(val));
	},
	// 获取永久缓存
	get(key: string) {
		let json: any = window.localStorage.getItem(key);
		return JSON.parse(json);
	},
	// 移除永久缓存
	remove(key: string) {
		window.localStorage.removeItem(key);
	},
	// 移除全部永久缓存
	clear() {
		window.localStorage.clear();
	},
};

/**
 * window.sessionStorage 浏览器临时缓存
 * @method set 设置临时缓存
 * @method get 获取临时缓存
 * @method remove 移除临时缓存
 * @method clear 移除全部临时缓存
 */
export const Session = {
	// 设置临时缓存
	set(key: string, val: any) {
		window.sessionStorage.setItem(key, JSON.stringify(val));
	},
	// 获取临时缓存
	get(key: string) {
		let json: any = window.sessionStorage.getItem(key);
		return JSON.parse(json);
	},
	// 移除临时缓存
	remove(key: string) {
		window.sessionStorage.removeItem(key);
	},
	// 移除全部临时缓存
	clear() {
		window.sessionStorage.clear();
	},
};

export const Cookie = {
	// 设置临时缓存
	set(key: string, val: any) {
		const dateTime = new Date();
		dateTime.setTime( dateTime.getTime() + 0.5*24*3600*1000);
		document.cookie = key + "="+ val + "; expires=" + dateTime.toGMTString();
	},
	// 获取临时缓存
	get(key: string) {
		const cookies = document.cookie;
		const cookieArr = cookies.split("; ");
		for( let i = 0; i < cookieArr.length; i++ ){
			const cookie = cookieArr[i].split("=");
			if( cookie[0] == key ){
				return cookie[1];
			}
		}
	},
	// 移除临时缓存
	remove() {

	},
	// 移除全部临时缓存
	clear() {

	},
};

