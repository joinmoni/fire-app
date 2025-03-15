"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Wallet, DollarSign, PiggyBank, Clock, Target } from "lucide-react"
import { useCurrency } from "@/lib/currency-context"

export function DashboardSummary({ data }) {
  const { formatCurrency } = useCurrency()

  // Calculate summary metrics
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

  // Calculate FIRE metrics
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0
  const fiNumber = data.goals.targetAnnualExpenses * (100 / data.goals.targetWithdrawalRate)
  const fireProgress = fiNumber > 0 ? (netWorth / fiNumber) * 100 : 0

  // Calculate years to retirement
  const currentAge = data.goals.currentAge || 30
  const targetAge = data.goals.targetRetirementAge || 55
  const yearsToRetirement = Math.max(0, targetAge - currentAge)

  // Calculate required monthly savings
  const monthlyInvestmentNeeded = calculateRequiredMonthlySavings(
    netWorth,
    fiNumber,
    yearsToRetirement,
    0.08, // Assumed annual return rate
  )

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(netWorth)}</div>
          <p className="text-xs text-muted-foreground">
            Assets: {formatCurrency(totalAssets)} | Liabilities: {formatCurrency(totalLiabilities)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Cashflow</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalIncome - totalExpenses)}</div>
          <p className="text-xs text-muted-foreground">
            Income: {formatCurrency(totalIncome)} | Expenses: {formatCurrency(totalExpenses)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
          <PiggyBank className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{savingsRate.toFixed(1)}%</div>
          <Progress value={savingsRate} className="h-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">FI Number</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(fiNumber)}</div>
          <p className="text-xs text-muted-foreground">
            Based on {formatCurrency(data.goals.targetAnnualExpenses)} annual expenses and{" "}
            {data.goals.targetWithdrawalRate}% withdrawal rate
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">FIRE Progress</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-2">
            <div className="text-2xl font-bold">{fireProgress.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">of {formatCurrency(fiNumber)}</div>
          </div>
          <Progress value={fireProgress} className="h-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">FIRE Timeline</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {yearsToRetirement} years
            <span className="text-sm font-normal text-muted-foreground ml-2">
              (Age {currentAge} → {targetAge})
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Required monthly investment: {formatCurrency(monthlyInvestmentNeeded)}
          </p>
        </CardContent>
      </Card>
    </div>
  )
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

