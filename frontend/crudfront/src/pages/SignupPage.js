import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import PopupSmallInfo from "../layout/PopupSmallInfo";

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
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
      await api.post("/public/signup", form);
      setAlert({ message: "Account created successfully.", type: "success" });
      setTimeout(() => navigate("/user/login"), 1400);
    } catch (error) {
      setAlert({ message: "Unable to create account. Please try again.", type: "error" });
    }
  };

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh" }}>
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "86vh" }}>
        <Row className="w-100">
          <Col md={6} className="d-none d-md-flex flex-column justify-content-center text-white">
            <h1 className="fw-bold">CRUD Auth System</h1>
            <p className="">
              Register a new account using the same polished React Bootstrap UI.
            </p>
          </Col>

          <Col md={6}>
            <Card style={{ background: "#020617", border: "1px solid #1e293b", borderRadius: "15px" }}>
              <Card.Body className="p-4 text-white">
                <h3 className="text-center mb-3">Sign Up</h3>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      style={{ background: "#020617", color: "grey", border: "1px solid #334155" }}
                    />
                  </Form.Group>

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
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter email"
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
                    Create Account
                  </Button>
                </Form>

                <p className="text-center mt-3">
                  Already have an account?{' '}
                  <Link to="/user/login" style={{ color: "#38bdf8" }}>
                    Login
                  </Link>
                </p>
              </Card.Body>
            </Card>

            {alert && (
              <div className="mt-3">
                <PopupSmallInfo message={alert.message} type={alert.type} onClose={() => setAlert(null)} />
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
