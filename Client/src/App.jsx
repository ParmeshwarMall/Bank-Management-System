import Combine from "./Components/Combine"
import DetailForm from './Components/DetailForm';
import Admdashboard from "./Components/Admdashboard";
import Balance from "./Components/Balance";
import Deposite from "./Components/Deposite";
import Withdraw from "./Components/Withdraw";
import MoneyTrans from "./Components/MoneyTrans";
import DeleteAcc from "./Components/DeleteAcc";
import About from "./Components/About";
import Services from "./Components/Services";
import Contact from "./Components/Contact";
import Transaction from "./Components/Transaction";
import Userdashboard from "./Components/Userdashboard";
import UserBalance from "./Components/UserBalance";
import UserTransaction from "./Components/UserTransaction";
import UserForm from "./Components/userform";
import PasswordChange from "./Components/PasswordChange";
import UpdateDetails from "./Components/UpdateDetails";
import Detail from "./Components/Detail";
import UserDetail from "./Components/UserDetail";
import Users from "./Components/Users";
import AllTransactions from "./Components/AllTransactions";
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from "./Components/ProtectedRoute";
import ProtectedRoute2 from "./Components/ProtectedRoute2";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const api="http://localhost:8000";
// const api="https://bank-backend-ffwv.onrender.com";

function App() {


  return (
    <div>
      <ToastContainer
        theme="colored"
      />
      <Routes>
        <Route path="/" element={<Combine api={api}/>} />
        <Route path="/userform" element={<UserForm api={api}/>} />
        <Route path="/passchg" element={<PasswordChange api={api}/>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admdashboard" element={<Admdashboard api={api}/>} />
          <Route path="/form" element={<DetailForm api={api}/>} />
          <Route path="/balance" element={<Balance api={api}/>} />
          <Route path="/deposite" element={<Deposite api={api}/>} />
          <Route path="/withdraw" element={<Withdraw api={api}/>} />
          <Route path="/transfer" element={<MoneyTrans api={api}/>} />
          <Route path="/delete" element={<DeleteAcc api={api}/>} />
          <Route path="/transaction" element={<Transaction api={api}/>} />
          <Route path="/detail" element={<Detail api={api}/>}/>
          
          <Route path='/allusers' element={<Users api={api}/>}/>
          <Route path='/alltransactions' element={<AllTransactions api={api}/>}/>
        </Route>

        <Route element={<ProtectedRoute2 />}>
          <Route path="/userdashboard" element={<Userdashboard api={api}/>} />
          <Route path="/userbalance" element={<UserBalance api={api}/>} />
          <Route path="/usertransaction" element={<UserTransaction api={api}/>} />
          <Route path="/userdetail" element={<UserDetail api={api}/>} />
        </Route>

        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/updtdetail" element={<UpdateDetails api={api}/>} />
      </Routes>
    </div>
  )

}


export default App
