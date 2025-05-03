import Combine from "./Components/Combine";
import AccOpenForm from "./Components/AccOpenForm";
import AdminDashboard from "./components/AdminDashboard";
import Balance from "./Components/Balance";
import Deposite from "./Components/Deposite";
import Withdraw from "./Components/Withdraw";
import AdminMoneyTransfer from "./Components/AdminMoneyTransfer";
import DeleteAccount from "./Components/DeleteAccount";
import About from "./Components/About";
import Services from "./Components/Services";
import Contact from "./Components/Contact";
import TransactionHistory from "./Components/TransactionHistory";
import UserDashboard from "./Components/UserDashboard";
import UserTransactionHistory from "./Components/UserTransactionHistory";
import UserAccOpenForm from "./Components/UserAccOpenForm";
import ForgotPassword from "./Components/ForgotPassword";
import UpdateDetails from "./Components/UpdateDetails";
import UserDetail from "./Components/UserDetail";
import AllUsers from "./Components/AllUsers";
import AllTransactions from "./Components/AllTransactions";
import { Routes, Route, Navigate } from "react-router-dom";
import AdmProtectedRoute from "./Components/AdmProtectedRoute";
import UserProtectedRoute from "./Components/UserProtectedRoute";
import UserMoneyTransfer from "./Components/UserMoneyTransfer";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const api = "http://localhost:8000";
// const api="https://bank-backend-ffwv.onrender.com";

function App() {
  return (
    <div>
      <ToastContainer theme="colored" />
      <Routes>
        <Route path="/" element={<Combine api={api} />} />
        <Route path="/userform" element={<UserAccOpenForm api={api} />} />
        <Route path="/passchg" element={<ForgotPassword api={api} />} />
        <Route element={<AdmProtectedRoute api={api} />}>
          <Route path="/admdashboard" element={<AdminDashboard api={api} />} />
          <Route path="/form" element={<AccOpenForm api={api} />} />
          <Route path="/balance" element={<Balance api={api} />} />
          <Route path="/deposite" element={<Deposite api={api} />} />
          <Route path="/withdraw" element={<Withdraw api={api} />} />
          <Route path="/transfer" element={<AdminMoneyTransfer api={api} />} />
          <Route path="/delete" element={<DeleteAccount api={api} />} />
          <Route
            path="/transaction"
            element={<TransactionHistory api={api} />}
          />
          <Route path="/detail" element={<UserDetail api={api} />} />

          <Route path="/allusers" element={<AllUsers api={api} />} />
          <Route
            path="/alltransactions"
            element={<AllTransactions api={api} />}
          />
        </Route>

        <Route element={<UserProtectedRoute api={api} />}>
          <Route path="/userdashboard" element={<UserDashboard api={api} />} />
          <Route
            path="/usertransaction"
            element={<UserTransactionHistory api={api} />}
          />
          <Route
            path="/usermoneytransfer"
            element={<UserMoneyTransfer api={api} />}
          />
        </Route>

        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/updtdetail" element={<UpdateDetails api={api} />} />
      </Routes>
    </div>
  );
}

export default App;
