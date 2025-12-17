/**
 * Admin model
 * Represents an admin user with authentication information
 */

export interface Admin {
  id: string;
  username: string;
  email: string;
}

export interface AdminCredentials {
  username: string;
  password: string;
}

export interface AdminSession {
  admin: Admin;
  token: string;
  expiresAt: number;
}
