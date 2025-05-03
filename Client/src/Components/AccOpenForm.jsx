import * as React from "react";
import axios from "axios";
import "../../public/CSS/DetaiForm.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import Button from "@mui/material/Button";

export default function AccOpenForm(props) {
  let [user, setUser] = useState({
    name: "",
    fname: "",
    dob: "",
    email: "",
    otp: "",
    contact: "",
    aadhaar: "",
    pan: "",
    username: "",
    password: "",
    image: null,
    signature: null,
    acctype: "",
    amount: "",
    add: "",
  });

  const handleInputs = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setUser((prevUser) => ({
        ...prevUser,
        [name]: files[0], // Store file object
      }));
    } else {
      setUser((prevUser) => ({
        ...prevUser,
        [name]: value,
      }));
    }
  };

  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Ensure required fields are filled
    if (!user.image || !user.signature) {
      return toast.warn("Image and Signature are required", {
        position: "top-center",
      });
    }

    const toastId = toast.loading("Submitting your details...", {
      position: "top-center",
    });

    const formData = new FormData();
    Object.keys(user).forEach((key) => {
      if (user[key]) {
        formData.append(key, user[key]);
      }
    });

    try {
      const res = await axios.post(`${props.api}/admin/form`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 201) {
        toast.dismiss(toastId);
        toast.success(res.data.message, { position: "top-center" });

        // Reset form
        setUser({
          name: "",
          fname: "",
          dob: "",
          email: "",
          contact: "",
          aadhaar: "",
          pan: "",
          username: "",
          password: "",
          acctype: "",
          amount: "",
          add: "",
          image: null,
          signature: null,
        });
      } else {
        toast.dismiss(toastId);
        toast.warn(res.data.message, { position: "top-center" });
      }
    } catch (err) {
      toast.dismiss(toastId);

      if (err.response && err.response.data.message) {
        toast.error(err.response.data.message, { position: "top-center" });
      } else {
        toast.error("Server Error: " + err.message, { position: "top-center" });
      }
    }
  };

  const handlePasswordVisibilityToggle = () => {
    setPasswordVisible(!passwordVisible);
  };

  const [OTP, setOTP] = useState("");
  const [isotpsend, setIsotpsend] = useState(false);
  const [isVerify, setIsVerify] = useState(false);

  const sendOtp = async () => {
    const { email } = user;
    if (!email) {
      toast.error("Enter Email Id", { position: "top-center" });
      return;
    }
    try {
      const toastId = toast.loading("Sending OTP, please wait...", {
        position: "top-center",
      });

      const response = await axios.post(`${props.api}/admin/verifyeEmail`, {
        email,
      });
      setOTP(response.data.otp);
      setIsotpsend(true);
      if (response.status === 200) {
        toast.update(toastId, {
          render: "OTP sent successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        toast.update(toastId, {
          render: response.data.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("Something went wrong!", { position: "top-center" });
    }
  };

  const verifyOTP = () => {
    if (user.otp == OTP) {
      toast.success("Email Verification Success", { position: "top-center" });
      setIsVerify(true);
    } else {
      toast.error("Invalid OTP", { position: "top-center" });
    }
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
            <label for="exampleFormControlInput1" class="form-label">
              Name:{" "}
            </label>
            <input
              type="name"
              name="name"
              placeholder="Enter name"
              class="form-control form1"
              id="exampleFormControlInput1"
              autoComplete="off"
              value={user.name}
              onChange={handleInputs}
              required
            />
          </div>
          <div className="mb-3">
            <label for="exampleFormControlInput2" class="form-label">
              Father name:{" "}
            </label>
            <input
              type="name"
              name="fname"
              placeholder="Enter Father name"
              class="form-control form1"
              id="exampleFormControlInput2"
              autoComplete="off"
              value={user.fname}
              onChange={handleInputs}
              required
            />
          </div>
          <div className="mb-3">
            <label for="exampleFormControlInput3" class="form-label">
              DOB:{" "}
            </label>
            <input
              type="date"
              name="dob"
              placeholder="Enter DOB"
              class="form-control form1"
              id="exampleFormControlInput3"
              autoComplete="off"
              value={user.dob}
              onChange={handleInputs}
              required
            />
          </div>
          <div className="mb-3">
            <label for="exampleFormControlInput4" class="form-label">
              Email:{" "}
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              class="form-control form1"
              id="exampleFormControlInput4"
              autoComplete="off"
              value={user.email}
              onChange={handleInputs}
              disabled={isotpsend}
              required
            />
          </div>
          {!isVerify && (
            <div className="otp-container">
              {isotpsend && (
                <input
                  className="otp-input"
                  type="text"
                  name="otp"
                  value={user.otp}
                  onChange={handleInputs}
                  placeholder="Enter OTP"
                />
              )}
              <Button
                variant="contained"
                className="otp-button"
                onClick={isotpsend ? verifyOTP : sendOtp}
              >
                {isotpsend ? "Verify OTP" : "Verify Email ID"}
              </Button>
            </div>
          )}
          <div className="mb-3">
            <label for="exampleFormControlInput5" class="form-label">
              Contact No.{" "}
            </label>
            <input
              type="tel"
              name="contact"
              placeholder="Enter Contact no."
              class="form-control form1"
              id="exampleFormControlInput5"
              pattern="\d{10}"
              maxlength="10"
              autoComplete="off"
              value={user.contact}
              onChange={handleInputs}
              required
            />
          </div>
          <div className="mb-3">
            <label for="exampleFormControlInput6" class="form-label">
              Aadhaar No.{" "}
            </label>
            <input
              type="text"
              name="aadhaar"
              placeholder="Enter Aadhaar no."
              class="form-control form1"
              id="exampleFormControlInput6"
              maxlength="16"
              autoComplete="off"
              value={user.aadhaar}
              onChange={handleInputs}
              required
            />
          </div>
          <div className="mb-3">
            <label for="exampleFormControlInput7" class="form-label">
              PAN No.{" "}
            </label>
            <input
              type="text"
              name="pan"
              placeholder="Enter PAN no."
              class="form-control form1"
              id="exampleFormControlInput7"
              autoComplete="off"
              value={user.pan}
              onChange={handleInputs}
            />
          </div>
          <div className="checkBox">
            <h6 className="form-label">Gender: </h6>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
                checked
              />
              <label class="form-check-label">Male</label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
              />
              <label class="form-check-label">Female</label>
            </div>
          </div>
          <div className="mb-3">
            <label for="exampleFormControlInput8" class="form-label">
              UserName:{" "}
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter Username"
              class="form-control form1"
              id="exampleFormControlInput8"
              autoComplete="off"
              value={user.username}
              onChange={handleInputs}
              required
            />
          </div>
          <div className="mb-3">
            <label for="exampleFormControlInput9" class="form-label">
              Password:{" "}
            </label>
            <div className="pass">
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                placeholder="Enter Password"
                class="form-control form1"
                id="exampleFormControlInput9"
                autoComplete="off"
                value={user.password}
                onChange={handleInputs}
                required
              />
              <button
                type="button"
                onClick={handlePasswordVisibilityToggle}
                className="eye-icon3 cursor-pointer"
              >
                {passwordVisible ? <Eye /> : <EyeOff />}
              </button>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="exampleFormControlInput10" className="form-label">
              Upload Photo
            </label>
            <input
              className="form-control form1"
              type="file"
              id="exampleFormControlInput10"
              name="image"
              accept="image/*"
              onChange={handleInputs}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="exampleFormControlInput11" className="form-label">
              Upload Signature
            </label>
            <input
              className="form-control form1"
              type="file"
              id="exampleFormControlInput11"
              name="signature"
              accept="image/*"
              onChange={handleInputs}
              required
            />
          </div>

          <div className="mb-3">
            <label for="exampleFormControlInput12" class="form-label">
              Type of Account{" "}
            </label>
            <select
              class="form-select form1"
              aria-label="Default select example"
              id="exampleFormControlInput12"
              name="acctype"
              value={user.acctype}
              onChange={handleInputs}
              required
            >
              <option selected style={{ fontWeight: "bolder" }}>
                Select one
              </option>
              <option value="Saving account">Saving account</option>
              <option value="Salary account">Salary account</option>
              <option value="Fixes deposite account">
                Fixed deposit account{" "}
              </option>
              <option value="Recurring deposite account">
                Recurring deposit account{" "}
              </option>
              <option value="NRI account">NRI account </option>
            </select>
          </div>

          <div className="mb-3">
            <label for="exampleFormControlInput13" class="form-label">
              Enter amount:{" "}
            </label>
            <input
              type="number"
              name="amount"
              placeholder="Enter Deposite Amount"
              class="form-control form1"
              id="exampleFormControlInput13"
              autoComplete="off"
              value={user.amount}
              onChange={handleInputs}
              required
            />
          </div>
          <div className="mb-3">
            <label for="exampleFormControlInput14" class="form-label">
              Address:{" "}
            </label>
            <input
              type="text"
              name="add"
              placeholder="Enter Address"
              class="form-control form1"
              id="exampleFormControlInput14"
              autoComplete="off"
              value={user.add}
              onChange={handleInputs}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary subBtn"
            disabled={!isVerify}
          >
            Submit
          </button>
          {!isVerify && <p>Verify email to enable submit button</p>}
        </form>
      </div>
    </div>
  );
}
