"use client"

import { useState, useEffect } from "react"
import { authManager, type AuthState } from "@/lib/auth"

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(authManager.getState())

  useEffect(() => {
    const unsubscribe = authManager.subscribe(setAuthState)
    return unsubscribe
  }, [])

  return {
    ...authState,
    login: authManager.login.bind(authManager),
    selectAirport: authManager.selectAirport.bind(authManager),
    logout: authManager.logout.bind(authManager),
  }
}
