import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { walletService } from '../services/wallet';
import { TransferRequest, Transaction } from '../types';

export const Dashboard: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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

    try {
      const response = await walletService.transferFunds(transferData);
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
          <h2>Transaction History</h2>
          {transactions.length === 0 ? (
            <p>No transactions yet.</p>
          ) : (
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Sender</th>
                  <th>Recipient</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={index}>
                    <td>{transaction.date || 'N/A'}</td>
                    <td>{transaction.sender}</td>
                    <td>{transaction.recipient}</td>
                    <td>${transaction.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                required
              />
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
            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Transfer'}
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