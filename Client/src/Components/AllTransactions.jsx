import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import Button from "@mui/material/Button";
import jsPDF from "jspdf";
import "jspdf-autotable";

const AllTransactions = (props) => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      const toastId = toast.loading("Fetching Transactions, please wait...", {
        position: "top-center",
      });

      try {
        const response = await axios.get(`${props.api}/admin/allTransactions`, {
          withCredentials: true,
        });
        setTransactions(response.data);
        toast.dismiss(toastId);
        toast.success("Transactions fetched successfully", {
          position: "top-center",
        });
      } catch (error) {
        toast.dismiss(toastId);
        toast.error("Failed to fetch transactions", {
          position: "top-center",
        });
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const handleSearchTerm = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesUsername = transaction.username
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Convert transaction date to Date object
    const transactionDate = new Date(transaction.transdate);

    // Convert transaction time to comparable DateTime if necessary
    // Assuming `transtime` is in HH:mm:ss format, adjust parsing as needed
    const [hours, minutes, seconds] = transaction.transtime
      ? transaction.transtime.split(":").map(Number)
      : [0, 0, 0];
    transactionDate.setHours(hours, minutes, seconds);

    // Date range matching logic
    let matchesDateRange = true;

    if (startDate) {
      const start = new Date(startDate);
      matchesDateRange = transactionDate >= start;
    }

    if (endDate) {
      const end = new Date(endDate);
      matchesDateRange = matchesDateRange && transactionDate <= end;
    }

    return matchesUsername && matchesDateRange;
  });

  const handlePrint = () => {
    const doc = new jsPDF();

    // Add title
    doc.text("Transactions History", 14, 10);

    // Add table
    const tableColumn = ["Username", "Amount", "Mode", "Date", "Time"];
    const tableRows = filteredTransactions.map((transaction) => [
      transaction.username,
      transaction.amount,
      transaction.mode,
      transaction.transdate,
      transaction.transtime,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    // Save the PDF
    doc.save("transactions.pdf");
  };

  return (
    <div className="transhistory">
      <h2 className="mainhead">Transactions History</h2>
      <div style={{ margin: "20px 0px" }}>
        <input
          type="text"
          placeholder="Search by username..."
          value={searchTerm}
          onChange={handleSearchTerm}
          style={{
            padding: "10px",
            width: "90%",
            margin: "0 auto",
            display: "block",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        {/* <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            marginTop: "10px",
            width: "90%",
            margin: "10px auto",
          }}
        >
          <h6>Search by date</h6>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              style={{
                padding: "10px",
                width: "48%",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              style={{
                padding: "10px",
                width: "48%",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        </div> */}
      </div>

      {filteredTransactions.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <h2>No Transaction History Found</h2>
        </div>
      ) : (
        <div style={{ width: "90%", margin: "2vh auto", overflowX: "auto" }}>
          <table border="3" style={{ width: "100%", textAlign: "center" }}>
            <thead>
              <tr>
                <th>Username</th>
                <th>Amount</th>
                <th>Mode</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => (
                <tr key={index}>
                  <td data-label="Username">{transaction.username}</td>
                  <td data-label="Amount">{transaction.amount}</td>
                  <td data-label="Mode">{transaction.mode}</td>
                  <td data-label="Date">{transaction.transdate}</td>
                  <td data-label="Time">{transaction.transtime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
          alignItems: "center",
          width: "90%",
          margin: "0 auto",
        }}
      >
        <NavLink to="/admdashboard">
          <Button variant="outlined" id="homebtn">
            Go to main dashboard
          </Button>
        </NavLink>

        <Button
          variant="outlined"
          class="btn btn-primary"
          onClick={handlePrint}
          style={{ height: "40px" }}
        >
          Print Transactions
        </Button>
      </div>
    </div>
  );
};

export default AllTransactions;
