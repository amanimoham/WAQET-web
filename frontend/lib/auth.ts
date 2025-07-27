"use client"

export interface User {
  id: string
  employeeNumber: string
  name: string
  organization: string
  jobTitle: string
}

export interface AuthState {
  user: User | null
  selectedAirport: string | null
  isAuthenticated: boolean
}

class AuthManager {
  private static instance: AuthManager
  private authState: AuthState = {
    user: null,
    selectedAirport: null,
    isAuthenticated: false,
  }
  private listeners: ((state: AuthState) => void)[] = []

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager()
    }
    return AuthManager.instance
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.authState))
  }

  login(user: User) {
    this.authState = {
      ...this.authState,
      user,
      isAuthenticated: true,
    }
    this.notify()
  }

  selectAirport(airport: string) {
    this.authState = {
      ...this.authState,
      selectedAirport: airport,
    }
    this.notify()
  }

  logout() {
    this.authState = {
      user: null,
      selectedAirport: null,
      isAuthenticated: false,
    }
    this.notify()
  }

  getState(): AuthState {
    return this.authState
  }
}

export const authManager = AuthManager.getInstance()

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
