import { AuthCheck } from "@/components/auth-check";
import { SettingsWrapper } from "@/components/settings-wrapper";

export default function SettingsPage() {
  return (
    <AuthCheck redirectTo="/auth">
      <SettingsWrapper />
    </AuthCheck>
  );
}
