import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError("");
        const result = await api.get("/users", {
          withCredentials: true,
        });
        setUsers(result.data);
      } catch (e) {
        setError("Unable to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const deleteUser = async (id) => {
    const shouldDelete = window.confirm("Are you sure you want to delete this user?");

    if (!shouldDelete) {
      return;
    }

    try {
      await api.delete(`/user/delete/${id}`, {
        withCredentials: true,
      });
      setUsers((currentUsers) => currentUsers.filter((user) => user.id !== id));
    } catch (e) {
      setError("Unable to delete user. Please try again.");
    }
  };

  return (
    <div className="container py-5">
      <div
        className="rounded-4 p-4 p-md-5 mb-4 text-white shadow-sm"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)",
        }}
      >
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div className="text-start">
            <p className="text-white-50 mb-1">Dashboard</p>
            <h1 className="fw-bold mb-2">User Management</h1>
            <p className="mb-0 text-white-50">View, edit, and manage registered users from one place.</p>
          </div>

          {/* <Link className="btn btn-light text-primary fw-semibold rounded-pill px-4" to="/user/signup">
            Add New User
          </Link> */}
        </div>
      </div>

      <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
        <div className="card-body p-0">
          {loading && <div className="alert alert-info m-4">Loading users...</div>}

          {!loading && error && <div className="alert alert-danger m-4">{error}</div>}

          {!loading && !error && users.length === 0 && (
            <div className="text-center p-5">
              <h4 className="fw-bold">No users found</h4>
              <p className="text-muted mb-4">Create your first user to get started.</p>
              <Link className="btn btn-primary rounded-pill px-4" to="/user/signup">
                Add User
              </Link>
            </div>
          )}

          {!loading && !error && users.length > 0 && (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="ps-4">S.N</th>
                    <th scope="col">Name</th>
                    <th scope="col">Username</th>
                    <th scope="col">Email</th>
                    <th scope="col" className="text-end pe-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id}>
                      <th scope="row" className="ps-4 text-muted">
                        {index + 1}
                      </th>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                            style={{
                              width: "42px",
                              height: "42px",
                              background: "#2563eb",
                            }}
                          >
                            {(user.name || user.username || "U").charAt(0).toUpperCase()}
                          </div>
                          <span className="fw-semibold">{user.name}</span>
                        </div>
                      </td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td className="text-end pe-4">
                        <div className="d-flex flex-column flex-lg-row justify-content-end gap-2">
                          <Link
                            className="btn btn-sm btn-primary rounded-pill px-3"
                            to={`/user/viewuser/${user.id}`}
                          >
                            View
                          </Link>
                          <Link
                            className="btn btn-sm btn-outline-primary rounded-pill px-3"
                            to={`/user/edituser/${user.id}`}
                          >
                            Edit
                          </Link>
                          <button
                            className="btn btn-sm btn-outline-danger rounded-pill px-3"
                            onClick={() => deleteUser(user.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
