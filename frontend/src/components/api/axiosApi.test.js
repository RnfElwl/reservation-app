import axios from 'axios';
import { api, clearAccessToken, getAccessToken, reissueAccessToken, setAccessToken } from './axiosApi';

const mockAdapter = jest.fn();
jest.mock('axios', () => {
    const actual = jest.requireActual('axios');
    return {
        ...actual,
        create: (config) => actual.create({ ...config, adapter: (...args) => mockAdapter(...args) }),
    };
});

const success = (config, data = {}) => ({ config, data, status: 200, headers: {}, statusText: 'OK' });
const unauthorized = (config) => Promise.reject(
    new axios.AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config, null,
        { config, status: 401, data: {}, headers: {} })
);

beforeEach(() => {
    clearAccessToken();
    mockAdapter.mockReset();
});

test('restores a memory token from a cookie request and shares concurrent refreshes', async () => {
    mockAdapter.mockImplementation(async (config) => {
        expect(config.withCredentials).toBe(true);
        expect(config.headers.Authorization).toBeUndefined();
        return success(config, { accessToken: 'restored' });
    });
    await Promise.all([reissueAccessToken(), reissueAccessToken()]);
    expect(mockAdapter).toHaveBeenCalledTimes(1);
    expect(getAccessToken()).toBe('restored');
});

test('retries concurrent protected requests with one refreshed token', async () => {
    setAccessToken('expired');
    mockAdapter.mockImplementation(async (config) => {
        if (config.url === '/reissue') return success(config, { accessToken: 'new' });
        if (config.headers.Authorization === 'Bearer expired') return unauthorized(config);
        expect(config.headers.Authorization).toBe('Bearer new');
        return success(config);
    });
    await Promise.all([api.get('/protected'), api.get('/protected')]);
    expect(mockAdapter.mock.calls.filter(([config]) => config.url === '/reissue')).toHaveLength(1);
});

test('rejects failed refresh without recursively refreshing', async () => {
    setAccessToken('expired');
    mockAdapter.mockImplementation(unauthorized);
    await expect(api.get('/protected')).rejects.toMatchObject({ response: { status: 401 } });
    expect(mockAdapter).toHaveBeenCalledTimes(2);
    expect(getAccessToken()).toBeNull();
});

test('does not restore a token from a refresh completed after logout', async () => {
    let complete;
    mockAdapter.mockImplementation((config) => new Promise((resolve) => {
        complete = () => resolve(success(config, { accessToken: 'late' }));
    }));
    const pending = reissueAccessToken();
    clearAccessToken();
    complete();
    await expect(pending).rejects.toThrow('인증 상태가 변경되었습니다.');
    expect(getAccessToken()).toBeNull();
});

test('does not refresh login failures or network failures', async () => {
    mockAdapter.mockImplementation(unauthorized);
    await expect(api.post('/login')).rejects.toBeDefined();
    expect(mockAdapter).toHaveBeenCalledTimes(1);
    mockAdapter.mockRejectedValue(new Error('Network Error'));
    await expect(api.get('/protected')).rejects.toThrow('Network Error');
    expect(mockAdapter).toHaveBeenCalledTimes(2);
});
