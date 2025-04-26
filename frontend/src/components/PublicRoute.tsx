import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  return user && token ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default PublicRoute;
