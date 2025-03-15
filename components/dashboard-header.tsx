"use client";

import { useState } from "react";
import { CalendarIcon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { CurrencySelector } from "./currency-selector";

export function DashboardHeader({ userId }) {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="bg-white text-black">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Your FIRE Dashboard</h1>
            <div className="flex items-center mt-2 text-black">
              <CalendarIcon className="h-4 w-4 mr-2" />
              <span>{today}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2"></div>
        </div>
      </CardContent>
    </Card>
  );
}
