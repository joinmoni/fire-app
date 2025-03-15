"use client"

import { useEffect, useState } from "react"
import { FireCalculator } from "@/components/fire-calculator"
import { MoniLayout } from "@/components/moni-layout"
import { CurrencyProvider } from "@/lib/currency-context"
import { auth } from "@/lib/firebase"

export function FireCalculatorWrapper() {
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
      <CurrencyProvider userId={userId}>
        <FireCalculator userId={userId} />
      </CurrencyProvider>
    </MoniLayout>
  )
}

