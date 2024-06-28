import { Navigate,Outlet } from "react-router-dom"
import { isAdLog } from "./Body";


const ProtectedRoute=()=>{
    const isAuth=isAdLog;
    return isAuth?<Outlet/> :<Navigate to='/'/>
}

export default ProtectedRoute