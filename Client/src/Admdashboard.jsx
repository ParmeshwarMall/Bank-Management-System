import '../public/CSS/Dashboard.css'
import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';

export default function Admdashboard(){
    return(
        <div className='admdashboard'>
            <div className="container7">
                <h1 className='dash-mainhead'>Welcome To the Dashboard</h1>
                <br />
                <div className="accInfo1">
                    <h3>For New Acc Open :</h3>
                    <NavLink to="/form"><Button variant="outlined" id="accbtn" >Click here</Button></NavLink>
                </div>
                <div className="accInfo1">
                    <h3>Check Balance :</h3>
                    <NavLink to="/balance"><Button variant="outlined" id="accbtn">Click here</Button></NavLink>
                </div>
                <div className="accInfo1">
                    <h3>For Deposite :</h3>
                    <NavLink to="/deposite"><Button variant="outlined" id="accbtn" >Click here</Button></NavLink>
                </div>
                <div className="accInfo1">
                    <h3>For Withdraw :</h3>
                    <NavLink to="/withdraw"><Button variant="outlined" id="accbtn" >Click here</Button></NavLink>
                </div>
                <div className="accInfo1">
                    <h3>For Money Transfer :</h3>
                    <NavLink to="/transfer"><Button variant="outlined" id="accbtn" >Click here</Button></NavLink>
                </div>
                <div className="accInfo1">
                    <h3>For Transaction History :</h3>
                    <NavLink to="/transaction"><Button variant="outlined" id="accbtn" >Click here</Button></NavLink>
                </div>
                <div className="accInfo1">
                    <h3>For Check Details :</h3>
                    <NavLink to="/detail"><Button variant="outlined" id="accbtn" >Click here</Button></NavLink>
                </div>
                <div className="accInfo1">
                    <h3>For Update Details :</h3>
                    <NavLink to="/updtdetail"><Button variant="outlined" id="accbtn" >Click here</Button></NavLink>
                </div>
                <div className="accInfo1">
                    <h3>For Delete Account :</h3>
                    <NavLink to="/delete"><Button variant="outlined" id="accbtn" >Click here</Button></NavLink>
                </div>
                <Button variant="outlined" id="homebtn" href="/">Logout</Button>
            </div>
        </div>
    )
}