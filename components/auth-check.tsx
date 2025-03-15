"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface AuthCheckProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
}

export function AuthCheck({
  children,
  fallback = (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  ),
  redirectTo = "/auth",
}: AuthCheckProps) {
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const [devModeUser, setDevModeUser] = useState<{ uid: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check for development mode user (keeping for backward compatibility)
    const devUserId = typeof window !== "undefined" ? localStorage.getItem("devModeUserId") : null

    if (devUserId) {
      // Create a mock user object with the necessary properties
      setDevModeUser({ uid: devUserId } as any)
      return
    }

    // Regular Firebase auth check
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)

      // If no user and redirectTo is provided, redirect
      if (user === null && redirectTo) {
        router.push(redirectTo)
      }
    })

    return () => unsubscribe()
  }, [redirectTo, router])

  // Show loading state while checking auth
  if (user === undefined && !devModeUser) {
    return fallback
  }

  // If no user and we're still on this page (no redirect happened yet)
  if (!user && !devModeUser) {
    return null
  }

  // User is authenticated, render children
  return <>{children}</>
}

