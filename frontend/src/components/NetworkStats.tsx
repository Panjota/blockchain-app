import React, { useState, useEffect, useRef } from 'react';
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
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { logout } = useAuth();

  useEffect(() => {
    console.log('NetworkStats component mounted');
    loadNetworkStats();
    
    // Set up auto-refresh every 5 seconds for better responsiveness
    intervalRef.current = setInterval(() => {
      const now = new Date().toLocaleTimeString();
      console.log(`[${now}] Auto-refreshing network stats...`);
      refreshNetworkStats();
    }, 5000);

    return () => {
      console.log('NetworkStats component unmounting, clearing interval');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const loadNetworkStats = async () => {
    console.log('Loading initial network stats...');
    try {
      const networkStats = await walletService.getNetworkStats();
      console.log('Network stats received:', networkStats);
      
      if (networkStats) {
        setStats(networkStats);
        setLastUpdated(new Date());
        setError(null);
      } else {
        setError('No data received from server');
      }
    } catch (error: any) {
      console.error('Error loading network stats:', error);
      setError(error.message || 'Failed to load network stats');
    } finally {
      setLoading(false);
    }
  };

  const refreshNetworkStats = async () => {
    if (refreshing) {
      console.log('Already refreshing, skipping...');
      return;
    }
    
    setRefreshing(true);
    try {
      const networkStats = await walletService.getNetworkStats();
      console.log('Network stats refreshed:', networkStats);
      
      if (networkStats) {
        setStats(prevStats => {
          // Log if values changed
          if (prevStats && prevStats.total_blocks !== networkStats.total_blocks) {
            console.log(`Blocks updated: ${prevStats.total_blocks} → ${networkStats.total_blocks}`);
          }
          return networkStats;
        });
        setLastUpdated(new Date());
        setError(null);
      }
    } catch (error: any) {
      console.error('Error refreshing network stats:', error);
      setError(error.message || 'Failed to refresh network stats');
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
    return (
      <div className="loading">
        <p>Loading network statistics...</p>
        {error && <p style={{color: 'red'}}>{error}</p>}
      </div>
    );
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
              {refreshing ? '⟳ Atualizando...' : '↻ Atualizar'}
            </button>
            {lastUpdated && (
              <span className="last-updated">
                Última atualização: {lastUpdated.toLocaleTimeString()}
                {refreshing && ' (atualizando...)'}
              </span>
            )}
          </div>
          {error && (
            <div style={{color: 'red', fontSize: '14px', marginTop: '10px'}}>
              Erro: {error}
            </div>
          )}
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
                  <p className="stat-value" key={`supply-${stats.total_supply}`}>
                    {stats.total_supply.toLocaleString()}
                  </p>
                </div>
                <div className="stat-item">
                  <h3>Total Distributed</h3>
                  <p className="stat-value" key={`distributed-${stats.total_distributed}`}>
                    {stats.total_distributed.toLocaleString()}
                  </p>
                </div>
                <div className="stat-item">
                  <h3>Network Reserve</h3>
                  <p className="stat-value" key={`reserve-${stats.network_reserve}`}>
                    {stats.network_reserve.toLocaleString()}
                  </p>
                </div>
                <div className="stat-item">
                  <h3>Active Accounts</h3>
                  <p className="stat-value" key={`accounts-${stats.active_accounts}`}>
                    {stats.active_accounts}
                  </p>
                </div>
              </div>
            </section>

            <section className="dashboard-section">
              <h2>Blockchain Statistics</h2>
              <div className="stats-grid">
                <div className="stat-item">
                  <h3>Total Blocks</h3>
                  <p className="stat-value" key={`blocks-${stats.total_blocks}`} 
                     style={{color: refreshing ? '#999' : 'inherit'}}>
                    {stats.total_blocks}
                  </p>
                </div>
                <div className="stat-item">
                  <h3>Total Transactions</h3>
                  <p className="stat-value" key={`tx-${stats.total_transactions}`}
                     style={{color: refreshing ? '#999' : 'inherit'}}>
                    {stats.total_transactions}
                  </p>
                </div>
              </div>
            </section>
            
            {/* Debug info - pode remover depois */}
            <div style={{
              marginTop: '20px', 
              padding: '10px', 
              background: '#f0f0f0', 
              borderRadius: '5px',
              fontSize: '12px',
              fontFamily: 'monospace'
            }}>
              <strong>Debug Info:</strong><br/>
              Last Update: {lastUpdated?.toLocaleString()}<br/>
              Refreshing: {refreshing ? 'Yes' : 'No'}<br/>
              Auto-refresh: Every 5 seconds<br/>
              Error: {error || 'None'}
            </div>
          </>
        ) : (
          <div className="error-message">
            Failed to load network statistics
            {error && <div style={{marginTop: '10px', color: 'red'}}>{error}</div>}
          </div>
        )}
      </main>
    </div>
  );
};