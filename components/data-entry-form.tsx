"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCurrency } from "@/lib/currency-context"

const formSchema = z.object({
  // Income
  salary: z.coerce.number().min(0),
  investments: z.coerce.number().min(0),
  sideHustle: z.coerce.number().min(0),
  otherIncome: z.coerce.number().min(0),

  // Expenses
  housing: z.coerce.number().min(0),
  transportation: z.coerce.number().min(0),
  food: z.coerce.number().min(0),
  utilities: z.coerce.number().min(0),
  healthcare: z.coerce.number().min(0),
  entertainment: z.coerce.number().min(0),
  otherExpenses: z.coerce.number().min(0),

  // Assets
  cash: z.coerce.number().min(0),
  investmentsAssets: z.coerce.number().min(0),
  retirement: z.coerce.number().min(0),
  realEstate: z.coerce.number().min(0),
  otherAssets: z.coerce.number().min(0),

  // Liabilities
  mortgage: z.coerce.number().min(0),
  carLoan: z.coerce.number().min(0),
  studentLoans: z.coerce.number().min(0),
  creditCards: z.coerce.number().min(0),
  otherLiabilities: z.coerce.number().min(0),

  // Goals
  targetNetWorth: z.coerce.number().min(0),
  targetAnnualExpenses: z.coerce.number().min(0),
  targetWithdrawalRate: z.coerce.number().min(0).max(100),
  targetRetirementAge: z.coerce.number().min(0).max(120),
  currentAge: z.coerce.number().min(18).max(100),
})

export function DataEntryForm({ data, onUpdate }) {
  const { currencySymbol } = useCurrency()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Income
      salary: data.income.salary,
      investments: data.income.investments,
      sideHustle: data.income.sideHustle,
      otherIncome: data.income.other,

      // Expenses
      housing: data.expenses.housing,
      transportation: data.expenses.transportation,
      food: data.expenses.food,
      utilities: data.expenses.utilities,
      healthcare: data.expenses.healthcare,
      entertainment: data.expenses.entertainment,
      otherExpenses: data.expenses.other,

      // Assets
      cash: data.assets.cash,
      investmentsAssets: data.assets.investments,
      retirement: data.assets.retirement,
      realEstate: data.assets.realEstate,
      otherAssets: data.assets.other,

      // Liabilities
      mortgage: data.liabilities.mortgage,
      carLoan: data.liabilities.carLoan,
      studentLoans: data.liabilities.studentLoans,
      creditCards: data.liabilities.creditCards,
      otherLiabilities: data.liabilities.other,

      // Goals
      targetNetWorth: data.goals.targetNetWorth,
      targetAnnualExpenses: data.goals.targetAnnualExpenses,
      targetWithdrawalRate: data.goals.targetWithdrawalRate,
      targetRetirementAge: data.goals.targetRetirementAge,
      currentAge: data.goals.currentAge || 30,
    },
  })

  function onSubmit(values) {
    const newData = {
      income: {
        salary: values.salary,
        investments: values.investments,
        sideHustle: values.sideHustle,
        other: values.otherIncome,
      },
      expenses: {
        housing: values.housing,
        transportation: values.transportation,
        food: values.food,
        utilities: values.utilities,
        healthcare: values.healthcare,
        entertainment: values.entertainment,
        other: values.otherExpenses,
      },
      assets: {
        cash: values.cash,
        investments: values.investmentsAssets,
        retirement: values.retirement,
        realEstate: values.realEstate,
        other: values.otherAssets,
      },
      liabilities: {
        mortgage: values.mortgage,
        carLoan: values.carLoan,
        studentLoans: values.studentLoans,
        creditCards: values.creditCards,
        other: values.otherLiabilities,
      },
      goals: {
        targetNetWorth: values.targetNetWorth,
        targetAnnualExpenses: values.targetAnnualExpenses,
        targetWithdrawalRate: values.targetWithdrawalRate,
        targetRetirementAge: values.targetRetirementAge,
        currentAge: values.currentAge,
      },
    }

    onUpdate(newData)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="income" className="w-full">
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="liabilities">Liabilities</TabsTrigger>
            <TabsTrigger value="goals">FIRE Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="income">
            <Card>
              <CardHeader>
                <CardTitle>Income</CardTitle>
                <CardDescription>Enter your monthly income</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">{currencySymbol}</span>
                          <Input type="number" className="pl-7" placeholder="0.00" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="investments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investment Income</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">{currencySymbol}</span>
                          <Input type="number" className="pl-7" placeholder="0.00" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sideHustle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Side Hustle</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">{currencySymbol}</span>
                          <Input type="number" className="pl-7" placeholder="0.00" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="otherIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Income</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">{currencySymbol}</span>
                          <Input type="number" className="pl-7" placeholder="0.00" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses">
            <Card>
              <CardHeader>
                <CardTitle>Expenses</CardTitle>
                <CardDescription>Enter your monthly expenses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="housing"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Housing</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">{currencySymbol}</span>
                          <Input type="number" className="pl-7" placeholder="0.00" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="transportation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transportation</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">{currencySymbol}</span>
                          <Input type="number" className="pl-7" placeholder="0.00" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="food"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Food</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">{currencySymbol}</span>
                          <Input type="number" className="pl-7" placeholder="0.00" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="utilities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Utilities</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">{currencySymbol}</span>
                          <Input type="number" className="pl-7" placeholder="0.00" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="healthcare"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Healthcare</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">{currencySymbol}</span>
                          <Input type="number" className="pl-7" placeholder="0.00" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="entertainment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entertainment</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">{currencySymbol}</span>
                          <Input type="number" className="pl-7" placeholder="0.00" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="otherExpenses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Expenses</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">{currencySymbol}</span>
                          <Input type="number" className="pl-7" placeholder="0.00" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assets">
            <Card>
              <CardHeader>
                <CardTitle>Assets</CardTitle>
                <CardDescription>Enter your current assets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="cash"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cash</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">{currencySymbol}</span>
                          <Input type="number" className="pl-7" placeholder="0.00" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="investmentsAssets"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investments</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">{currencySymbol}</span>
                          <Input type="number" className="pl-7" placeholder="0.00" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="retirement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Retirement Accounts</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">{currencySymbol}</span>
                          <Input type="number" className="pl-7" placeholder="0.00" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="realEstate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Real Estate</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">{currencySymbol}</span>
                          <Input type="number" className="pl-7" placeholder="0.00" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="otherAssets"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Assets</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">{currencySymbol}</span>
                          <Input type="number" className="pl-7" placeholder="0.00" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="liabilities">
            <Card>
              <CardHeader>
                <CardTitle>Liabilities</CardTitle>
                <CardDescription>Enter your current debts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="mortgage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mortgage</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">{currencySymbol}</span>
                          <Input type="number" className="pl-7" placeholder="0.00" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="carLoan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Car Loan</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">{currencySymbol}</span>
                          <Input type="number" className="pl-7" placeholder="0.00" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="studentLoans"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student Loans</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">{currencySymbol}</span>
                          <Input type="number" className="pl-7" placeholder="0.00" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="creditCards"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credit Cards</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">{currencySymbol}</span>
                          <Input type="number" className="pl-7" placeholder="0.00" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="otherLiabilities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Liabilities</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">{currencySymbol}</span>
                          <Input type="number" className="pl-7" placeholder="0.00" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals">
            <Card>
              <CardHeader>
                <CardTitle>FIRE Goals</CardTitle>
                <CardDescription>Set your financial independence goals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="currentAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="30" {...field} />
                      </FormControl>
                      <FormDescription>Your current age</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetRetirementAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Retirement Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="55" {...field} />
                      </FormControl>
                      <FormDescription>The age at which you want to achieve financial independence</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetAnnualExpenses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Annual Expenses</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">{currencySymbol}</span>
                          <Input type="number" className="pl-7" placeholder="0.00" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>Your projected annual expenses in retirement</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetWithdrawalRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Withdrawal Rate (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="4.00" {...field} />
                      </FormControl>
                      <FormDescription>The percentage of your portfolio you plan to withdraw annually</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetNetWorth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Net Worth</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">{currencySymbol}</span>
                          <Input type="number" className="pl-7" placeholder="0.00" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>Your target net worth for financial independence</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button type="submit">Update Dashboard</Button>
        </div>
      </form>
    </Form>
  )
}

