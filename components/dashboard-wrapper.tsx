"use client"

import { useEffect, useState } from "react"
import { FinancialDashboard } from "@/components/financial-dashboard"
import { MoniLayout } from "@/components/moni-layout"
import { auth } from "@/lib/firebase"

export function DashboardWrapper() {
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
      <FinancialDashboard userId={userId} />
    </MoniLayout>
  )
}

