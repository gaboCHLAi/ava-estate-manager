import { Navigate, useLocation } from "react-router-dom";
import { useStatus } from "../contextAPI/Context";

const ProtectedRoute = ({ children }) => {
  const { user } = useStatus();
  const token = localStorage.getItem("token");
  const location = useLocation();

  const isAuthenticated =
    user && token && token !== "undefined" && token !== "null";

  if (!isAuthenticated) {
    console.log("Access Denied! Redirecting to login...");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
