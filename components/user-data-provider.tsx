"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { isFirstLogin } from "@/lib/firestore"

// Create context for user data
type UserDataContextType = {
  userId: string
  isFirstLogin: boolean
  isLoading: boolean
}

const UserDataContext = createContext<UserDataContextType | null>(null)

export function useUserData() {
  const context = useContext(UserDataContext)
  if (!context) {
    throw new Error("useUserData must be used within a UserDataProvider")
  }
  return context
}

interface UserDataProviderProps {
  userId: string
  children: React.ReactNode
  checkFirstLogin?: boolean
  redirectOnFirstLogin?: boolean
}

export function UserDataProvider({
  userId,
  children,
  checkFirstLogin = false,
  redirectOnFirstLogin = false,
}: UserDataProviderProps) {
  const [firstLoginState, setFirstLoginState] = useState(false)
  const [loading, setLoading] = useState(checkFirstLogin)
  const router = useRouter()

  useEffect(() => {
    if (checkFirstLogin) {
      const checkLoginStatus = async () => {
        try {
          const isFirst = await isFirstLogin(userId)
          setFirstLoginState(isFirst)

          if (isFirst && redirectOnFirstLogin) {
            router.push("/welcome")
          }
        } catch (error) {
          console.error("Error checking first login status:", error)
        } finally {
          setLoading(false)
        }
      }

      checkLoginStatus()
    }
  }, [userId, checkFirstLogin, redirectOnFirstLogin, router])

  return (
    <UserDataContext.Provider value={{ userId, isFirstLogin: firstLoginState, isLoading: loading }}>
      {children}
    </UserDataContext.Provider>
  )
}

