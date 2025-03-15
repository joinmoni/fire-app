"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import { isFirstLogin } from "@/lib/firestore"
import { Loader2 } from "lucide-react"

export function HomeRedirect() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        // Get current user
        const user = auth.currentUser

        if (!user) {
          router.push("/auth")
          return
        }

        // Check if this is the user's first login
        const firstLogin = await isFirstLogin(user.uid)

        if (firstLogin) {
          router.push("/welcome")
        } else {
          router.push("/dashboard")
        }
      } catch (error) {
        console.error("Error during redirect:", error)
        router.push("/auth")
      } finally {
        setLoading(false)
      }
    }

    handleRedirect()
  }, [router])

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return null
}

