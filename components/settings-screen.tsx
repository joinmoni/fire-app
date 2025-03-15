"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CurrencySelector } from "@/components/currency-selector";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Settings, Check } from "lucide-react";
import { CurrencyProvider, useCurrency } from "@/lib/currency-context";

function SettingsContent() {
  const { currency, setCurrency } = useCurrency();
  const [saveStatus, setSaveStatus] = useState("");

  // Handle currency change
  const handleCurrencyChange = async (newCurrency) => {
    try {
      setSaveStatus("Saving...");
      await setCurrency(newCurrency);
      setSaveStatus("Currency preference saved successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveStatus("");
      }, 3000);
    } catch (error) {
      console.error("Error saving currency preference:", error);
      setSaveStatus("Failed to save currency preference. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <Settings className="mr-2 h-6 w-6" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your account preferences
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Currency Preferences</CardTitle>
            <CardDescription>
              Select your preferred currency for financial calculations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Currency</label>
              <div className="flex items-center gap-4">
                <CurrencySelector onValueChange={handleCurrencyChange} />
                {currency && (
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Check className="h-4 w-4 mr-1 text-green-500" />
                    Current: {currency}
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                This will be used for all financial calculations and displays
                across the app
              </p>
            </div>

            {saveStatus && (
              <Alert
                className={`mt-4 ${
                  saveStatus.includes("Failed")
                    ? "bg-destructive/15"
                    : "bg-moni-green/20 text-moni-darkGreen"
                }`}
              >
                <AlertDescription>{saveStatus}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function SettingsScreen({ userId }) {
  return (
    <CurrencyProvider userId={userId}>
      <SettingsContent />
    </CurrencyProvider>
  );
}
