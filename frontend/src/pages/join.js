import React, { useState, useEffect } from 'react';
import {api} from '../components/api/axiosApi.js';

const Join = () => {
    const [joinForm, setJoinForm] = useState({
        name:'',
        email:'',
        password:'',
        passwordCheck:''
    });

    function changeForm(e){
        const {name, value} = e.target;
        setJoinForm({
            ...joinForm,
            [name]: value
        });
    }

    async function handleJoin(){
        
        const result = await api.post("/join", joinForm); 
        console.log(result);
    }

    return (
        <div>
            <input type="text" name="name" onChange={changeForm} value={joinForm.name}/>
            <input type="email" name="email" onChange={changeForm} value={joinForm.email}/>
            <input type="password" name="password" onChange={changeForm} value={joinForm.password}/>
            <input type="password"name="passwordCheck" onChange={changeForm} value={joinForm.passwordCheck}/>
            <div onClick={handleJoin}>join</div>
        </div>
    )
}

export default Join;
