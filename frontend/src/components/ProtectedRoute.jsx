import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getUser } from "../function/user.js";

const ProtectedRoute = ({ role }) => {
  const location = useLocation();
  const [session, setSession] = useState({ loading: true, user: null });

  useEffect(() => {
    let active = true;
    getUser()
      .then(({ data }) => {
        if (active) setSession({ loading: false, user: data });
      })
      .catch(() => {
        if (active) setSession({ loading: false, user: null });
      });
    return () => {
      active = false;
    };
  }, []);

  if (session.loading) {
    return <div className="p-8 text-center text-gray-600">Loading...</div>;
  }
  if (!session.user?.login) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (role && session.user.role !== role) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
