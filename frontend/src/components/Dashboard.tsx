import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { walletService } from '../services/wallet';
import { TransferRequest, TransactionHistory } from '../types';

export const Dashboard: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<TransactionHistory[]>([]);
  const [transferData, setTransferData] = useState<TransferRequest>({
    sender: '',
    recipient: '',
    amount: 0
  });
  const [transferMessage, setTransferMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { user, logout } = useAuth();

  useEffect(() => {
    if (user) {
      setTransferData(prev => ({ ...prev, sender: user.username }));
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    try {
      const userBalance = await walletService.getBalance(user.username);
      const userTransactions = await walletService.getTransactionHistory(user.username);
      setBalance(userBalance);
      setTransactions(userTransactions);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleTransferChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTransferData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTransferMessage('');

    // Validate that user is not sending to themselves
    if (transferData.sender === transferData.recipient) {
      setTransferMessage('Error: Cannot send transaction to yourself');
      setLoading(false);
      return;
    }

    try {
      await walletService.transferFunds(transferData);
      setTransferMessage('Transfer successful!');
      setTransferData(prev => ({ ...prev, recipient: '', amount: 0 }));
      await loadUserData(); // Reload balance and transactions
    } catch (error: any) {
      setTransferMessage(`Transfer failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return <div>Please log in to access the dashboard.</div>;
  }

  return (
    <div className="dashboard">
      <header>
        <h1>Welcome to Your Dashboard</h1>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/network-stats">Network Stats</Link></li>
            <li>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </header>
      
      <main>
        <section id="balance" className="dashboard-section">
          <h2>Your Balance</h2>
          <p className="balance-amount">${balance.toFixed(2)}</p>
        </section>



        <section id="transactions" className="dashboard-section">
          <h2>Transaction History ({transactions.length})</h2>
          
          {/* Transaction Statistics */}
          <div className="transaction-stats">
            <div className="stat-item">
              <span className="stat-label">Total Transactions:</span>
              <span className="stat-value confirmed">{transactions.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Sent:</span>
              <span className="stat-value">
                {transactions.filter(t => t.type === 'sent').length}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Received:</span>
              <span className="stat-value">
                {transactions.filter(t => t.type === 'received').length}
              </span>
            </div>
          </div>
          
          {transactions.length === 0 ? (
            <p>No transactions yet.</p>
          ) : (
            <div className="transaction-list">
              {transactions.map((transaction, index) => (
                <div key={`${transaction.hash}-${index}`} className={`transaction-item ${transaction.type}`}>
                  <div className="transaction-header">
                    <span className={`transaction-type ${transaction.type}`}>
                      {transaction.type === 'sent' ? '📤 Sent' : '📥 Received'}
                    </span>
                    <span className="transaction-amount">
                      {transaction.type === 'sent' ? '-' : '+'}${transaction.formattedAmount || transaction.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="transaction-details">
                    <div className="transaction-row">
                      <span className="label">From:</span>
                      <span className="value">{transaction.sender}</span>
                    </div>
                    <div className="transaction-row">
                      <span className="label">To:</span>
                      <span className="value">{transaction.recipient}</span>
                    </div>
                    <div className="transaction-row">
                      <span className="label">Date:</span>
                      <span className="value">{transaction.date || new Date(transaction.timestamp * 1000).toLocaleString()}</span>
                    </div>
                    <div className="transaction-row">
                      <span className="label">Block:</span>
                      <span className="value confirmed">
                        ✅ #{transaction.block_index}
                      </span>
                    </div>
                    {transaction.hash && (
                      <div className="transaction-row">
                        <span className="label">Hash:</span>
                        <span className="value hash">{transaction.hash.substring(0, 16)}...</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section id="transfer" className="dashboard-section">
          <h2>Transfer Funds</h2>
          <form onSubmit={handleTransferSubmit} className="transfer-form">
            <div className="form-group">
              <label htmlFor="recipient">Recipient:</label>
              <input
                type="text"
                id="recipient"
                name="recipient"
                value={transferData.recipient}
                onChange={handleTransferChange}
                className={transferData.recipient === transferData.sender ? 'error' : ''}
                required
              />
              {transferData.recipient === transferData.sender && transferData.recipient && (
                <small className="error-text">⚠️ Cannot send to yourself</small>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="amount">Amount:</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={transferData.amount || ''}
                onChange={handleTransferChange}
                min="0.01"
                step="0.01"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading || transferData.recipient === transferData.sender}
            >
              {loading ? 'Processing...' : 
               transferData.recipient === transferData.sender ? 'Cannot send to yourself' : 'Transfer'}
            </button>
          </form>
          {transferMessage && (
            <div className={`transfer-message ${transferMessage.includes('successful') ? 'success' : 'error'}`}>
              {transferMessage}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};