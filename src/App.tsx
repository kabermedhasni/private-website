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
import PrivacyPolicy from "./Components/privacyPolicy";
import TermsOfService from "./Components/termsOfServices";
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
        <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/termsOfServices" element={<TermsOfService />} />
      </Routes>
    </Router>
  );
};

export default App;
