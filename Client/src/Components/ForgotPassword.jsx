import Button from "@mui/material/Button";
import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function ForgotPassword(props) {
  let [user, setUser] = useState({ username: "", password: "", otp: "" });
  let [resOTP, setResOTP] = useState("");
  let [isVerify, setIsVerify] = useState(false);
  let name, value;

  const handleInputs = (e) => {
    e.preventDefault();
    name = e.target.name;
    value = e.target.value;

    setUser({ ...user, [name]: value });
  };

  const submit = async (event) => {
    event.preventDefault();
    const toastId = toast.loading("Waiting for confirmation...", {
      position: "top-center",
    });
    const { username, password } = user;
    await axios
      .post(`${props.api}/user/passwordChange`, user)
      .then((res) => {
        toast.dismiss(toastId);
        toast.info(res.data, {
          position: "top-center",
        });
        setIsVerify(false);
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

  const sendOtp = async () => {
    const { username } = user;
    if (!username) {
      toast.error("Enter Username", { position: "top-center" });
      return;
    }

    try {
      const toastId = toast.loading("Sending OTP, please wait...", {
        position: "top-center",
      });

      const response = await axios.post(`${props.api}/user/verifyUser`, {
        username,
      });
      setResOTP(response.data.otp);
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
    if (user.otp == resOTP) {
      toast.success("Email Verification Success", { position: "top-center" });
      setIsVerify(true);
      setResOTP("");
    } else {
      toast.error("Invalid OTP", { position: "top-center" });
    }
  };

  return (
    <div className="container8">
      <h1 className="mainhead">Welcome to Password Change Page</h1>
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
            disabled={resOTP}
            required
          />
        </div>
        <Button variant="contained" id="next-btn" onClick={sendOtp}>
          Continue
          <ArrowForwardIcon color="error" sx={{ ml: 1 }} />
        </Button>
        {resOTP && (
          <div className="otp-verify">
            <input
              type="text"
              value={user.otp}
              name="otp"
              onChange={handleInputs}
              placeholder="Enter OTP"
            />
            <Button variant="contained" onClick={verifyOTP}>
              Verify
            </Button>
          </div>
        )}
        {isVerify && (
          <>
            <div className="balinfo">
              <label for="exampleFormControlInput2" class="form-label">
                Enter New Password:{" "}
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
          </>
        )}
      </form>

      <Button variant="outlined" id="homebtn" href="/">
        Go to Home
      </Button>
    </div>
  );
}
