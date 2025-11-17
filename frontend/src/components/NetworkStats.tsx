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
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [lastKnownBlock, setLastKnownBlock] = useState(0);
  const { logout } = useAuth();

  useEffect(() => {
    loadNetworkStats();
    
    // Set up polling to check for updates every 5 seconds
    const pollInterval = setInterval(async () => {
      try {
        const updateCheck = await walletService.checkNetworkUpdates(lastKnownBlock);
        if (updateCheck.has_updates) {
          console.log('New blocks detected, refreshing stats...');
          refreshNetworkStats();
        }
      } catch (error) {
        console.error('Error checking for updates:', error);
      }
    }, 5000);

    // Set up auto-refresh every 30 seconds as backup
    const refreshInterval = setInterval(() => {
      console.log('Performing scheduled refresh...');
      refreshNetworkStats();
    }, 30000);

    return () => {
      clearInterval(pollInterval);
      clearInterval(refreshInterval);
    };
  }, []); // Remove dependency on lastKnownBlock to avoid recreation

  const loadNetworkStats = async () => {
    try {
      const networkStats = await walletService.getNetworkStats();
      setStats(networkStats);
      setLastUpdated(new Date());
      setLastKnownBlock(networkStats?.total_blocks || 0);
    } catch (error) {
      console.error('Error loading network stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshNetworkStats = async () => {
    setRefreshing(true);
    try {
      const networkStats = await walletService.getNetworkStats();
      setStats(networkStats);
      setLastUpdated(new Date());
      setLastKnownBlock(networkStats?.total_blocks || 0);
    } catch (error) {
      console.error('Error refreshing network stats:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    refreshNetworkStats();
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
        <div className="header-content">
          <h1>Estatísticas da Rede Blockchain</h1>
          <div className="refresh-controls">
            <button 
              onClick={handleManualRefresh}
              disabled={refreshing}
              className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
              title="Atualizar estatísticas"
            >
              {refreshing ? 'Atualizando...' : 'Atualizar'}
            </button>
            {lastUpdated && (
              <span className="last-updated">
                Última atualização: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
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