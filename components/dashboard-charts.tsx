"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "@/components/ui/chart"
import { FirePrediction } from "@/components/fire-prediction"
import { useCurrency } from "@/lib/currency-context"

export function DashboardCharts({ data }) {
  const { formatCurrency, currency } = useCurrency()

  // Calculate totals
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

  // Format data for charts
  const incomeData = [
    { name: "Salary", value: data.income.salary },
    { name: "Investments", value: data.income.investments },
    { name: "Side Hustle", value: data.income.sideHustle },
    { name: "Other", value: data.income.other },
  ].filter((item) => item.value > 0)

  const expensesData = [
    { name: "Housing", value: data.expenses.housing },
    { name: "Transportation", value: data.expenses.transportation },
    { name: "Food", value: data.expenses.food },
    { name: "Utilities", value: data.expenses.utilities },
    { name: "Healthcare", value: data.expenses.healthcare },
    { name: "Entertainment", value: data.expenses.entertainment },
    { name: "Other", value: data.expenses.other },
  ].filter((item) => item.value > 0)

  const assetsData = [
    { name: "Cash", value: data.assets.cash },
    { name: "Investments", value: data.assets.investments },
    { name: "Retirement", value: data.assets.retirement },
    { name: "Real Estate", value: data.assets.realEstate },
    { name: "Other", value: data.assets.other },
  ].filter((item) => item.value > 0)

  const liabilitiesData = [
    { name: "Mortgage", value: data.liabilities.mortgage },
    { name: "Car Loan", value: data.liabilities.carLoan },
    { name: "Student Loans", value: data.liabilities.studentLoans },
    { name: "Credit Cards", value: data.liabilities.creditCards },
    { name: "Other", value: data.liabilities.other },
  ].filter((item) => item.value > 0)

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Income vs. Expenses</CardTitle>
          <CardDescription>Monthly cash flow breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: "Income", value: totalIncome },
                { name: "Expenses", value: totalExpenses },
                { name: "Savings", value: totalIncome - totalExpenses },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${value.toLocaleString()}`} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="value" fill="#8884d8">
                {[
                  { name: "Income", fill: "#4ade80" },
                  { name: "Expenses", fill: "#f87171" },
                  { name: "Savings", fill: "#60a5fa" },
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Net Worth</CardTitle>
          <CardDescription>Assets vs. Liabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: "Assets", value: totalAssets },
                { name: "Liabilities", value: totalLiabilities },
                { name: "Net Worth", value: totalAssets - totalLiabilities },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${value.toLocaleString()}`} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="value" fill="#8884d8">
                {[
                  { name: "Assets", fill: "#4ade80" },
                  { name: "Liabilities", fill: "#f87171" },
                  { name: "Net Worth", fill: "#60a5fa" },
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Tabs defaultValue="income" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>
        <TabsContent value="income">
          <Card>
            <CardHeader>
              <CardTitle>Income Breakdown</CardTitle>
              <CardDescription>Monthly income by source</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={incomeData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {incomeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Expenses Breakdown</CardTitle>
              <CardDescription>Monthly expenses by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expensesData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expensesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Tabs defaultValue="assets" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="liabilities">Liabilities</TabsTrigger>
        </TabsList>
        <TabsContent value="assets">
          <Card>
            <CardHeader>
              <CardTitle>Assets Breakdown</CardTitle>
              <CardDescription>Current assets by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={assetsData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {assetsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="liabilities">
          <Card>
            <CardHeader>
              <CardTitle>Liabilities Breakdown</CardTitle>
              <CardDescription>Current debts by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={liabilitiesData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {liabilitiesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>FIRE Projection</CardTitle>
          <CardDescription>Your path to financial independence</CardDescription>
        </CardHeader>
        <CardContent>
          <FirePrediction data={data} />
        </CardContent>
      </Card>
    </div>
  )
}

