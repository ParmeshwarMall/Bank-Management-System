import Button from '@mui/material/Button';
import { useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';


export default function Deposite() {

    let [user,setUser]=useState({amount:"",username:""})
    let name, value;

    const handleInputs = (e) => {
        e.preventDefault();
        name = e.target.name;
        value = e.target.value;

        setUser({ ...user, [name]: value })
    }

    const submit=async (e)=>{
        e.preventDefault();
        const {amount,username}=user;
        await axios.post("http://localhost:8000/deposite",user)
        .then(res=>{
            if(res.data==="Invalid")
            {
                alert("Invalid Username")
            }
            else
            {
                alert("Deposite Successfully")
                alert("Your current amount is: "+res.data)
            }
        })
        .catch(err=>console.log(err))

        setUser(
            {amount:"",username:""}
        )
    }

    return (
        <div className="container8">
            <h1 className='mainhead'>Welcome to Deposite Page</h1>
            <form onSubmit={submit}>
                <div className="balinfo">
                    <label for="exampleFormControlInput1" class="form-label">Enter Amount:  </label>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="number" name="amount" class="form-control form2" id="exampleFormControlInput1" value={user.amount} onChange={handleInputs} autoComplete="off" required/>
                </div>
                <div className="balinfo">
                    <label for="exampleFormControlInput1" class="form-label">Enter Username:  </label>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="name" name="username" class="form-control form2" id="exampleFormControlInput1" value={user.username} onChange={handleInputs} autoComplete="off" required/>
                </div>

                <Button type="submit" variant="outlined" id="balbtn" >Submit</Button>
                <br /><br /><hr />
            </form>
            <Button variant="outlined" id="homebtn" href="/" >Logout</Button>
            <br />
            <NavLink to="/admdashboard" ><Button variant="outlined" id="homebtn" >Go to main dashboard</Button></NavLink>
        </div>
    )
}