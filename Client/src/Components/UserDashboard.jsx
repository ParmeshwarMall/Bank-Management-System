import Button from "@mui/material/Button";
import { NavLink } from "react-router-dom";
import "../../public/CSS/Dashboard.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Userdashboard(props) {
  const [user, setUser] = useState({ username: "", password: "" });
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const toastId = toast.loading("Fetching details, please wait...", {
        position: "top-center",
      });
      setLoading(true);
      try {
        const response = await axios.get(`${props.api}/user/detail`, {
          withCredentials: true,
        });
        setDetails(response.data);
        toast.dismiss(toastId);
        toast.info("Details fetch successfully", {
          position: "top-center",
          autoClose: 2000,
        });
        setLoading(false);
      } catch (error) {
        toast.dismiss(toastId);
        toast.error("Failed to fetch details. Please try again!", {
          position: "top-center",
          autoClose: 2000,
        });
        setLoading(false);
      }
    };
    fetchData();
  }, [user, props.api]);

  function ObjectDisplay({ obj }) {
    return (
      <div className="info">
        <h1 className="mainhead">Your Details!</h1>
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
              <strong>Username: </strong> {obj.username}
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

  const [displayedAmount, setDisplayedAmount] = useState(0);

  useEffect(() => {
    if (details.amount > 0) {
      const duration = 100;
      const incrementAmount = details.amount / duration;

      let userAmount = 0;

      const interval = setInterval(() => {
        userAmount += incrementAmount;

        setDisplayedAmount(Math.min(Math.ceil(userAmount), details.amount));

        if (userAmount >= details.amount) {
          clearInterval(interval);
        }
      }, 1);

      return () => clearInterval(interval);
    }
  }, [details.amount]);

  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.post(
        `${props.api}/user/logout`,
        {},
        { withCredentials: true }
      );

      toast.success("Logged out successfully!", { position: "top-center" });
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Error logging out!", { position: "top-center" });
    }
  };

  return (
    <div className="user-dashboard">
      {loading && <div className="loading-overlay">Loading...</div>}
      <div className={`container7 ${loading ? "disabled" : ""}`}>
        <br />
        <h1 className="dash-mainhead">{`WELCOME ${details.name}`}</h1>
        <div className="user-container">
          <div className="user-container1">
            <div className="user-balance">
              <h2 className="user-balance-head">{`Your Current Balance: ${displayedAmount}`}</h2>
            </div>
            <div className="container71">
              <div className="accInfo1">
                <h3>Check Transaction History</h3>
                <NavLink to="/usertransaction">
                  <Button variant="contained" id="accbtn" color="primary">
                    Click here
                  </Button>
                </NavLink>
              </div>
              <div className="accInfo1">
                <h3>Transfer Money</h3>
                <NavLink to="/usermoneytransfer">
                  <Button variant="contained" id="accbtn" color="primary">
                    Click here
                  </Button>
                </NavLink>
              </div>
              <div className="accInfo1">
                <h3>Update Details</h3>
                <NavLink to="/updtdetail">
                  <Button variant="contained" id="accbtn" color="primary">
                    Click here
                  </Button>
                </NavLink>
              </div>
            </div>
          </div>
          <div className="user-details">
            <ObjectDisplay obj={details} />
          </div>
        </div>
        <Button variant="outlined" id="homebtn" onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
  );
}
