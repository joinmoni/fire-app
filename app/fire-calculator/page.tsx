import { AuthCheck } from "@/components/auth-check"
import { FireCalculatorWrapper } from "@/components/fire-calculator-wrapper"

export default function FireCalculatorPage() {
  return (
    <AuthCheck redirectTo="/auth">
      <FireCalculatorWrapper />
    </AuthCheck>
  )
}

