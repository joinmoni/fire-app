"use client"

import { useEffect, useState } from "react"
import { WelcomeScreen } from "@/components/welcome-screen"
import { MoniLayout } from "@/components/moni-layout"
import { auth } from "@/lib/firebase"

export function WelcomeWrapper() {
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    // Get user ID from Firebase or development mode (for backward compatibility)
    const devUserId = localStorage.getItem("devModeUserId")
    if (devUserId) {
      setUserId(devUserId)
      return
    }

    if (auth.currentUser) {
      setUserId(auth.currentUser.uid)
    }
  }, [])

  if (!userId) {
    return null
  }

  return (
    <MoniLayout>
      <WelcomeScreen userId={userId} />
    </MoniLayout>
  )
}

