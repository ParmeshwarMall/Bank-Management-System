import * as React from "react";
import axios from "axios";
import "../../public/CSS/DetaiForm.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

export default function UpdateDetails(props) {
  let [user, setUser] = useState({
    ousername: "",
    nusername: "",
    password: "",
    email: "",
    contact: "",
    add: "",
  });
  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;

    setUser({ ...user, [name]: value });
  };

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const toastId = toast.loading("Waiting for conformation...", {
      position: "top-center",
    });

    const { ousername, nusername, password, email, contact, add } = user;
    await axios
      .post(`${props.api}/user/updateDetails`, user, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data == "Invalid") {
          toast.dismiss(toastId);
          toast.info("User not found!", {
            position: "top-center",
          });
        } else {
          toast.dismiss(toastId);
          toast.info(res.data, {
            position: "top-center",
          });
          setUser({
            ousername: "",
            nusername: "",
            password: "",
            email: "",
            contact: "",
            add: "",
          });
        }
      })
      .catch((err) => {
        toast.dismiss(toastId);
        toast.error("Something went wrong", {
          position: "top-center",
        });
      });
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
            <label for="exampleFormControlInput5" class="form-label">
              Old UserName:{" "}
            </label>
            <input
              type="text"
              name="ousername"
              placeholder="Enter Username"
              class="form-control form1"
              id="exampleFormControlInput5"
              autoComplete="off"
              value={user.ousername}
              onChange={handleInputs}
              required
            />
          </div>
          <div className="mb-3">
            <label for="exampleFormControlInput5" class="form-label">
              New UserName:{" "}
            </label>
            <input
              type="text"
              name="nusername"
              placeholder="Enter Username"
              class="form-control form1"
              id="exampleFormControlInput5"
              autoComplete="off"
              value={user.nusername}
              onChange={handleInputs}
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
            />
          </div>
          <div className="mb-3">
            <label for="exampleFormControlInput4" class="form-label">
              Contact No.{" "}
            </label>
            <input
              type="number"
              name="contact"
              placeholder="Enter Contact no."
              class="form-control form1"
              id="exampleFormControlInput4"
              autoComplete="off"
              value={user.contact}
              onChange={handleInputs}
            />
          </div>

          <div className="mb-3">
            <label for="exampleFormControlInput7" class="form-label">
              Address:{" "}
            </label>
            <input
              type="text"
              name="add"
              placeholder="Enter Address"
              class="form-control form1"
              id="exampleFormControlInput7"
              autoComplete="off"
              value={user.add}
              onChange={handleInputs}
            />
          </div>

          <button type="submit" class="btn btn-primary subBtn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
