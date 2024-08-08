import Combine from "./Combine"
import DetailForm from './DetailForm';
import Admdashboard from "./Admdashboard";
import Balance from "./Balance";
import Deposite from "./Deposite";
import Withdraw from "./Withdraw";
import MoneyTrans from "./MoneyTrans";
import DeleteAcc from "./DeleteAcc";
import About from "./About";
import Services from "./Services";
import Contact from "./Contact";
import Transaction from "./Transaction";
import Userdashboard from "./Userdashboard";
import UserBalance from "./UserBalance";
import UserTransaction from "./UserTransaction";
import UserForm from "./userform";
import PasswordChange from "./PasswordChange";
import UpdateDetails from "./UpdateDetails";
import Detail from "./Detail";
import UserDetail from "./UserDetail";
import Users from "./Users";
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute";
import ProtectedRoute2 from "./ProtectedRoute2";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const api="https://bank-backend-ffwv.onrender.com";



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
          <Route path="/admdashboard" element={<Admdashboard />} />
          <Route path="/form" element={<DetailForm api={api}/>} />
          <Route path="/balance" element={<Balance api={api}/>} />
          <Route path="/deposite" element={<Deposite api={api}/>} />
          <Route path="/withdraw" element={<Withdraw api={api}/>} />
          <Route path="/transfer" element={<MoneyTrans api={api}/>} />
          <Route path="/delete" element={<DeleteAcc api={api}/>} />
          <Route path="/transaction" element={<Transaction api={api}/>} />
          <Route path="/detail" element={<Detail api={api}/>}/>
          <Route path="/updtdetail" element={<UpdateDetails api={api}/>} />
          <Route path='/allusers' element={<Users api={api}/>}/>
        </Route>

        <Route element={<ProtectedRoute2 />}>
          <Route path="/userdashboard" element={<Userdashboard />} />
          <Route path="/userbalance" element={<UserBalance api={api}/>} />
          <Route path="/usertransaction" element={<UserTransaction api={api}/>} />
          <Route path="/userdetail" element={<UserDetail api={api}/>} />
        </Route>

        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  )

}


export default App