import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./layout/Navbar";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import EditUser from "./users/EditUser";
import ViewUser from "./users/ViewUser";
import Logout from "./layout/logout";
import { useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";
import api from "./api/api";
import {clearUserAuth, setAuthLoading, setUserAuth} from "./redux/authSlice";
import ProtectedRoute from "./pages/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";


function App() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  const restorAuth = async () => {
    dispatch(setAuthLoading(true));
    try{
      const meResponse = await api.get("/user/me", {
        withCredentials: true
      });
      dispatch(setUserAuth(meResponse.data));
    }
    catch (e) {
      dispatch(clearUserAuth());
    }
  }

  useEffect(() => {
    restorAuth();
  }, [dispatch]);

  if(loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <Router>
         <Navbar /> 
        <Routes>
          <Route path="/" element={<Navigate to="/user/login" replace />} />
          <Route exact path="/user/home" element={
            <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
          <Route exact path="/user/signup" element={<SignupPage />} />
          <Route exact path="/user/login" element={<LoginPage />} />
          <Route exact path="/user/edituser/:id" element={<EditUser />} />
          <Route exact path="/user/viewuser/:id" element={<ViewUser />} />
          <Route exact path="/user/logout" element={<Logout />} />
        </Routes>

      </Router>
    </div>
  );
}

export default App;
