"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, FileSpreadsheet } from "lucide-react"

export function DashboardTabs({ activeTab, setActiveTab }) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="dashboard" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          <span>Dashboard</span>
        </TabsTrigger>
        <TabsTrigger value="data-entry" className="flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          <span>Data Entry</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

