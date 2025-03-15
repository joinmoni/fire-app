import { AuthCheck } from "@/components/auth-check"
import { HomeRedirect } from "@/components/home-redirect"

export default function Home() {
  return (
    <AuthCheck redirectTo="/auth">
      <HomeRedirect />
    </AuthCheck>
  )
}

