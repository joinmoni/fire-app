"use client";

import { useEffect, useState } from "react";
import { SettingsScreen } from "@/components/settings-screen";
import { MoniLayout } from "@/components/moni-layout";
import { auth } from "@/lib/firebase";

export function SettingsWrapper() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get user ID from Firebase or development mode
    const devUserId = localStorage.getItem("devModeUserId");
    if (devUserId) {
      setUserId(devUserId);
      return;
    }

    if (auth.currentUser) {
      setUserId(auth.currentUser.uid);
    }
  }, []);

  if (!userId) {
    return null;
  }

  return (
    <MoniLayout>
      <SettingsScreen userId={userId} />
    </MoniLayout>
  );
}
