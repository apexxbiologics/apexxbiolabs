import { Suspense } from "react";
import AffiliateClaimClient from "./AffiliateClaimClient";

export default function AffiliateClaimPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#081526] text-white flex items-center justify-center px-6">
          <p className="text-blue-200 uppercase tracking-[0.25em] text-sm">
            Loading Invitation...
          </p>
        </main>
      }
    >
      <AffiliateClaimClient />
    </Suspense>
  );
}