"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Calculator, BarChart3 } from "lucide-react";
import { CommunityBadge } from "./community-badge";

export function WelcomeScreen({ userId }) {
  const router = useRouter();

  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block mb-4 px-4 py-1 bg-moni-green text-moni-darkGreen rounded-full text-sm font-medium">
          Community Finance for Africa
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Financial Independece, Retire Early
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Let's get started on your path to financial freedom
        </p>
        <div className="mt-6">
          <CommunityBadge />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-8">
        <Card className="flex flex-col h-full border-moni-green">
          <CardHeader className="bg-white ">
            <div className="flex items-center gap-2">
              <Calculator className="h-6 w-6 text-primary" />
              <CardTitle>Quick FIRE Calculator</CardTitle>
            </div>
            <CardDescription>
              Calculate your FIRE number and see how long it will take to reach
              financial independence
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="font-bold">
              Answer a few simple questions to quickly determine:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2">
              <li>Your FIRE number (how much you need to retire)</li>
              <li>How long it will take to reach financial independence</li>
              <li>What investment returns you need to achieve your goals</li>
              <li>Personalized recommendations for your journey</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-moni-orange hover:bg-moni-orange/90 text-white"
              onClick={() => router.push("/fire-calculator")}
            >
              Calculate My FIRE Number
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col h-full">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              <CardTitle>Full Financial Dashboard</CardTitle>
            </div>
            <CardDescription>
              Track your complete financial picture with our comprehensive
              dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="font-bold">
              Enter detailed financial information to access:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2">
              <li>Income and expense tracking</li>
              <li>Asset and liability management</li>
              <li>Net worth visualization</li>
              <li>Detailed FIRE projections and planning</li>
              <li>Personalized financial insights</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full border-moni-darkGreen text-moni-darkGreen hover:bg-moni-green/20"
              variant="outline"
              onClick={() => router.push("/dashboard")}
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
