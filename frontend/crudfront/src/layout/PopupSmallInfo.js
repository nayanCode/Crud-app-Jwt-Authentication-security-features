import React from "react";
import "../css/PopupSmallInfo.css";

export  function PopupSmallInfo({ message, type = "success", onClose }) {
    return (
        <div className={`alert-box ${type}`}>
            <span>{message}</span>
            <button className="close-btn" onClick={onClose}>×</button>
        </div>
    );
}

export default PopupSmallInfo;