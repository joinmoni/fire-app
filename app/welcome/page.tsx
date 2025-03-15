import { AuthCheck } from "@/components/auth-check"
import { WelcomeWrapper } from "@/components/welcome-wrapper"

export default function WelcomePage() {
  return (
    <AuthCheck redirectTo="/auth">
      <WelcomeWrapper />
    </AuthCheck>
  )
}

