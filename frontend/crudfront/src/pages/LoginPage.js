import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/api";
import { setAuthLoading, setUserAuth } from "../redux/authSlice";
import PopupSmallInfo from "../layout/PopupSmallInfo";

export default function LoginPage() {
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.user);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setAlert(null);
      dispatch(setAuthLoading(true));
      await api.post("/public/login", form, { withCredentials: true });
      await api.get("/csrf");

      const meResponse = await api.get("/user/me", { withCredentials: true });
      dispatch(setUserAuth(meResponse.data));
    } catch (e) {
      dispatch(setAuthLoading(false));
      setAlert({ message: "Invalid username or password", type: "error" });
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/user/home" replace />;
  }

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh" }}>
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "86vh" }}>
        <Row className="w-100">
          <Col md={6} className="d-none d-md-flex flex-column justify-content-center text-white">
            <h1 className="fw-bold">CRUD Auth System</h1>
            <p className="">
              Login to your account using the clean dark React Bootstrap UI.
            </p>
          </Col>

          <Col md={6}>
            <Card style={{ background: "#020617", border: "1px solid #1e293b", borderRadius: "15px" }}>
              <Card.Body className="p-4 text-white">
                <h3 className="text-center mb-3">Login</h3>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      placeholder="Enter username"
                      style={{ background: "#020617", color: "white", border: "1px solid #334155" }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      style={{ background: "#020617", color: "white", border: "1px solid #334155" }}
                    />
                  </Form.Group>

                  <Button type="submit" variant="info" className="w-100">
                    Login
                  </Button>
                </Form>

                <p className="text-center mt-3">
                  Don't have an account?{' '}
                  <Link to="/user/signup" style={{ color: "#38bdf8" }}>
                    Sign Up
                  </Link>
                </p>
              </Card.Body>
            </Card>

            {/* {alert && (
              <div className="mt-3">
                <PopupSmallInfo message={alert.message} type={alert.type} onClose={() => setAlert(null)} />
              </div>
            )} */}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
