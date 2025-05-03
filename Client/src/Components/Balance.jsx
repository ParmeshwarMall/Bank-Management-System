import Button from "@mui/material/Button";
import { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

export default function Balance(props) {
  let [user, setUser] = useState({ username: "", password: "" });
  let name, value;

  const handleInputs = (e) => {
    e.preventDefault();
    name = e.target.name;
    value = e.target.value;

    setUser({ ...user, [name]: value });
  };

  const submit = async (event) => {
    event.preventDefault();
    const toastId = toast.loading("Fetching balance, please wait...", {
      position: "top-center",
    });
    await axios
      .post(`${props.api}/admin/balance`, user, {
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

    setUser({ username: "", password: "" });
  };

  const [passwordVisible, setPasswordVisible] = useState(false);

  const handlePasswordVisibilityToggle = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="container8">
      <h1 className="mainhead">Welcome to Balance Enquiry page</h1>
      <form onSubmit={submit}>
        <div className="balinfo">
          <label for="exampleFormControlInput1" class="form-label">
            Enter Username:{" "}
          </label>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <input
            type="name"
            name="username"
            class="form-control form2"
            id="exampleFormControlInput1"
            onChange={handleInputs}
            value={user.username}
            autoComplete="off"
            required
          />
        </div>
        <div className="balinfo">
          <label for="exampleFormControlInput2" class="form-label">
            Enter Password:{" "}
          </label>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <div className="pass">
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              class="form-control form2"
              id="exampleFormControlInput2"
              onChange={handleInputs}
              value={user.password}
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

        <Button type="submit" variant="outlined" id="balbtn" className="subBtn">
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
