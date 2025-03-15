"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowRight, Calculator, BarChart3, ArrowLeft, InfoIcon } from "lucide-react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"
import { getUserFinancialData, updateUserFinancialData } from "@/lib/firestore"
import { useCurrency } from "@/lib/currency-context"

const formSchema = z.object({
  currentAge: z.coerce.number().min(18, "Age must be at least 18").max(100, "Age must be less than 100"),
  targetRetirementAge: z.coerce.number().min(18, "Age must be at least 18").max(100, "Age must be less than 100"),
  annualExpenses: z.coerce.number().min(0, "Annual expenses must be positive"),
  currentInvestments: z.coerce.number().min(0, "Current investments must be positive"),
  annualSavings: z.coerce.number().min(0, "Annual savings must be positive"),
  withdrawalRate: z.coerce
    .number()
    .min(2, "Withdrawal rate must be at least 2%")
    .max(10, "Withdrawal rate must be less than 10%"),
  expectedReturn: z.coerce
    .number()
    .min(1, "Expected return must be at least 1%")
    .max(20, "Expected return must be less than 20%"),
})

export function FireCalculator({ userId }) {
  const router = useRouter()
  const [results, setResults] = useState(null)
  const [projectionData, setProjectionData] = useState([])
  const [saving, setSaving] = useState(false)
  const { formatCurrency, currencySymbol } = useCurrency()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentAge: 30,
      targetRetirementAge: 55,
      annualExpenses: 2400000, // ₦2.4M
      currentInvestments: 5000000, // ₦5M
      annualSavings: 1200000, // ₦1.2M
      withdrawalRate: 4,
      expectedReturn: 8,
    },
  })

  const onSubmit = async (values) => {
    // Calculate FIRE number
    const fireNumber = values.annualExpenses * (100 / values.withdrawalRate)

    // Calculate years to FIRE
    const yearsToFire = calculateYearsToFire(
      values.currentInvestments,
      fireNumber,
      values.annualSavings,
      values.expectedReturn / 100,
    )

    // Calculate actual retirement age
    const actualRetirementAge = values.currentAge + yearsToFire

    // Calculate required annual savings to reach target retirement age
    const requiredAnnualSavings = calculateRequiredAnnualSavings(
      values.currentInvestments,
      fireNumber,
      values.targetRetirementAge - values.currentAge,
      values.expectedReturn / 100,
    )

    // Generate projection data
    const projData = generateProjectionData(
      values.currentAge,
      Math.ceil(actualRetirementAge),
      values.currentInvestments,
      values.annualSavings,
      values.expectedReturn / 100,
      fireNumber,
    )

    setProjectionData(projData)

    // Set results
    setResults({
      fireNumber,
      yearsToFire,
      actualRetirementAge,
      requiredAnnualSavings,
      onTrack: actualRetirementAge <= values.targetRetirementAge,
      gap: actualRetirementAge - values.targetRetirementAge,
    })
  }

  const saveToProfile = async () => {
    setSaving(true)
    try {
      // Get current user data
      const userData = await getUserFinancialData(userId)

      // Update with FIRE calculator data
      const values = form.getValues()
      const updatedData = {
        ...userData,
        goals: {
          ...userData.goals,
          currentAge: values.currentAge,
          targetRetirementAge: values.targetRetirementAge,
          targetAnnualExpenses: values.annualExpenses,
          targetWithdrawalRate: values.withdrawalRate,
        },
        assets: {
          ...userData.assets,
          investments: values.currentInvestments,
        },
      }

      await updateUserFinancialData(userId, updatedData)
      router.push("/dashboard")
    } catch (error) {
      console.error("Error saving data:", error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" onClick={() => router.push("/welcome")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Welcome
        </Button>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Go to Dashboard
          <BarChart3 className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="text-center mb-8">
        <div className="inline-block mb-4 px-4 py-1 bg-moni-green text-moni-darkGreen rounded-full text-sm font-medium">
          Powered by Moni
        </div>
        <h1 className="text-3xl font-bold">My FIRE Numbers</h1>
        <p className="text-muted-foreground mt-2">Calculate how much you need to achieve financial independence</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
            <CardDescription>Enter your financial details to calculate your path to FIRE</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="currentAge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Age</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
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
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="annualExpenses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual Expenses in Retirement</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">{currencySymbol}</span>
                          <Input type="number" className="pl-7" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>How much you plan to spend each year in retirement</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentInvestments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Investments</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">{currencySymbol}</span>
                          <Input type="number" className="pl-7" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>Total value of your current investment portfolio</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="annualSavings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual Savings</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">{currencySymbol}</span>
                          <Input type="number" className="pl-7" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>How much you save and invest each year</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="withdrawalRate"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Safe Withdrawal Rate: {value}%</FormLabel>
                      <FormControl>
                        <Slider
                          defaultValue={[value]}
                          min={2}
                          max={10}
                          step={0.1}
                          onValueChange={(vals) => onChange(vals[0])}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Percentage of portfolio you'll withdraw annually in retirement (4% is traditional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expectedReturn"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Expected Annual Return: {value}%</FormLabel>
                      <FormControl>
                        <Slider
                          defaultValue={[value]}
                          min={1}
                          max={20}
                          step={0.5}
                          onValueChange={(vals) => onChange(vals[0])}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Expected annual return on your investments (7-10% is typical for long-term stock market returns)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-moni-orange hover:bg-moni-orange/90 text-white">
                  Calculate
                  <Calculator className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {results && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Your FIRE Results</CardTitle>
                  <CardDescription>Based on your inputs, here's your path to financial independence</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Your FIRE Number</p>
                      <p className="text-2xl font-bold">{formatCurrency(results.fireNumber)}</p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Years to FIRE</p>
                      <p className="text-2xl font-bold">{results.yearsToFire.toFixed(1)} years</p>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Projected Retirement Age</p>
                    <p className="text-2xl font-bold">{results.actualRetirementAge.toFixed(1)} years old</p>
                    {results.onTrack ? (
                      <p className="text-sm text-green-600 mt-1">
                        You're on track to retire {Math.abs(results.gap).toFixed(1)} years before your target!
                      </p>
                    ) : (
                      <p className="text-sm text-amber-600 mt-1">
                        You'll reach FIRE {results.gap.toFixed(1)} years after your target retirement age
                      </p>
                    )}
                  </div>

                  {!results.onTrack && (
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Required Annual Savings to Meet Target</p>
                      <p className="text-2xl font-bold">{formatCurrency(results.requiredAnnualSavings)}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        To retire by age {form.getValues().targetRetirementAge}
                      </p>
                    </div>
                  )}

                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={projectionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="age" label={{ value: "Age", position: "insideBottomRight", offset: 0 }} />
                        <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                        <Tooltip
                          formatter={(value) => formatCurrency(value)}
                          labelFormatter={(value) => `Age: ${value}`}
                        />
                        <Line
                          type="monotone"
                          dataKey="netWorth"
                          name="Net Worth"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="fireTarget"
                          name="FIRE Target"
                          stroke="#82ca9d"
                          strokeDasharray="5 5"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <Alert>
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>Recommendations</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        {!results.onTrack ? (
                          <>
                            <li>
                              Increase your annual savings by{" "}
                              {formatCurrency(results.requiredAnnualSavings - form.getValues().annualSavings)} to reach
                              your target retirement age.
                            </li>
                            <li>Consider reducing your annual expenses in retirement to lower your FIRE number.</li>
                          </>
                        ) : (
                          <>
                            <li>You're on track to reach FIRE before your target age!</li>
                            <li>Consider if you want to retire even earlier or increase your retirement spending.</li>
                          </>
                        )}
                        <li>Ensure your investments are properly diversified to achieve your target returns.</li>
                        <li>Review and update your plan regularly as your financial situation changes.</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-moni-orange hover:bg-moni-orange/90 text-white"
                    onClick={saveToProfile}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save & Continue to Dashboard"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </>
          )}

          {!results && (
            <Card>
              <CardHeader>
                <CardTitle>Your Results Will Appear Here</CardTitle>
                <CardDescription>Fill out the form and click "Calculate" to see your FIRE projections</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Calculator className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>Enter your information to calculate your path to financial independence</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

// Calculate years to reach financial independence
function calculateYearsToFire(currentInvestments, targetAmount, annualSavings, annualReturnRate) {
  // If already at target
  if (currentInvestments >= targetAmount) return 0

  // If no savings and no returns
  if (annualSavings <= 0 && annualReturnRate <= 0) return Number.POSITIVE_INFINITY

  let years = 0
  let netWorth = currentInvestments

  while (netWorth < targetAmount && years < 100) {
    netWorth = netWorth * (1 + annualReturnRate) + annualSavings
    years++
  }

  return years
}

// Calculate required annual savings to reach FIRE by target age
function calculateRequiredAnnualSavings(currentInvestments, targetAmount, yearsToRetirement, annualReturnRate) {
  if (yearsToRetirement <= 0) return Number.POSITIVE_INFINITY

  // Calculate future value of current investments
  const futureValueOfCurrentInvestments = currentInvestments * Math.pow(1 + annualReturnRate, yearsToRetirement)

  // Calculate amount needed beyond growth of current investments
  const additionalAmountNeeded = Math.max(0, targetAmount - futureValueOfCurrentInvestments)

  // Calculate annual payment required using PMT formula
  if (annualReturnRate === 0) {
    return additionalAmountNeeded / yearsToRetirement
  }

  const annualPayment =
    (additionalAmountNeeded * annualReturnRate) / (Math.pow(1 + annualReturnRate, yearsToRetirement) - 1)

  return Math.max(0, annualPayment)
}

// Generate projection data for chart
function generateProjectionData(
  currentAge,
  retirementAge,
  currentInvestments,
  annualSavings,
  annualReturnRate,
  fireTarget,
) {
  const data = []
  let netWorth = currentInvestments

  for (let age = currentAge; age <= retirementAge + 5; age++) {
    data.push({
      age,
      netWorth,
      fireTarget,
    })

    netWorth = netWorth * (1 + annualReturnRate) + annualSavings
  }

  return data
}

