import { Navigate,Outlet } from "react-router-dom"
import { isUserLog } from "./Body";


const ProtectedRoute2=()=>{
    const isAuth=isUserLog;
    return isAuth?<Outlet/> :<Navigate to='/'/>
}

export default ProtectedRoute2