import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const AdmProtectedRoute = (props) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${props.api}/admin/adminAuth`, {
          withCredentials: true,
        });
        if (res.status === 200) {
          setIsAuth(true);
        }
      } catch (err) {
        setIsAuth(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuth === null) {
    return <div>Loading...</div>; // or a loading spinner
  }

  return isAuth ? <Outlet /> : <Navigate to="/" />;
};

export default AdmProtectedRoute;
