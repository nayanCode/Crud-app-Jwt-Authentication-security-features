import api from "../api/api";
import { useNavigate } from "react-router-dom";
import React from "react";
import { clearUserAuth } from "../redux/authSlice";
import { useDispatch } from "react-redux";

function LogoutButton({ className = "btn btn-outline-light" }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            await api.post("/public/logout");
            dispatch(clearUserAuth());
            navigate("/user/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return(
        <button type="button" onClick={handleLogout} className={className}>
            Logout
        </button>
    );

}

export default LogoutButton;
