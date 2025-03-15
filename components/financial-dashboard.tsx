"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardTabs } from "@/components/dashboard-tabs"
import { DataEntryForm } from "@/components/data-entry-form"
import { DashboardCharts } from "@/components/dashboard-charts"
import { DashboardSummary } from "@/components/dashboard-summary"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  getUserFinancialData,
  updateUserFinancialData,
  defaultFinancialData,
  updateFirstLoginStatus,
} from "@/lib/firestore"
import { CurrencyProvider } from "@/lib/currency-context"

export function FinancialDashboard({ userId }) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [financialData, setFinancialData] = useState(defaultFinancialData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [saveStatus, setSaveStatus] = useState("")
  const router = useRouter()

  // Load user data from Firestore
  useEffect(() => {
    async function loadUserData() {
      if (!userId) return

      try {
        setLoading(true)

        // Check if we're in development mode
        const isDevMode = userId.startsWith("dev-user-")

        let data
        if (isDevMode) {
          // For development mode, check if we have saved data in localStorage
          const savedData = localStorage.getItem(`devModeData-${userId}`)
          data = savedData ? JSON.parse(savedData) : defaultFinancialData
        } else {
          // Regular Firestore data loading
          data = await getUserFinancialData(userId)
        }

        setFinancialData(data)

        // Update first login status if needed
        if (data.profile?.isFirstLogin && !isDevMode) {
          await updateFirstLoginStatus(userId, false)
        }
      } catch (err) {
        console.error("Error loading user data:", err)
        setError("Failed to load your financial data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [userId])

  // Handle data update
  const handleDataUpdate = async (newData) => {
    try {
      setSaveStatus("Saving...")
      const updatedData = { ...financialData, ...newData }
      setFinancialData(updatedData)

      // Check if we're in development mode
      const isDevMode = userId.startsWith("dev-user-")

      if (isDevMode) {
        // For development mode, save to localStorage
        localStorage.setItem(`devModeData-${userId}`, JSON.stringify(updatedData))
      } else {
        // Save to Firestore
        await updateUserFinancialData(userId, updatedData)
      }

      setSaveStatus("Saved successfully!")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveStatus("")
      }, 3000)
    } catch (err) {
      console.error("Error updating data:", err)
      setSaveStatus("Failed to save. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <CurrencyProvider userId={userId}>
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader userId={userId} />
        <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {saveStatus && (
          <Alert
            className={`mt-4 ${saveStatus.includes("Failed") ? "bg-destructive/15" : "bg-moni-green/20 text-moni-darkGreen"}`}
          >
            <AlertDescription>{saveStatus}</AlertDescription>
          </Alert>
        )}

        <div className="mt-6">
          {activeTab === "data-entry" ? (
            <DataEntryForm data={financialData} onUpdate={handleDataUpdate} />
          ) : activeTab === "dashboard" ? (
            <>
              <DashboardSummary data={financialData} />
              <DashboardCharts data={financialData} />
            </>
          ) : null}
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            onClick={() => router.push("/fire-calculator")}
            className="border-moni-darkGreen text-moni-darkGreen hover:bg-moni-green/20"
          >
            Quick FIRE Calculator
          </Button>
        </div>
      </div>
    </CurrencyProvider>
  )
}

