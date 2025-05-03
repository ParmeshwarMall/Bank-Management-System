import Button from "@mui/material/Button";
import { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

export default function AdminMoneyTransfer(props) {
  let [user, setUser] = useState({
    senusername: "",
    password: "",
    recusername: "",
    amount: "",
  });
  let name, value;

  const handleInputs = (e) => {
    e.preventDefault();
    name = e.target.name;
    value = e.target.value;

    setUser({ ...user, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Waiting for confirmation", {
      position: "top-center",
    });
    const { senusername, password, recusername, amount } = user;
    await axios
      .post(`${props.api}/admin/transfer`, user, {
        withCredentials: true,
      })
      .then((res) => {
        toast.dismiss(toastId);
        toast.info(res.data, {
          position: "top-center",
        });
      })
      .catch((err) => {
        toast.dismiss(toastId);
        toast.error("Something went wrong", {
          position: "top-center",
        });
      });

    setUser({ senusername: "", password: "", recusername: "", amount: "" });
  };

  const [passwordVisible, setPasswordVisible] = useState(false);

  const handlePasswordVisibilityToggle = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="container8">
      <h1 className="mainhead">Welcome to Money Transfer Page</h1>
      <form onSubmit={submit}>
        <div className="balinfo">
          <label for="exampleFormControlInput1" class="form-label">
            Enter Sender Username:{" "}
          </label>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <input
            type="name"
            name="senusername"
            class="form-control form2"
            id="exampleFormControlInput1"
            value={user.senusername}
            onChange={handleInputs}
            autoComplete="off"
            required
          />
        </div>
        <div className="balinfo">
          <label for="exampleFormControlInput1" class="form-label">
            Enter Sender Password:{" "}
          </label>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <div className="pass">
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              class="form-control form2"
              id="exampleFormControlInput1"
              value={user.password}
              onChange={handleInputs}
              autoComplete="off"
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
        <div className="balinfo">
          <label for="exampleFormControlInput1" class="form-label">
            Enter Receiver Username:{" "}
          </label>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <input
            type="name"
            name="recusername"
            class="form-control form2"
            id="exampleFormControlInput1"
            value={user.recusername}
            onChange={handleInputs}
            autoComplete="off"
            required
          />
        </div>
        <div className="balinfo">
          <label for="exampleFormControlInput1" class="form-label">
            Enter Amount:{" "}
          </label>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <input
            type="number"
            name="amount"
            class="form-control form2"
            id="exampleFormControlInput1"
            value={user.amount}
            onChange={handleInputs}
            autoComplete="off"
            required
          />
        </div>

        <Button type="submit" variant="outlined" id="balbtn">
          Submit
        </Button>
        <hr />
      </form>
      <NavLink to="/admdashboard">
        <Button variant="outlined" id="homebtn">
          Go to main dashboard
        </Button>
      </NavLink>
    </div>
  );
}
