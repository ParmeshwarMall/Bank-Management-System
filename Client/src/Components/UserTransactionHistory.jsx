import Button from "@mui/material/Button";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function UserTransactionHistory(props) {
  const [transactions, setTransactions] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      const toastId = toast.loading("Fetching Transactions, please wait...", {
        position: "top-center",
      });

      try {
        const response = await axios.get(`${props.api}/user/transaction`, {
          withCredentials: true,
        });
        const { transactions } = response.data;
        setTransactions(transactions);
        setUsername(response.data.username);
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

  const send = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Waiting for confirmation...", {
      position: "top-center",
    });
    await axios
      .post(`${props.api}/user/emailTransaction`, { username })
      .then((res) => {
        toast.dismiss(toastId);
        toast.success(res.data, {
          position: "top-center",
        });
      })
      .catch((err) => {
        toast.dismiss(toastId);
        toast.error("Something went wrong", {
          position: "top-center",
        });
      });
  };

  const handlePrint = () => {
    const doc = new jsPDF();

    // Add title
    doc.text("Transactions History", 14, 10);

    // Add table
    const tableColumn = ["Username", "Amount", "Mode", "Date", "Time"];
    const tableRows = transactions.map((transaction) => [
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
    <div>
      <div className="transhistory">
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
          <Button variant="outlined" id="sub-btn" type="button" onClick={send}>
            Send to email
          </Button>

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
      <NavLink to="/userdashboard">
        <Button variant="outlined" id="homebtn">
          Go to main dashboard
        </Button>
      </NavLink>
    </div>
  );
}
