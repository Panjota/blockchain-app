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