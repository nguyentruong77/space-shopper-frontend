import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function GuestRoute({ redirect = "/" }) {
  const user = useSelector(state => state?.auth?.user);
  if (user) return <Navigate to={redirect} />;
  return <Outlet />;
}
