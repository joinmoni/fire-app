"use client"

import { useState, useEffect } from "react"
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "@/components/ui/chart"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"
import { useCurrency } from "@/lib/currency-context"

export function FirePrediction({ data }) {
  const { formatCurrency, currency } = useCurrency()
  const [projectionData, setProjectionData] = useState([])
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    // Calculate projection data
    const projectionResults = calculateFireProjection(data)
    setProjectionData(projectionResults.projectionData)
    setRecommendations(projectionResults.recommendations)
  }, [data, currency])

  return (
    <div className="space-y-6">
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={projectionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" label={{ value: "Age", position: "insideBottomRight", offset: 0 }} />
            <YAxis
              tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
              label={{ value: `Net Worth (Millions)`, angle: -90, position: "insideLeft" }}
            />
            <Tooltip formatter={(value) => formatCurrency(value)} labelFormatter={(value) => `Age: ${value}`} />
            <Legend />
            <Line type="monotone" dataKey="netWorth" name="Projected Net Worth" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="fiTarget" name="FI Target" stroke="#82ca9d" strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {recommendations.length > 0 && (
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>FIRE Recommendations</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

function calculateFireProjection(data) {
  // Extract data
  const currentAge = data.goals.currentAge || 30
  const targetAge = data.goals.targetRetirementAge || 55
  const yearsToRetirement = Math.max(0, targetAge - currentAge)

  // Financial data
  const totalIncome = data.income.salary + data.income.investments + data.income.sideHustle + data.income.other
  const totalExpenses =
    data.expenses.housing +
    data.expenses.transportation +
    data.expenses.food +
    data.expenses.utilities +
    data.expenses.healthcare +
    data.expenses.entertainment +
    data.expenses.other
  const totalAssets =
    data.assets.cash + data.assets.investments + data.assets.retirement + data.assets.realEstate + data.assets.other
  const totalLiabilities =
    data.liabilities.mortgage +
    data.liabilities.carLoan +
    data.liabilities.studentLoans +
    data.liabilities.creditCards +
    data.liabilities.other
  const netWorth = totalAssets - totalLiabilities
  const monthlySavings = totalIncome - totalExpenses
  const annualSavings = monthlySavings * 12

  // FIRE target
  const fiNumber = data.goals.targetAnnualExpenses * (100 / data.goals.targetWithdrawalRate)

  // Assumptions
  const annualReturnRate = 0.08 // 8% annual return
  const inflationRate = 0.05 // 5% annual inflation

  // Generate projection data
  const projectionData = []
  let currentNetWorth = netWorth
  let currentSavings = annualSavings

  for (let year = 0; year <= yearsToRetirement; year++) {
    const age = currentAge + year

    // Add data point
    projectionData.push({
      year: age,
      netWorth: currentNetWorth,
      fiTarget: fiNumber,
    })

    // Update for next year
    currentNetWorth = currentNetWorth * (1 + annualReturnRate) + currentSavings
    currentSavings = currentSavings * (1 + inflationRate) // Assume savings increase with inflation
  }

  // Generate recommendations
  const recommendations = []

  // Check if on track for FIRE
  const finalNetWorth = projectionData[projectionData.length - 1].netWorth
  const fireDeficit = fiNumber - finalNetWorth

  if (fireDeficit > 0) {
    // If not on track, provide recommendations
    const additionalMonthlySavingsNeeded = calculateRequiredMonthlySavings(
      currentNetWorth,
      fiNumber,
      yearsToRetirement,
      annualReturnRate,
    )

    recommendations.push(
      `You need to save an additional ${formatMoney(additionalMonthlySavingsNeeded)} monthly to reach your FIRE goal by age ${targetAge}.`,
    )

    // Suggest expense reduction if possible
    if (totalExpenses > 0) {
      const expenseReductionTarget = Math.min(totalExpenses * 0.1, additionalMonthlySavingsNeeded)
      recommendations.push(
        `Consider reducing your monthly expenses by ${formatMoney(expenseReductionTarget)} (${((expenseReductionTarget / totalExpenses) * 100).toFixed(1)}% of current expenses).`,
      )
    }

    // Suggest income increase
    recommendations.push(
      `Look for ways to increase your income by ${formatMoney(additionalMonthlySavingsNeeded)} monthly through side hustles, career advancement, or passive income.`,
    )
  } else {
    recommendations.push(`You're on track to reach financial independence by age ${targetAge}!`)

    // If significantly ahead of target
    if (finalNetWorth > fiNumber * 1.2) {
      const yearsEarly = calculateYearsToFI(netWorth, fiNumber, annualSavings, annualReturnRate)
      if (yearsEarly < yearsToRetirement) {
        recommendations.push(
          `You might be able to retire ${yearsToRetirement - yearsEarly} years earlier than planned.`,
        )
      }
    }
  }

  // Always recommend diversification
  recommendations.push(
    `Ensure your investments are properly diversified to manage risk while targeting ${(annualReturnRate * 100).toFixed(0)}% annual returns.`,
  )

  return {
    projectionData,
    recommendations,
  }
}

// Helper function to format money values in recommendations
function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value)
}

// Calculate years to reach financial independence
function calculateYearsToFI(currentNetWorth, targetAmount, annualSavings, annualReturnRate) {
  // If already at target
  if (currentNetWorth >= targetAmount) return 0

  // If no savings and no returns
  if (annualSavings <= 0 && annualReturnRate <= 0) return Number.POSITIVE_INFINITY

  let years = 0
  let netWorth = currentNetWorth

  while (netWorth < targetAmount && years < 100) {
    netWorth = netWorth * (1 + annualReturnRate) + annualSavings
    years++
  }

  return years
}

// Calculate the required monthly savings to reach FIRE
function calculateRequiredMonthlySavings(currentNetWorth, targetAmount, yearsToRetirement, annualReturnRate) {
  if (yearsToRetirement <= 0) return 0

  // Convert years to months
  const months = yearsToRetirement * 12

  // Convert annual return rate to monthly
  const monthlyReturnRate = Math.pow(1 + annualReturnRate, 1 / 12) - 1

  // Calculate future value of current investments
  const futureValueOfCurrentInvestments = currentNetWorth * Math.pow(1 + monthlyReturnRate, months)

  // Calculate amount needed beyond growth of current investments
  const additionalAmountNeeded = Math.max(0, targetAmount - futureValueOfCurrentInvestments)

  // Calculate monthly payment required using PMT formula
  if (monthlyReturnRate === 0) {
    return additionalAmountNeeded / months
  }

  const monthlyPayment =
    (additionalAmountNeeded * (monthlyReturnRate * Math.pow(1 + monthlyReturnRate, months))) /
    (Math.pow(1 + monthlyReturnRate, months) - 1)

  return Math.max(0, monthlyPayment)
}

