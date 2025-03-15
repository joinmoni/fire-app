import { AuthCheck } from "@/components/auth-check"
import { DashboardWrapper } from "@/components/dashboard-wrapper"

export default function DashboardPage() {
  return (
    <AuthCheck redirectTo="/auth">
      <DashboardWrapper />
    </AuthCheck>
  )
}

