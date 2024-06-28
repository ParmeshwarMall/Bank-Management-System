import Button from '@mui/material/Button';
import { useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom'

export default function Transaction() {

    let [user, setUser] = useState({ username: "" })
    let name, value;

    const [transactions, setTransactions] = useState([]);
    const [style, setStyle] = useState({ display: "none" });

    const handleInputs = (e) => {
        e.preventDefault();
        name = e.target.name;
        value = e.target.value;

        setUser({ ...user, [name]: value })
    }

    const submit = async (event) => {
        event.preventDefault();
        const { username } = user;
        await axios.post("http://localhost:8000/transaction", user)
            .then(res => {
                if(res.data=="Invalid") {
                    alert("Invalid Username")
                    console.log(res.data)
                }
                else {
                    setTransactions(res.data);
                    setStyle({ display: "block" });
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
                <NavLink to="/admdashboard" ><Button variant="outlined" id="homebtn" >Go to main dashboard</Button></NavLink>
            </div>



            <div className="transhistory" style={style}>
                <h2 className='mainhead'>Transaction History</h2>
                <table border="3" style={{ width: '90%',margin:'2vh auto'}}>
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

                <Button variant="outlined" id="sub-btn" type="button" onClick={send}>Send to email</Button>
            </div>

        </div>
    )
}