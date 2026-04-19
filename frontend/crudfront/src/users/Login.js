import axios from "axios";
import React, {useEffect, useState} from "react";
import Popup from 'reactjs-popup';
import { Link, useNavigate } from "react-router-dom";
import 'reactjs-popup/dist/index.css';
import api from "../api/api";
import { useDispatch,useSelector } from "react-redux";
import PopupSmallInfo from "../layout/PopupSmallInfo";
import { setUserAuth,clearUserAuth } from '../redux/authSlice';

export default function Login() {
    let navigate = useNavigate();

    const dispatch = useDispatch();
    const userData = useSelector((state) => state.user.user);

    const [alert, setAlert] = useState(null);

    const [user, setUser] = useState({
        username: "",
        password: ""
    });

    const { username, password } = user;

    useEffect(() => {
        console.log("useEffect ran");
        fetchCurrentUser()
            .then((data) => {
                dispatch(setUserAuth(data));
            })
            .catch(() => {
                dispatch(clearUserAuth());
            });
    }, []);

    const onInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

     const fetchCurrentUser = async () => {
        const response = await api.get("/user/me", {
            withCredentials: true
        });
        return response.data;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try{
            setAlert({ message: "Login Successful!", type: "success" });
            await api.post("/public/login", user, {
                withCredentials: true
            });
            await api.get("/csrf");

            const meResponse = await api.get("/user/me", {
                withCredentials: true
            });

            dispatch(setUserAuth(meResponse.data));

            setAlert({ message: "Login Successful!", type: "success" });

            setTimeout(() => {
                navigate("/user/home");
            }, 4000);
        }
        catch (e) {
            setAlert({ message: "Invalid username or password", type: "error" });
        }

    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">Login User</h2>

                    <form onSubmit={(e) => onSubmit(e)} method="post">
                        <div className="mb-3">
                            <label htmlFor="Username" className="form-label">
                                Username
                            </label>
                            <input
                                type={"text"}
                                className="form-control"
                                placeholder="Enter your username"
                                name="username"
                                value={username}
                                onChange={(e) => onInputChange(e)}
                            />

                </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                type={"password"}
                                className="form-control"
                                placeholder="Enter your password"
                                name="password"
                                value={password}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div>
                            <button type="submit" className="btn btn-outline-primary">
                                Submit
                            </button>

                            <Link className="btn btn-outline-danger mx-2" to="/user/home">
                                Cancel
                            </Link>
                            <br/>
                            <br/>
                            <div>
                                <Link className="btn btn-outline-info mx-2" to="/user/signup">
                                    Don't have a account please sign up.
                                </Link>
                            </div>

                        </div>
                    </form>

                    {/* <Popup trigger={<button> Trigger</button>} position="right center">
                        <div>Popup content here !!</div>
                    </Popup> */}
                </div>
            </div>
            {alert && (
                <PopupSmallInfo
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}

        </div>
    );
}
