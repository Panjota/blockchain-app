import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Home: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="home">
      <header>
        <h1>Welcome to the Blockchain App</h1>
        <nav>
          <ul>
            {isAuthenticated ? (
              <>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/network-stats">Network Stats</Link></li>
                <li>
                  <button 
                    onClick={handleLogout}
                    className="logout-btn"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </>
            )}
          </ul>
        </nav>
      </header>
      <main>
        <section>
          <h2>About the App</h2>
          <p>
            This application allows users to register, log in, and transfer funds 
            using a local blockchain infrastructure.
          </p>
          {isAuthenticated && user && (
            <div className="user-info">
              <h3>Welcome back, <strong>{user.username}</strong>!</h3>
              <p>You are successfully logged in.</p>
              <Link to="/dashboard" className="dashboard-link">
                Go to Dashboard
              </Link>
            </div>
          )}
        </section>
      </main>
      <footer>
        <p>&copy; 2023 Blockchain App</p>
      </footer>
    </div>
  );
};