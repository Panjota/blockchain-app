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
        <h1>Blockchain App</h1>
        <nav>
          <ul>
            {isAuthenticated ? (
              <>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/network-stats">Status da rede</Link></li>
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
                <li><Link to="/register">Registro</Link></li>
              </>
            )}
          </ul>
        </nav>
      </header>
      <main>
        <section>
          <h2>Sobre o app</h2>
          <p>
            Este aplicativo permite que os usuários se registrem, façam login e transfiram fundos
            usando uma infraestrutura blockchain local.
          </p>
          {isAuthenticated && user && (
            <div className="user-info">
              <h3>Bem vindo, <strong>{user.username}</strong>!</h3>
              <p>Login realizado com sucesso</p>
              <Link to="/dashboard" className="dashboard-link">
                Vá para o Dashboard
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