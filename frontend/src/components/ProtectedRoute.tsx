import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  return user && token ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
