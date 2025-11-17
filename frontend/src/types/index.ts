export interface User {
  id: string;
  username: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
}

export interface Transaction {
  sender: string;
  recipient: string;
  amount: number;
  date?: string;
}

export interface TransactionHistory {
  hash: string;
  sender: string;
  recipient: string;
  amount: number;
  timestamp: number;
  block_index: number;
  block_hash: string;
  type: 'sent' | 'received';
  date?: string;
  formattedAmount?: string;
}

export interface TransactionHistoryResponse {
  username: string;
  transactions: TransactionHistory[];
  total_transactions: number;
}

export interface TransferRequest {
  sender: string;
  recipient: string;
  amount: number;
}

export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  error?: string;
  data?: T;
}