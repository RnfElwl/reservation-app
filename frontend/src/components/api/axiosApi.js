import axios from "axios";
let accessToken = null;

const getAccessToken = () =>accessToken;

const setAccessToken = (token) =>{
    accessToken = token;
}

const clearAccessToken = () =>{
    accessToken = null;
}

const api = axios.create({
    baseURL: "http://localhost:9988",
    withCredentials:true
});

api.interceptors.request.use((config)=>{
    const accessToken = getAccessToken();

    if(accessToken){
    config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;  
    },
    (error)=>{
        return Promise.reject(error);
    }
)

api.interceptors.response.use(
    (response)=> response,

    async(error)=>{
        const originalRequest = error.config;

        if(
            error.response?.status === 401 &&
            !originalRequest._retry&&
            !originalRequest.url.includes("/reissue")
        ){
            originalRequest._retry = true;

            try{
                const response = await api.post("/reissue");
                const newAccessToken = response.data.accessToken;
                setAccessToken(newAccessToken);

                originalRequest.headers.Authorization = 
                `Bearer ${newAccessToken}`;

                return api(originalRequest);
            }catch(refreshError){
                clearAccessToken();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
    
)

export {api, setAccessToken, getAccessToken, clearAccessToken};