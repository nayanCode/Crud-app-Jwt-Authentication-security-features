import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import PopupSmallInfo from "./PopupSmallInfo";

export default function CommonLayout() {
    const [alerts, setAlerts] = useState([]);

    const addAlert = (message, type = "success") => {
        const id = Date.now();

        setAlerts((prev) => [...prev, { id, message, type }]);
    };

    const removeAlert = (id) => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    };

    return (
        <>
            <PopupSmallInfo alerts={alerts} removeAlert={removeAlert} />

            <Outlet context={{ addAlert }} />

            <Footer />
        </>
    );
}