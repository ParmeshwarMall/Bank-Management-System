import "../../public/CSS/Dashboard.css";
import Button from "@mui/material/Button";
import { NavLink } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard(props) {
  const [users, setUsers] = useState({ currUsers: 0, totalTransaction: 0 });
  const [displayedUsers, setDisplayedUsers] = useState(0);
  const [displayedTransactions, setDisplayedTransactions] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const toastId = toast.loading("Fetching details, please wait...", {
        position: "top-center",
      });
      try {
        const response = await axios.get(`${props.api}/admin/allUsers`, {
          withCredentials: true,
        });
        const { totalUsers, totalTransactions } = response.data;
        setUsers({
          currUsers: totalUsers,
          totalTransaction: totalTransactions,
        });
        setLoading(false);
        toast.dismiss(toastId);
        toast.info("Details fetch successfully", {
          position: "top-center",
          autoClose: 2000,
        });
      } catch (error) {
        toast.dismiss(toastId);
        toast.error("Failed to fetch details. Please try again!", {
          position: "top-center",
          autoClose: 2000,
        });
        setLoading(false);
      }
    };
    fetchUsers();
  }, [props.api]);

  useEffect(() => {
    if (users.currUsers > 0) {
      const duration = 100;
      const incrementUsers = users.currUsers / duration;
      const incrementTransactions = users.totalTransaction / duration;

      let userCount = 0;
      let transactionCount = 0;

      const interval = setInterval(() => {
        userCount += incrementUsers;
        transactionCount += incrementTransactions;

        setDisplayedUsers(Math.min(Math.ceil(userCount), users.currUsers));
        setDisplayedTransactions(
          Math.min(Math.ceil(transactionCount), users.totalTransaction)
        );

        if (
          userCount >= users.currUsers &&
          transactionCount >= users.totalTransaction
        ) {
          clearInterval(interval);
        }
      }, 1);

      return () => clearInterval(interval);
    }
  }, [users.currUsers, users.totalTransaction]);

  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.post(
        `${props.api}/admin/logout`,
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
    <div className="admdashboard">
      {loading && <div className="loading-overlay">Loading...</div>}
      <div className={`container7 ${loading ? "disabled" : ""}`}>
        <br />
        <h1 className="dash-mainhead">Welcome To the Dashboard</h1>
        <div className="users">
          <div className="usersnumber">
            <h3>{`Number of active users: ${displayedUsers}`}</h3>
            <div className="accInfo1">
              <h4>Check All Users</h4>
              <NavLink to="/allusers">
                <Button variant="contained" id="accbtn" color="primary">
                  Click here
                </Button>
              </NavLink>
            </div>
          </div>
          <div className="userstrans">
            <h3>{`Total number of transactions: ${displayedTransactions}`}</h3>
            <div className="accInfo1">
              <h4>Check All Transactions</h4>
              <NavLink to="/alltransactions">
                <Button variant="contained" id="accbtn" color="primary">
                  Click here
                </Button>
              </NavLink>
            </div>
          </div>
        </div>
        <div className="container71">
          <div className="accInfo1">
            <h3>For New Acc Open</h3>
            <NavLink to="/form">
              <Button variant="contained" id="accbtn" color="primary">
                Click here
              </Button>
            </NavLink>
          </div>
          <div className="accInfo1">
            <h3>Check Balance</h3>
            <NavLink to="/balance">
              <Button variant="contained" id="accbtn" color="primary">
                Click here
              </Button>
            </NavLink>
          </div>
          <div className="accInfo1">
            <h3>For Deposite</h3>
            <NavLink to="/deposite">
              <Button variant="contained" id="accbtn" color="primary">
                Click here
              </Button>
            </NavLink>
          </div>
          <div className="accInfo1">
            <h3>For Withdraw</h3>
            <NavLink to="/withdraw">
              <Button variant="contained" id="accbtn" color="primary">
                Click here
              </Button>
            </NavLink>
          </div>
          <div className="accInfo1">
            <h3>For Money Transfer</h3>
            <NavLink to="/transfer">
              <Button variant="contained" id="accbtn" color="primary">
                Click here
              </Button>
            </NavLink>
          </div>
          <div className="accInfo1">
            <h3>For Transaction History</h3>
            <NavLink to="/transaction">
              <Button variant="contained" id="accbtn" color="primary">
                Click here
              </Button>
            </NavLink>
          </div>
          <div className="accInfo1">
            <h3>For Check Details</h3>
            <NavLink to="/detail">
              <Button variant="contained" id="accbtn" color="primary">
                Click here
              </Button>
            </NavLink>
          </div>
          <div className="accInfo1">
            <h3>For Update Details</h3>
            <NavLink to="/updtdetail">
              <Button variant="contained" id="accbtn" color="primary">
                Click here
              </Button>
            </NavLink>
          </div>
          <div className="accInfo1">
            <h3>For Delete Account</h3>
            <NavLink to="/delete">
              <Button variant="contained" id="accbtn" color="primary">
                Click here
              </Button>
            </NavLink>
          </div>
        </div>
        <Button
          variant="outlined"
          id="homebtn"
          onClick={logout}
          disabled={loading}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
