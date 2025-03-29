import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginLeft from "./Components/loginLeft";
import LoginRight from "./Components/loginRight";
import Bubbles from "./Components/bubbles";
import Home from "./Components/Home";
import { useAuth } from "./Contexts/auth";

const LoginPage = () => {
  return (
    <div className="login-container">
      <Bubbles />
      <LoginLeft />
      <LoginRight />
    </div>
  );
};

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
