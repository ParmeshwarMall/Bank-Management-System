import Button from '@mui/material/Button';
import { useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom'

export default function UserTransaction() {

    let [user, setUser] = useState({ username: "" })
    let name, value;

    const [transactions, setTransactions] = useState([]);
    const [style, setStyle] = useState({ visibility: "hidden" });


    const handleInputs = (e) => {
        e.preventDefault();
        name = e.target.name;
        value = e.target.value;

        setUser({ ...user, [name]: value })
    }

    const submit = async (event) => {
        event.preventDefault();
        const { username } = user;
        await axios.post("http://localhost:8000/usertransaction", user)
            .then(res => {
                if (res.data === "Invalid") {
                    alert("Invalid Username")
                }
                else {
                    setTransactions(res.data);
                    setStyle({ visibility: "visible" });
                }
            })
            .catch(err => console.log(err))

    }

    const send=async (e)=>{
        e.preventDefault();
        await axios.post("http://localhost:8000/email",user)
        .then(res=>{
            alert(res.data)
        })
        .catch(err=>console.log(err))

        setUser(
            { username: "" }
        )
    }


    return (
        <div>
            <div className="container8">
                <h1 className='mainhead'>Welcome to transaction history page</h1>
                <form onSubmit={submit}>
                    <div className="balinfo">
                        <label for="exampleFormControlInput1" class="form-label">Enter Username:  </label>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <input type="name" name="username" class="form-control form2" id="exampleFormControlInput1" value={user.username} onChange={handleInputs} autoComplete="off" required />
                    </div>

                    <Button type="submit" variant="outlined" id="balbtn">Submit</Button>
                    <br /><br /><br />
                    <hr />
                </form>

                <Button variant="outlined" id="homebtn" href="/" >Logout</Button>
                <br />
                <NavLink to="/userdashboard" ><Button variant="outlined" id="homebtn" >Go to main dashboard</Button></NavLink>
            </div>



            <div className="transhistory" style={style}>
                <h2>Transaction History</h2>
                <table border="3" style={{ width: '70%' ,marginTop:"20px"}}>
                    <thead>
                        <tr>
                            <th>Amount</th>
                            <th>Mode</th>
                            <th>Date</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction, index) => (
                            <tr key={index}>
                                <td>{transaction.amount}</td>
                                <td>{transaction.mode}</td>
                                <td>{transaction.transdate}</td>
                                <td>{transaction.transtime}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <br />
                <Button variant="outlined" id="homebtn" type="button" onClick={send}>Send to email</Button>
            </div>
        </div>
    )
}