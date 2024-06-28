import * as React from 'react';
import axios from 'axios';
import '../public/CSS/DetaiForm.css'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function UpdateDetails() {

    let [user, setUser] = useState({
        ousername: "", nusername: "", password: "", email: "", contact: "", add: ""
    })
    let name, value;
    const handleInputs = (e) => {
        name = e.target.name;
        value = e.target.value;

        setUser({ ...user, [name]: value })
    }

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();


        const { ousername,nusername,password,email,contact,add } = user;
        await axios.post("http://localhost:8000/updtdetail", user)
            .then(res => {
                if (res.data == "Invalid") {
                    alert("User not found");
                }
                else {
                    alert(res.data);
                    navigate('/admdashboard');
                    setUser(
                        { ousername: "", nusername: "", password: "", email: "", contact: "", add: "" }
                    )
                }
            })
            .catch(err => console.log(err))
    };

    const [passwordVisible, setPasswordVisible] = useState(false);

    const handlePasswordVisibilityToggle = () => {
        setPasswordVisible(!passwordVisible);
    };



    return (
        <div className="container6">
            <div className="form">
                <div className="heading">
                    <h2>Fill Form For Update Details</h2>
                </div>
                <br />
                <form onSubmit={handleSubmit} className="formInfo">
                    <div className="mb-3">
                        <label for="exampleFormControlInput5" class="form-label">Old UserName: </label>
                        <input type="text" name="ousername" placeholder="Enter Username" class="form-control form1" id="exampleFormControlInput5" autoComplete="off" value={user.ousername} onChange={handleInputs} required />
                    </div>
                    <div className="mb-3">
                        <label for="exampleFormControlInput5" class="form-label">New UserName: </label>
                        <input type="text" name="nusername" placeholder="Enter Username" class="form-control form1" id="exampleFormControlInput5" autoComplete="off" value={user.nusername} onChange={handleInputs} required />
                    </div>
                    <div className="mb-3">
                        <label for="exampleFormControlInput4" class="form-label">Email: </label>
                        <input type="email" name="email" placeholder="Enter Email" class="form-control form1" id="exampleFormControlInput4" autoComplete="off" value={user.email} onChange={handleInputs} required />
                    </div>
                    <div className="mb-3">
                        <label for="exampleFormControlInput4" class="form-label">Contact No. </label>
                        <input type="number" name="contact" placeholder="Enter Contact no." class="form-control form1" id="exampleFormControlInput4" autoComplete="off" value={user.contact} onChange={handleInputs} required />
                    </div>

                    <div className="mb-3">
                        <label for="exampleFormControlInput7" class="form-label">Address:  </label>
                        <input type="text" name="add" placeholder="Enter Address" class="form-control form1" id="exampleFormControlInput7" autoComplete="off" value={user.add} onChange={handleInputs} required />
                    </div>

                    <button type="submit" class="btn btn-primary subBtn">Submit</button>
                </form>
            </div>
        </div>
    )
}