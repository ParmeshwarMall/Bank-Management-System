import Button from "@mui/material/Button";
import { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

export default function Deposite(props) {
  let [user, setUser] = useState({ amount: "", username: "" });
  let name, value;

  const handleInputs = (e) => {
    e.preventDefault();
    name = e.target.name;
    value = e.target.value;

    setUser({ ...user, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Waiting for confirmation...", {
      position: "top-center",
    });
    await axios
      .post(`${props.api}/admin/deposite`, user, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data === "InvalidU") {
          toast.dismiss(toastId);
          toast.info("Invalid Username!", {
            position: "top-center",
          });
        } else {
          toast.dismiss(toastId);
          toast.info(
            "Deposite Successfully.Your current amount is: " + res.data,
            {
              position: "top-center",
            }
          );
        }
      })
      .catch((err) => {
        toast.dismiss(toastId);
        toast.info("Something went wrong", {
          position: "top-center",
          autoClose: 2000,
        });
      });

    setUser({ amount: "", username: "" });
  };

  return (
    <div className="container8">
      <h1 className="mainhead">Welcome to Deposite Page</h1>
      <form onSubmit={submit}>
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
        <div className="balinfo">
          <label for="exampleFormControlInput2" class="form-label">
            Enter Username:{" "}
          </label>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <input
            type="name"
            name="username"
            class="form-control form2"
            id="exampleFormControlInput2"
            value={user.username}
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
