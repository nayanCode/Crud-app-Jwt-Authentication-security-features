import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/api";

export default function ViewUser() {
  const { id } = useParams();
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError("");
        const result = await api.get(`/user/${id}`, {
          withCredentials: true,
        });
        setUser(result.data);
      } catch (e) {
        setError("Unable to load user details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-7 col-md-9">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div
              className="card-header text-white p-4"
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)",
              }}
            >
              <p className="mb-1 text-white-50">User Profile</p>
              <h2 className="mb-0 fw-bold">{loading ? "Loading..." : user.name || "User Details"}</h2>
            </div>

            <div className="card-body p-4">
              {loading && <div className="alert alert-info mb-0">Loading user details...</div>}

              {!loading && error && <div className="alert alert-danger mb-0">{error}</div>}

              {!loading && !error && (
                <>
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                      style={{
                        width: "64px",
                        height: "64px",
                        background: "#2563eb",
                        fontSize: "1.5rem",
                      }}
                    >
                      {(user.name || user.username || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="text-start">
                      <h4 className="mb-1">{user.name}</h4>
                      <p className="text-muted mb-0">User ID: {user.id}</p>
                    </div>
                  </div>

                  <div className="list-group list-group-flush text-start">
                    <div className="list-group-item px-0 d-flex justify-content-between gap-3">
                      <span className="fw-semibold text-muted">Name</span>
                      <span>{user.name}</span>
                    </div>
                    <div className="list-group-item px-0 d-flex justify-content-between gap-3">
                      <span className="fw-semibold text-muted">Username</span>
                      <span>{user.username}</span>
                    </div>
                    <div className="list-group-item px-0 d-flex justify-content-between gap-3">
                      <span className="fw-semibold text-muted">Email</span>
                      <span>{user.email}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="card-footer bg-white border-0 p-4 d-flex flex-column flex-sm-row gap-2 justify-content-end">
              <Link className="btn btn-outline-secondary rounded-pill px-4" to="/user/home">
                Back to Home
              </Link>
              {!loading && !error && (
                <Link className="btn btn-primary rounded-pill px-4" to={`/user/edituser/${id}`}>
                  Edit User
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
