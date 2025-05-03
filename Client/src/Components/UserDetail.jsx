import Button from "@mui/material/Button";
import { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

export default function UserDetail(props) {
  let [user, setUser] = useState({ username: "", password: "" });
  let name, value;

  let [details, setDetails] = useState([]);
  const [style, setStyle] = useState({ display: "none" });

  const handleInputs = (e) => {
    e.preventDefault();
    name = e.target.name;
    value = e.target.value;

    setUser({ ...user, [name]: value });
  };

  const submit = async (event) => {
    event.preventDefault();
    const toastId = toast.loading("Fetching details, please wait...", {
      position: "top-center",
    });
    const { username, password } = user;
    await axios
      .post(`${props.api}/admin/userDetail`, user, {
        withCredentials: true,
      })
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
          setDetails(res.data);
          setStyle({ display: "block" });
          toast.dismiss(toastId);
          toast.success("Details show below", {
            position: "top-center",
          });
        }
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

  function ObjectDisplay({ obj }) {
    return (
      <div className="info">
        <h1 className="mainhead">Details!</h1>
        <br />
        <div className="detail-container">
          <div className="image-signature">
            <img
              src={obj.image}
              alt="Image"
              style={{ height: "200px", width: "200px" }}
            />
            <img
              src={obj.signature}
              alt="signature"
              style={{ height: "40px", width: "200px" }}
            />
          </div>
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
              <strong>Address: </strong> {obj.add}
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="container8">
        <h1 className="mainhead">Welcome to Detail Page</h1>
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
          <hr />
        </form>

        <NavLink to="/admdashboard">
          <Button variant="outlined" id="homebtn">
            Go to main dashboard
          </Button>
        </NavLink>
      </div>

      <div className="detail" style={style}>
        <ObjectDisplay obj={details} />
      </div>
    </div>
  );
}
