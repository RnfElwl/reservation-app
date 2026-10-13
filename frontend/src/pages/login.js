import React, { useState, useEffect } from 'react';
import {api, setAccessToken} from '../components/api/axiosApi.js';
const Login = () =>{
    async function clickLogin(){
        const result = await api.post("/login", {email, psw});
        setAccessToken(result.data.accessToken)
        console.log(result);
    }
    const [email, setEmail] = useState("");
    const [psw, setPsw] = useState("");

    return (
        <div>
            <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <input type="password" value={psw} onChange={(e)=>setPsw(e.target.value)} />
            <div onClick={clickLogin}>login</div>
        </div>
    )
}

export default Login;
