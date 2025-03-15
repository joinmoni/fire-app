"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export type Currency = "NGN" | "GBP" | "EUR" | "USD"

export interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => Promise<void>
  formatCurrency: (value: number) => string
  currencySymbol: string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export const currencySymbols: Record<Currency, string> = {
  NGN: "₦",
  GBP: "£",
  EUR: "€",
  USD: "$",
}

export function CurrencyProvider({ children, userId }: { children: React.ReactNode; userId?: string }) {
  const [currency, setCurrencyState] = useState<Currency>("NGN")

  // Load user's preferred currency from Firestore
  useEffect(() => {
    async function loadCurrencyPreference() {
      if (!userId) return

      try {
        // Check if we're in development mode
        const isDevMode = userId.startsWith("dev-user-")

        if (isDevMode) {
          // For development mode, just use the default currency
          return
        }

        const docRef = doc(db, "users", userId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists() && docSnap.data().currency) {
          setCurrencyState(docSnap.data().currency as Currency)
        }
      } catch (error) {
        console.error("Error loading currency preference:", error)
      }
    }

    loadCurrencyPreference()
  }, [userId])

  // Update currency preference in Firestore
  const setCurrency = async (newCurrency: Currency) => {
    setCurrencyState(newCurrency)

    if (userId) {
      try {
        // Check if we're in development mode
        const isDevMode = userId.startsWith("dev-user-")

        if (isDevMode) {
          // For development mode, just store in localStorage
          localStorage.setItem("devModeCurrency", newCurrency)
          return
        }

        const docRef = doc(db, "users", userId)
        await updateDoc(docRef, { currency: newCurrency })
      } catch (error) {
        console.error("Error updating currency preference:", error)
      }
    }
  }

  // Format currency based on the selected currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(getCurrencyLocale(currency), {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatCurrency,
        currencySymbol: currencySymbols[currency],
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}

// Helper function to get the locale for a currency
function getCurrencyLocale(currency: Currency): string {
  switch (currency) {
    case "NGN":
      return "en-NG"
    case "GBP":
      return "en-GB"
    case "EUR":
      return "de-DE"
    case "USD":
      return "en-US"
    default:
      return "en-US"
  }
}

