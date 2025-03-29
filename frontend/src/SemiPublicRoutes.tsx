import { Navigate, Outlet } from "react-router-dom";

export default function SemiPublicRoutes() {

    const token = localStorage.getItem("moderator_token");

    // If token exists, render the component, otherwise redirect to login
    return !token ? <Outlet /> : <Navigate to="/" />;
}