"use client";

import type React from "react";

import { MoniLogo } from "./moni-logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface MoniLayoutProps {
  children: React.ReactNode;
}

export function MoniLayout({ children }: MoniLayoutProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut(auth);
      router.push("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
      setIsSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-moni-lightGreen">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <MoniLogo />
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/welcome"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Dashboard
            </Link>
            <Link
              href="/fire-calculator"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              FIRE Calculator
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              {isSigningOut ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing out...
                </>
              ) : (
                "Sign Out"
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <MoniLogo className="mb-4" />
              <p className="text-sm text-gray-600 mb-4">
                Building lasting businesses and wealth for Africans.
              </p>
              <div className="text-sm text-gray-600">
                <div>
                  <p>548 Market St, San Francisco,</p>
                  <p>California, 94104-5401</p>
                </div>
                <div className="mt-4">
                  <p>12, Jasper Ike,</p>
                  <p>Lekki Lagos.</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Products</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="https://www.moni.africa/moni-loans"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Business Loans
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.moni.africa/savings"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Savings
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.moni.africa/Privacy"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.moni.africa/Privacy"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="https://www.moni.africa/About-us"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://wellfound.com/company/moni-10/jobs"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://blog.moni.africa"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.moni.africa/FAQ"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Download App</h3>
              <div className="flex flex-col space-y-3">
                <a
                  href="https://play.google.com/store/apps/details?id=com.rank.moni"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-36 transition-opacity hover:opacity-80"
                >
                  <Image
                    src="/google-play-badge.svg"
                    alt="Get it on Google Play"
                    width={135}
                    height={40}
                    priority
                  />
                </a>
                <a
                  href="https://apps.apple.com/us/app/moni-savings-loans/id1578727095"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-36 transition-opacity hover:opacity-80"
                >
                  <Image
                    src="/app-store-badge.svg"
                    alt="Download on the App Store"
                    width={135}
                    height={40}
                    priority
                  />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
            <p>© {new Date().getFullYear()} Moni. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
