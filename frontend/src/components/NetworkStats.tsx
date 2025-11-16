import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { walletService } from '../services/wallet';

interface NetworkStats {
  total_supply: number;
  total_distributed: number;
  network_reserve: number;
  active_accounts: number;
  total_blocks: number;
  pending_transactions: number;
  total_transactions: number;
}

export const NetworkStats: React.FC = () => {
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    loadNetworkStats();
  }, []);

  const loadNetworkStats = async () => {
    try {
      const networkStats = await walletService.getNetworkStats();
      setStats(networkStats);
    } catch (error) {
      console.error('Error loading network stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return <div className="loading">Loading network statistics...</div>;
  }

  return (
    <div className="network-stats">
      <header>
        <h1>Blockchain Network Statistics</h1>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        {stats ? (
          <>
            <section className="dashboard-section">
              <h2>Token Economy</h2>
              <div className="stats-grid">
                <div className="stat-item">
                  <h3>Total Supply</h3>
                  <p className="stat-value">{stats.total_supply.toLocaleString()}</p>
                </div>
                <div className="stat-item">
                  <h3>Total Distributed</h3>
                  <p className="stat-value">{stats.total_distributed.toLocaleString()}</p>
                </div>
                <div className="stat-item">
                  <h3>Network Reserve</h3>
                  <p className="stat-value">{stats.network_reserve.toLocaleString()}</p>
                </div>
                <div className="stat-item">
                  <h3>Active Accounts</h3>
                  <p className="stat-value">{stats.active_accounts}</p>
                </div>
              </div>
            </section>

            <section className="dashboard-section">
              <h2>Blockchain Statistics</h2>
              <div className="stats-grid">
                <div className="stat-item">
                  <h3>Total Blocks</h3>
                  <p className="stat-value">{stats.total_blocks}</p>
                </div>
                <div className="stat-item">
                  <h3>Total Transactions</h3>
                  <p className="stat-value">{stats.total_transactions}</p>
                </div>
                <div className="stat-item">
                  <h3>Pending Transactions</h3>
                  <p className="stat-value">{stats.pending_transactions}</p>
                </div>
                <div className="stat-item">
                  <h3>Distribution Rate</h3>
                  <p className="stat-value">
                    {((stats.total_distributed / stats.total_supply) * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            </section>
          </>
        ) : (
          <div className="error-message">
            Failed to load network statistics
          </div>
        )}
      </main>
    </div>
  );
};