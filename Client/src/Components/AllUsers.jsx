import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import Button from "@mui/material/Button";

const AllUsers = (props) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedUserId, setExpandedUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const toastId = toast.loading("Fetching User details, please wait...", {
        position: "top-center",
      });

      try {
        const response = await axios.get(`${props.api}/admin/allUsers`, {
          withCredentials: true,
        });
        const { users } = response.data;
        setUsers(users);
        toast.dismiss(toastId);
        toast.success("User data fetched successfully", {
          position: "top-center",
        });
      } catch (error) {
        toast.dismiss(toastId);
        toast.error("Failed to fetch data", {
          position: "top-center",
        });
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [props.api]);

  const toggleDetails = (userId) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container8">
      <h1 className="mainhead">Users Detail</h1>

      <div style={{ margin: "20px 0px" }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearch}
          style={{
            padding: "10px",
            width: "90%",
            margin: "0 auto",
            display: "block",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* Check if there are no users */}
      {filteredUsers.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <h2>No users found</h2>
        </div>
      ) : (
        <div style={{ width: "90%", margin: "2vh auto", overflowX: "auto" }}>
          <table border="3" style={{ width: "100%", textAlign: "center" }}>
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Name</th>
                <th>Username</th>
                <th>Check Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <React.Fragment key={user._id}>
                  <tr>
                    <td data-label="S.No">{index + 1}.</td>
                    <td data-label="Name">{user.name}</td>
                    <td data-label="Username">{user.username}</td>
                    <td data-label="Check Details">
                      <button
                        className="form-select"
                        onClick={() => toggleDetails(user._id)}
                      >
                        {expandedUserId === user._id
                          ? "Hide Details"
                          : "Show Details"}
                      </button>
                    </td>
                  </tr>

                  {expandedUserId === user._id && (
                    <tr>
                      <td colSpan="4">
                        <div
                          style={{
                            padding: "10px",
                            display: "flex",
                            flexDirection: "column",
                            textAlign: "left",
                          }}
                        >
                          <img
                            src={user.image}
                            alt="Image"
                            style={{
                              height: "200px",
                              width: "200px",
                              margin: "10px 0px",
                            }}
                          />
                          <img
                            src={user.signature}
                            alt="signature"
                            style={{
                              height: "40px",
                              width: "200px",
                              margin: "10px 0px",
                            }}
                          />
                          <ul>
                            <li>
                              <strong>Name: </strong> {user.name}
                            </li>
                            <li>
                              <strong>Father Name: </strong> {user.fname}
                            </li>
                            <li>
                              <strong>DOB: </strong> {user.dob}
                            </li>
                            <li>
                              <strong>Email ID: </strong> {user.email}
                            </li>
                            <li>
                              <strong>Contact No.: </strong> {user.contact}
                            </li>
                            <li>
                              <strong>Aadhaar No.: </strong> {user.aadhaar}
                            </li>
                            <li>
                              <strong>PAN No.: </strong> {user.pan}
                            </li>
                            <li>
                              <strong>Username.: </strong> {user.username}
                            </li>
                            <li>
                              <strong>Account Type: </strong> {user.acctype}
                            </li>
                            <li>
                              <strong>Balance: </strong> {user.amount}
                            </li>
                            <li>
                              <strong>Address: </strong> {user.add}
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* Horizontal bold line */}
                  <tr>
                    <td colSpan="4">
                      <hr
                        style={{
                          borderTop: "3px solid black",
                          margin: "10px 0",
                        }}
                      />
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <br />
      <NavLink to="/admdashboard">
        <Button variant="outlined" id="homebtn">
          Go to main dashboard
        </Button>
      </NavLink>
    </div>
  );
};

export default AllUsers;
