import Button from "@mui/material/Button";
import { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

export default function Withdraw(props) {
  let [user, setUser] = useState({ amount: "", username: "", password: "" });
  let [details, setDetails] = useState([]);
  let [open, setOpen] = useState(false);
  let name, value;

  const handleInputs = (e) => {
    e.preventDefault();
    name = e.target.name;
    value = e.target.value;

    setUser({ ...user, [name]: value });
  };

  const validate = async (event) => {
    event.preventDefault();
    const toastId = toast.loading("Fetching details, please wait...", {
      position: "top-center",
    });
    await axios
      .post(`${props.api}/admin/userDetail`, user, {
        withCredentials: true,
      })
      .then((res) => {
        toast.dismiss(toastId);
        if (res.data === "InvalidU") {
          toast.info("Invalid Username!", {
            position: "top-center",
          });
        } else if (res.data === "InvalidP") {
          toast.info("Invalid Password!", {
            position: "top-center",
          });
        } else {
          setDetails(res.data);
          setOpen(true);
        }
      })
      .catch((err) => {
        toast.dismiss(toastId);
        toast.error("Something went wrong", {
          position: "top-center",
          autoClose: 2000,
        });
      });
  };

  const submit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Waiting for confirmation...", {
      position: "top-center",
    });
    const { amount, username, password } = user;
    await axios
      .post(`${props.api}/admin/withdraw`, user, {
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

    setUser({ amount: "", username: "", password: "" });
  };

  const [passwordVisible, setPasswordVisible] = useState(false);

  const handlePasswordVisibilityToggle = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="container8">
      <h1 className="mainhead">Welcome to Withdraw Page</h1>
      <form onSubmit={submit}>
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
        <div className="balinfo">
          <label for="exampleFormControlInput3" class="form-label">
            Enter Password:{" "}
          </label>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <div className="pass">
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              class="form-control form2"
              id="exampleFormControlInput3"
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
        <Button variant="contained" id="next-btn" onClick={validate}>
          Validate
          <ArrowForwardIcon color="error" sx={{ ml: 1 }} />
        </Button>
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

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%", // Default width for smaller screens
            maxWidth: 300, // Max width for larger screens
            bgcolor: "white",
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
            textAlign: "center",
            "@media (max-width: 600px)": {
              p: 2, // Reduce padding on small screens
            },
          }}
        >
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            User Details
          </h2>

          {details && (
            <div style={{ textAlign: "left" }}>
              {/* User Image */}
              <img
                src={details.image}
                alt="User"
                style={{
                  height: "200px",
                  width: "100%",
                  maxWidth: "200px",
                  borderRadius: "5px",
                }}
              />
              <br />
              {/* Signature */}
              <img
                src={details.signature}
                alt="Signature"
                style={{
                  height: "40px",
                  width: "100%",
                  maxWidth: "200px",
                  marginTop: "10px",
                }}
              />
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  textAlign: "left",
                  fontSize: "1rem",
                }}
              >
                <li>
                  <strong>Name:</strong> {details.name}
                </li>
                <li>
                  <strong>Username:</strong> {details.username}
                </li>
                <li>
                  <strong>Balance:</strong> {details.amount}
                </li>
              </ul>
            </div>
          )}

          {/* Close Button */}
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpen(false)}
            sx={{
              mt: 2,
              width: "100%",
              "@media (max-width: 600px)": {
                fontSize: "0.875rem",
                padding: "6px",
              },
            }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
