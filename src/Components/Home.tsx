import { useAuth } from "../Contexts/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./Home.css";

const Home = () => {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <div className="home-container">
      <nav className="home-nav">
        <h1>Welcome, {currentUser?.email}</h1>
        <button onClick={handleSignOut} className="sign-out-button">
          Sign Out
        </button>
      </nav>
      <main className="home-content">
        <h2>Dashboard</h2>
        <div className="user-info">
          <p>Email: {currentUser?.email}</p>
          <p>Last Sign In: {currentUser?.metadata.lastSignInTime}</p>
        </div>
      </main>
    </div>
  );
};

export default Home;
