import axios from 'axios';
import { TransferRequest, ApiResponse } from '../types';

const API_BASE_URL = '/api';

export const walletService = {
  async transferFunds(transferData: TransferRequest): Promise<ApiResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/transfer`, transferData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Transfer failed');
    }
  },

  async getBalance(username: string): Promise<number> {
    try {
      const response = await axios.get(`${API_BASE_URL}/balance/${username}`);
      return response.data.balance;
    } catch (error: any) {
      console.error('Error fetching balance:', error);
      return 0;
    }
  },

  async getNetworkStats(): Promise<any> {
    try {
      const response = await axios.get(`${API_BASE_URL}/network/stats`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching network stats:', error);
      return null;
    }
  },

  async getTransactionHistory(username: string): Promise<any[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/transactions/${username}`);
      const data = response.data;
      
      // Format transactions for display
      return data.transactions.map((transaction: any) => ({
        ...transaction,
        date: new Date(transaction.timestamp * 1000).toLocaleString(),
        formattedAmount: transaction.amount.toFixed(2)
      }));
    } catch (error: any) {
      console.error('Error fetching transaction history:', error);
      return [];
    }
  }
};