import Button from '@mui/material/Button';
import { useState } from 'react';
import axios from 'axios';
import {NavLink} from 'react-router-dom'

export default function PasswordChange(){

    let [user,setUser]=useState({username:"",password:""})
    let name, value;

    const handleInputs = (e) => {
        e.preventDefault();
        name = e.target.name;
        value = e.target.value;

        setUser({ ...user, [name]: value })
    }

    let isChgSucc=false;
    const submit = async (event) => {
        event.preventDefault();
        const {username,password}=user;
        await axios.post("http://localhost:8000/passchg",user)
        .then(res=>{
            alert(res.data);
            if(res.data==="Invalid username")
                {
                    isChgSucc=false;
                }
                else{
                    isChgSucc=true
                }
        })
        .catch(err=>console.log(err))

        setUser(
            {username:"",password:""}
        )
    }

    return(
        <div className="container8">
            <h1 className='mainhead'>Welcome to Password Change Page</h1>
            <form onSubmit={submit}>
                <div className="balinfo">
                    <label for="exampleFormControlInput1" class="form-label">Enter Username:  </label>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="name" name="username" class="form-control form2" id="exampleFormControlInput1" value={user.username} onChange={handleInputs} autoComplete="off" required/>
                </div>
                <div className="balinfo">
                    <label for="exampleFormControlInput1" class="form-label">Enter New Password:  </label>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="password" name="password" class="form-control form2" id="exampleFormControlInput1" value={user.password} onChange={handleInputs} autoComplete="off" required/>
                </div>

                <Button type="submit" variant="outlined" id="balbtn">Submit</Button>
                <br />
            </form>

            <Button variant="outlined" id="homebtn" href="/" >Go to Home</Button>
        </div>
    )
}