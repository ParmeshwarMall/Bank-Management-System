import Button from "@mui/material/Button";
import { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from 'react-toastify';

export default function UserTransaction(props) {
  let [user, setUser] = useState({ username: "" });
  let name, value;

  const [transactions, setTransactions] = useState([]);
  const [style, setStyle] = useState({ visibility: "hidden" });

  const handleInputs = (e) => {
    e.preventDefault();
    name = e.target.name;
    value = e.target.value;

    setUser({ ...user, [name]: value });
  };

  const submit = async (event) => {
    event.preventDefault();
    const toastId = toast.loading("Fetching transaction history...", {
      position: "top-center",
    });
    const { username, password } = user;
    await axios
      .post(`${props.api}/transaction`, user)
      .then((res) => {
        if (res.data === "InvalidU") {
          toast.dismiss(toastId);
          toast.info("Invalid Username!", {
            position: "top-center",
            });
        } else if (res.data === "InvalidP") {
          toast.dismiss(toastId);
          toast.info("Invalid Password!", {
            position: "top-center",
            });
        } else {
          setTransactions(res.data);
          setStyle({ display: "block" });
          toast.dismiss(toastId);
          toast.success("Transaction history show below", {
            position: "top-center",
            });
        }
      })
      .catch((err) => console.log(err));
    setUser({ username: "", password: "" });
  };

  const send = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Waiting for confirmation...", {
      position: "top-center",
    });
    await axios
      .post(`${props.api}/email`, user)
      .then((res) => {
        toast.dismiss(toastId);
        toast.success(res.data, {
          position: "top-center",
        });
      })
      .catch((err) => console.log(err));
  };

  const [passwordVisible, setPasswordVisible] = useState(false);

  const handlePasswordVisibilityToggle = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div>
      <div className="container8">
        <h1 className="mainhead">Welcome to Transaction History Page</h1>
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
              value={user.username}
              onChange={handleInputs}
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

          <Button type="submit" variant="outlined" id="balbtn">
            Submit
          </Button>
          <br />
          <br />
          <br />
          <hr />
        </form>

        <Button variant="outlined" id="homebtn" href="/">
          Logout
        </Button>
        <br />
        <NavLink to="/userdashboard">
          <Button variant="outlined" id="homebtn">
            Go to main dashboard
          </Button>
        </NavLink>
      </div>

      <div className="transhistory" style={style}>
        <h2 className="mainhead">Transaction History</h2>
        <div style={{ width: "90%", margin: "2vh auto", overflowX: "auto" }}>
          <table border="3" style={{ width: "100%", textAlign: "center" }}>
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
                  <td data-ldata="Amount">{transaction.amount}</td>
                  <td data-label="Mode">{transaction.mode}</td>
                  <td data-label="Date">{transaction.transdate}</td>
                  <td data-label="Time">{transaction.transtime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <br />
        <Button variant="outlined" id="sub-btn" type="button" onClick={send}>
          Send to email
        </Button>
      </div>
    </div>
  );
}
