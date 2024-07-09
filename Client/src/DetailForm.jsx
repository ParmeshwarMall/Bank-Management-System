import * as React from 'react';
import axios from 'axios';
import '../public/CSS/DetaiForm.css'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {Eye,EyeOff} from 'lucide-react'
import { toast } from 'react-toastify';

export default function DetailForm() {

    let [user, setUser] = useState({
        name: "", fname: "", dob: "", email: "", contact: "", aadhaar: "", pan: "", username: "", password: "", acctype: "", amount: "", add: ""
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
        const toastId = toast.loading("Waiting for confirmation...", {
            position: "top-center",
          });

        const { name, fname, dob, email, contact, aadhaar, pan, username, password, acctype, amount, add } = user;
        await axios.post("http://localhost:8000/form", user)
            .then(res => {
                if (res.data == "exist") {
                    toast.dismiss(toastId);
                    toast.warn("This username alerady exist. Please use another username", {
                        position: "top-center",
                        });
                }
                else {
                    toast.dismiss(toastId);
                    toast.success(res.data, {
                        position: "top-center",
                        });
                    navigate('/admdashboard');
                    setUser(
                        { name: "", fname: "", dob: "", email: "", contact: "", aadhaar: "", pan: "", username: "", password: "", acctype: "", amount: "", add: "" }
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
                    <h2>Fill Form For Account Opening</h2>
                </div>
                <br />
                <form onSubmit={handleSubmit} className="formInfo">
                    <div className="mb-3">
                        <label for="exampleFormControlInput1" class="form-label">Name: </label>
                        <input type="name" name="name" placeholder="Enter name" class="form-control form1" id="exampleFormControlInput1" autoComplete="off" value={user.name} onChange={handleInputs} required />
                    </div>
                    <div className="mb-3">
                        <label for="exampleFormControlInput2" class="form-label">Father name: </label>
                        <input type="name" name="fname" placeholder="Enter Father name" class="form-control form1" id="exampleFormControlInput2" autoComplete="off" value={user.fname} onChange={handleInputs} required />
                    </div>
                    <div className="mb-3">
                        <label for="exampleFormControlInput3" class="form-label">DOB: </label>
                        <input type="date" name="dob" placeholder="Enter DOB" class="form-control form1" id="exampleFormControlInput3" autoComplete="off" value={user.dob} onChange={handleInputs} required />
                    </div>
                    <div className="mb-3">
                        <label for="exampleFormControlInput4" class="form-label">Email: </label>
                        <input type="email" name="email" placeholder="Enter Email" class="form-control form1" id="exampleFormControlInput4" autoComplete="off" value={user.email} onChange={handleInputs} required />
                    </div>
                    <div className="mb-3">
                        <label for="exampleFormControlInput5" class="form-label">Contact No. </label>
                        <input type="tel" name="contact" placeholder="Enter Contact no." class="form-control form1" id="exampleFormControlInput5"  pattern="\d{10}" maxlength="10" autoComplete="off" value={user.contact} onChange={handleInputs} required />
                    </div>
                    <div className="mb-3">
                        <label for="exampleFormControlInput6" class="form-label">Aadhaar No. </label>
                        <input type="text" name="aadhaar" placeholder="Enter Aadhaar no." class="form-control form1" id="exampleFormControlInput6" maxlength="16" autoComplete="off" value={user.aadhaar} onChange={handleInputs} required />
                    </div>
                    <div className="mb-3">
                        <label for="exampleFormControlInput7" class="form-label">PAN No. </label>
                        <input type="text" name="pan" placeholder="Enter PAN no." class="form-control form1" id="exampleFormControlInput7" autoComplete="off" value={user.pan} onChange={handleInputs} />
                    </div>
                    <div className="checkBox">
                        <h6 className='form-label'>Gender: </h6>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" checked />
                            <label class="form-check-label">
                                Male
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                            <label class="form-check-label">
                                Female
                            </label>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label for="exampleFormControlInput8" class="form-label">UserName: </label>
                        <input type="text" name="username" placeholder="Enter Username" class="form-control form1" id="exampleFormControlInput8" autoComplete="off" value={user.username} onChange={handleInputs} required />
                    </div>
                    <div className="mb-3">
                        <label for="exampleFormControlInput9" class="form-label">Password:  </label>
                        <div className="pass">
                        <input type={passwordVisible ? 'text' : 'password'} name="password" placeholder="Enter Password" class="form-control form1" id="exampleFormControlInput9" autoComplete="off" value={user.password} onChange={handleInputs} required />
                        <button type="button" onClick={handlePasswordVisibilityToggle} className="eye-icon3 cursor-pointer">
                        {passwordVisible ? <Eye/>:<EyeOff/>}
                    </button>
                        </div>
                    </div>

                    {/* <div class="mb-3 ">
                        <label for="formFile" class="form-label">Upload Photo</label>
                        <input class="form-control form1" type="file" id="formFile" name='image' value={user.image} onChange={handleInputs} required />
                    </div>

                    <div class="mb-3">
                        <label for="formFile" class="form-label">Upload Signature</label>
                        <input class="form-control form1" type="file" id="formFile" name='signature' value={user.image} onChange={handleInputs} required />
                    </div> */}

                    <div className="mb-3">
                        <label for="exampleFormControlInput10" class="form-label">Type of Account  </label>
                        <select class="form-select form1" aria-label="Default select example" id="exampleFormControlInput10" name="acctype" value={user.acctype} onChange={handleInputs} required>
                            <option selected style={{ fontWeight: "bolder" }}>Select one</option>
                            <option value="Saving account">Saving account</option>
                            <option value="Salary account">Salary account</option>
                            <option value="Fixes deposite account">Fixed deposit account </option>
                            <option value="Recurring deposite account">Recurring deposit account </option>
                            <option value="NRI account">NRI account </option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label for="exampleFormControlInput11" class="form-label">Enter amount:  </label>
                        <input type="number" name="amount" placeholder="Enter Deposite Amount" class="form-control form1" id="exampleFormControlInput11" autoComplete="off" value={user.amount} onChange={handleInputs} required />
                    </div>
                    <div className="mb-3">
                        <label for="exampleFormControlInput12" class="form-label">Address:  </label>
                        <input type="text" name="add" placeholder="Enter Address" class="form-control form1" id="exampleFormControlInput12" autoComplete="off" value={user.add} onChange={handleInputs} required />
                    </div>

                    <button type="submit" class="btn btn-primary subBtn">Submit</button>
                </form>
            </div>
        </div>
    )
}