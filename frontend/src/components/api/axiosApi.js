import axios from "axios";
import { useSyncExternalStore } from "react";

let accessToken = null;
let authVersion = 0;
let refreshPromise = null;
const listeners = new Set();
const getAccessToken = () => accessToken;
const setAccessToken = (token) => {
    authVersion += 1;
    accessToken = token;
    listeners.forEach((listener) => listener());
};
const clearAccessToken = () => setAccessToken(null);
const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};
const useAccessToken = () => useSyncExternalStore(subscribe, getAccessToken, () => null);
const config = { baseURL: "http://localhost:9988/auth", withCredentials: true };
const api = axios.create(config);
// 재발급 실패가 다시 재발급을 호출하지 않도록 분리합니다.
const refreshApi = axios.create(config);

const reissueAccessToken = () => {
    if (!refreshPromise) {
        const version = authVersion;
        refreshPromise = refreshApi.post("/reissue")
            .then(({ data }) => {
                if (version !== authVersion) throw new Error("인증 상태가 변경되었습니다.");
                if (!data.accessToken) throw new Error("accessToken이 없습니다.");
                setAccessToken(data.accessToken);
                return data.accessToken;
            })
            .catch((error) => {
                if (version === authVersion && error.response?.status === 401) clearAccessToken();
                throw error;
            })
            .finally(() => { refreshPromise = null; });
    }
    return refreshPromise;
};

api.interceptors.request.use((request) => {
    if (accessToken) request.headers.Authorization = `Bearer ${accessToken}`;
    else delete request.headers.Authorization;
    request._authVersion = authVersion;
    return request;
});
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const request = error.config;
        const isAuthRequest = ["/login", "/logout", "/reissue"].includes(request?.url);
        if (!request || error.response?.status !== 401 || request._retry || isAuthRequest) {
            return Promise.reject(error);
        }
        request._retry = true;
        if (request._authVersion !== authVersion) {
            if (!accessToken) return Promise.reject(error);
            return api(request);
        }
        await reissueAccessToken();
        return api(request);
    }
);
export { api, getAccessToken, setAccessToken, clearAccessToken, useAccessToken, reissueAccessToken };
