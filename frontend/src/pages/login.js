import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {api, setAccessToken, getAccessToken} from '../components/api/axiosApi.js';
const Login = () =>{
    const navigate = useNavigate();
    async function clickLogin(){
        const result = await api.post("/login", {email, psw});
        setAccessToken(result.data.accessToken)
        if(getAccessToken()){
            // 홈으로 이동
            navigate("/")
        }
        
    }
    const [email, setEmail] = useState("");
    const [psw, setPsw] = useState("");

    return (
        <div>
            <div className='login_input'>
            <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <input type="password" value={psw} onChange={(e)=>setPsw(e.target.value)} />
            </div>
            <div onClick={clickLogin}>login</div>
        </div>
    )
}

export default Login;
