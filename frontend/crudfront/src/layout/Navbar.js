import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import Logout from "./logout";

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinkStyle = ({ isActive }) =>
    `nav-link px-3 py-2 rounded-pill ${isActive ? "text-white bg-light bg-opacity-25" : "text-white-50"}`;

  const handleToggle = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark shadow-sm"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 55%, #2563eb 100%)",
      }}
    >
      <div className="container py-2">
        <NavLink
          className="navbar-brand fw-bold d-flex flex-column align-items-start"
          to={isAuthenticated ? "/user/home" : "/user/login"}
        >
          <span>CRUD Auth System</span>
          <small className="text-white-50 fw-normal">Spring Boot + React + MySQL</small>
        </NavLink>

        <button
          className="navbar-toggler border-0"
          type="button"
          aria-controls="mainNavbar"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
          onClick={handleToggle}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`navbar-collapse ${menuOpen ? "d-block" : "d-none"} d-lg-flex`} id="mainNavbar">
          <div className="navbar-nav mx-auto my-3 my-lg-0 gap-lg-2">
            {isAuthenticated && (
              <NavLink className={navLinkStyle} to="/user/home" onClick={handleCloseMenu}>
                Home
              </NavLink>
            )}
           
          </div>

          <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-2">
            {isAuthenticated && (
              <span className="text-white-50 small text-start text-lg-end">
                Signed in as <span className="text-white fw-semibold">{user?.username || user?.name || "User"}</span>
              </span>
            )}

            {isAuthenticated ? (
              <Logout className="btn btn-light text-primary fw-semibold px-3 rounded-pill" />
            ) : (
              <NavLink
                className="btn btn-light text-primary fw-semibold px-3 rounded-pill"
                to="/user/login"
                onClick={handleCloseMenu}
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
