import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

export default function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const { name, username, email } = user;

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

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

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      await api.put(`/user/updateUser/${id}`, user, {
        withCredentials: true,
      });
      navigate("/user/home");
    } catch (e) {
      setError("Unable to update user. Please try again.");
      setSaving(false);
    }
  };

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
              <p className="text-white-50 mb-1">User Management</p>
              <h2 className="fw-bold mb-0">Edit User</h2>
            </div>

            <div className="card-body p-4">
              {loading && <div className="alert alert-info mb-0">Loading user details...</div>}

              {!loading && error && <div className="alert alert-danger">{error}</div>}

              {!loading && (
                <form onSubmit={onSubmit} className="text-start">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label fw-semibold">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="form-control form-control-lg"
                      placeholder="Enter your name"
                      name="name"
                      value={name}
                      onChange={onInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="username" className="form-label fw-semibold">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      className="form-control form-control-lg"
                      placeholder="Enter your username"
                      name="username"
                      value={username}
                      onChange={onInputChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="form-label fw-semibold">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="form-control form-control-lg"
                      placeholder="Enter your email address"
                      name="email"
                      value={email}
                      onChange={onInputChange}
                      required
                    />
                  </div>

                  <div className="d-flex flex-column flex-sm-row justify-content-end gap-2">
                    <Link className="btn btn-outline-secondary rounded-pill px-4" to="/user/home">
                      Cancel
                    </Link>
                    <button type="submit" className="btn btn-primary rounded-pill px-4" disabled={saving}>
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
