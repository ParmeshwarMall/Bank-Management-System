import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom'

export default function UserDetail() {

    let [user, setUser] = useState({ username: "" })
    let name, value;

    let [details, setDetails] = useState([]);
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
        await axios.post("http://localhost:8000/userdetail", user)
            .then(res => {
                if (res.data === "Invalid") {
                    alert("Invalid Username")
                }
                else {
                    setDetails(res.data);
                    setStyle({ visibility: "visible" });
                }
            })
            .catch(err => console.log(err))

        setUser(
            { username: "" }
        )
    }



    function ObjectDisplay({ obj }) {

        const imageData = obj.signature;

        // Convert the image data to a data URL
        const imageUrl = 'data:image/jpeg;base64,' + imageData;

        return (
            <div className='info'>
                <h1>Your Details!</h1>
                <br />
                <ul>
                    <li>
                        <strong>Name: </strong> {obj.name}
                    </li>
                    <li>
                        <strong>Father Name: </strong> {obj.fname}
                    </li>
                    <li>
                        <strong>DOB: </strong> {obj.dob}
                    </li>
                    <li>
                        <strong>Email ID: </strong> {obj.email}
                    </li>
                    <li>
                        <strong>Contact No.: </strong> {obj.contact}
                    </li>
                    <li>
                        <strong>Aadhaar No.: </strong> {obj.aadhaar}
                    </li>
                    <li>
                        <strong>PAN No.: </strong> {obj.pan}
                    </li>
                    <li>
                        <strong>Username.: </strong> {obj.username}
                    </li>
                    <li>
                        <strong>Account Type: </strong> {obj.acctype}
                    </li>
                    <li>
                        <strong>Balance: </strong> {obj.amount}
                    </li>
                    <li>
                        <strong>Signature: </strong><img src="" alt="signature" />
                    </li>
                    <li>
                        <strong>Address: </strong> {obj.add}
                    </li>
                </ul>
            </div>
        );

    }

    return (
        <div>
            <div className='container8'>
                <h1 className='mainhead'>Welcome to Detail Page</h1>
                <form onSubmit={submit}>
                    <div className="balinfo">
                        <label for="exampleFormControlInput1" class="form-label">Enter Username:  </label>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <input type="name" name="username" class="form-control form2" id="exampleFormControlInput1" value={user.username} onChange={handleInputs} autoComplete="off" required />
                    </div>

                    <Button type="submit" variant="outlined" id="balbtn">Submit</Button>
                    <br />
                    <hr />
                </form>

                <Button variant="outlined" id="homebtn" href="/" style={{ marginLeft: '0rem' }}>Logout</Button>
                <br />
                <NavLink to="/userdashboard" ><Button variant="outlined" id="homebtn" >Go to main dashboard</Button></NavLink>
            </div>

            <div className="detail" style={style}>

                <ObjectDisplay obj={details} />
            </div>
        </div>
    )
}