import { Navigate, Outlet } from "react-router-dom";
export default function ProtectedRoutes() {

    const token = localStorage.getItem("moderator_token");

    // If token exists, render the component, otherwise redirect to login
    return token ? <Outlet /> : <Navigate to="/login" />;
}