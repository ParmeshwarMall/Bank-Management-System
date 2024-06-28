import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';
import "../public/CSS/Dashboard.css";

export default function Userdashboard(){
    return(
        <div className='user-dashboard'>
            <div className="container7">
                <h1 className='dash-mainhead'>Welcome To the Dashboard</h1>
                <div className="accInfo1">
                    <h3>For Check Balance :</h3>
                    <NavLink to="/userbalance"><Button variant="outlined" id="accbtn" >Click here</Button></NavLink>
                </div>
                <div className="accInfo1">
                    <h3>For Transaction History :</h3>
                    <NavLink to="/usertransaction"><Button variant="outlined" id="accbtn" >Click here</Button></NavLink>
                </div>
                <div className="accInfo1">
                    <h3>For Check Details :</h3>
                    <NavLink to="/userdetail"><Button variant="outlined" id="accbtn" >Click here</Button></NavLink>
                </div>
                <div className="accInfo1">
                    <h3>For Change Password :</h3>
                    <NavLink to="/passchg"><Button variant="outlined" id="accbtn" >Click here</Button></NavLink>
                </div>
                <Button variant="outlined" id="homebtn" href="/">Logout</Button>
            </div>
        </div>
    )
}