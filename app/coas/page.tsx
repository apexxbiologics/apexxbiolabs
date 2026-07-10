"use client";

import { useState } from "react";

type PreviousCOA = {
  batch: string;
  purity: string;
  content: string;
  coa: string;
};

type ProductCOA = {
  name: string;
  batch: string;
  status: "Verified" | "Awaiting Testing";
  purity?: string;
  content?: string;
  coa?: string;
  previousCoas?: PreviousCOA[];
};

export default function COAsPage() {
  const [openPreviousCoas, setOpenPreviousCoas] = useState<string | null>(
    null,
  );

  const products: ProductCOA[] = [
    {
      name: "APX-3",
      batch: "Blue Cap-1",
      status: "Verified",
      purity: "99.92%",
      content: "23.89 mg",
      coa: "/images/coas/apx3-20mg-blue-cap-coa.pdf",
    },
{
  name: "BPC-157",
  batch: "Blue Cap-2",
  status: "Verified",
  purity: "99.72%",
  content: "11.78 mg",

  // Latest COA
  coa: "/images/coas/bpc157coa7-10-26.pdf",

  // Previous COAs
  previousCoas: [
    {
      batch: "Black Cap-1",
      purity: "99.33%",
      content: "11.58 mg",
      coa: "/images/coas/bpc-157-10mg-black-cap-coa.pdf",
    },
  ],
},
{
  name: "TB-500",
  batch: "Yellow Cap-2",
  status: "Verified",
  purity: "99.95%",
  content: "13.47 mg",

  // MOST RECENT COA
  coa: "/images/coas/tb500.pdf",

  // OLDER COAS
  previousCoas: [
    {
      batch: "Blue Cap-1",
      purity: "99.47%",
      content: "11.83 mg",
      coa: "/images/coas/tb500-10mg-blue-cap-coa.pdf",
    },
  ],
},
    {
      name: "Bacteriostatic Water",
      batch: "PRX-2026-04-A",
      status: "Verified",
      purity: "Pass",
      content: "30 mL",
      coa: "/images/coas/bacwater-coa.pdf",
    },
    {
      name: "KPV",
      batch: "Purple Cap-1",
      status: "Verified",
      purity: "99.60%",
      content: "10.41 mg",
      coa: "/images/coas/6-26-kpv-coa.pdf",
    },
{
  name: "GHK-Cu",
  batch: "Red Cap-1",
  status: "Verified",
  purity: "99.74%",
  content: "114.96 mg",
  coa: "/images/coas/ghkcucoa7-10-26.pdf",
},
    {
      name: "Pinealon",
      batch: "Pending",
      status: "Awaiting Testing",
    },
    {
      name: "Selank",
      batch: "SEL1005192026-08",
      status: "Verified",
      purity: "99.62%",
      content: "11.36 mg",
      coa: "/images/coas/selank-10mg-brown-green-coa.pdf",
    },
    {
      name: "Semax",
      batch: "SEMX1005182026-10",
      status: "Verified",
      purity: "99.33%",
      content: "11.71 mg",
      coa: "/images/coas/semax-10mg-coa.pdf",
    },
{
  name: "MOTS-c",
  batch: "Blue Cap-2",
  status: "Verified",
  purity: "99.75%",
  content: "12.42 mg",

  // Latest COA
  coa: "/images/coas/motsccoa.pdf",

  // Previous COAs
  previousCoas: [
    {
      batch: "Light Purple Cap-1",
      purity: "99.48%",
      content: "13.94 mg",
      coa: "/images/coas/6-26-motsc-coa.pdf",
    },
  ],
},
    {
      name: "ARA-290",
      batch: "Pending",
      status: "Awaiting Testing",
    },
    {
      name: "PE-22-28",
      batch: "Pending",
      status: "Awaiting Testing",
    },
    {
      name: "Adamax",
      batch: "Pending",
      status: "Awaiting Testing",
    },
    {
      name: "CJC/IPA without DAC",
      batch: "CJCIPA504292026-09",
      status: "Verified",
      purity: "99.42%",
      content: "5 mg / 5 mg",
      coa: "/images/coas/cjc-ipa-no-dac-coa.pdf",
    },
{
  name: "Tesamorelin",
  batch: "Red Cap-1",
  status: "Verified",
  purity: "99.89%",
  content: "5.48 mg",
  coa: "/images/coas/tesamorelincoa7-10-26.pdf",
},
    {
      name: "NAD+",
      batch: "Pending",
      status: "Awaiting Testing",
    },
    {
      name: "AOD-9604",
      batch: "Pending",
      status: "Awaiting Testing",
    },
    {
      name: "PT-141",
      batch: "Pending",
      status: "Awaiting Testing",
    },
    {
      name: "Acetic Acid",
      batch: "Pending",
      status: "Awaiting Testing",
    },
    {
      name: "5-Amino-1MQ",
      batch: "Pending",
      status: "Awaiting Testing",
    },
    {
      name: "Kisspeptin-10",
      batch: "Pending",
      status: "Awaiting Testing",
    },
    {
      name: "KLOW",
      batch: "Pending",
      status: "Awaiting Testing",
    },
    {
      name: "Wolverine",
      batch: "Pending",
      status: "Awaiting Testing",
    },
  ];

  function togglePreviousCoas(productName: string) {
    setOpenPreviousCoas((current) =>
      current === productName ? null : productName,
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#081526] text-white">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10 px-6 py-24 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_55%)]" />

        <div className="relative z-10 mx-auto max-w-5xl">
          <p className="mb-6 text-sm uppercase tracking-[0.35em] text-blue-300">
            Quality Assurance
          </p>

          <h1 className="mb-6 text-5xl font-black leading-[0.95] text-white md:text-7xl">
            Certificates of Analysis
          </h1>

          <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-white/70">
            <span className="text-green-400">✓</span>
            <span>Last Updated: July 10, 2026</span>
          </div>

          <p className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-white/70 md:text-xl">
            Third-party analytical verification and batch documentation
            supporting research transparency, quality assurance, and product
            integrity.
          </p>

          <div className="inline-flex items-center gap-3 rounded-full border border-green-500/20 bg-green-500/5 px-6 py-3">
            <span className="text-green-400">✓</span>

            <span className="text-sm uppercase tracking-widest text-green-300">
              Independently Verified Products
            </span>
          </div>
        </div>
      </section>

      {/* COA CARDS */}
      <section className="relative overflow-hidden px-6 py-20 md:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.08),transparent_60%)]" />

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-start gap-8 md:grid-cols-2">
          {products.map((product) => {
            const isVerified = product.status === "Verified";

            const hasPreviousCoas =
              Array.isArray(product.previousCoas) &&
              product.previousCoas.length > 0;

            const isPreviousOpen = openPreviousCoas === product.name;

            return (
              <article
                key={product.name}
                className="flex min-h-[260px] flex-col justify-between rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-all duration-300 hover:border-blue-400/50 hover:bg-white/[0.07] sm:p-8"
              >
                <div>
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-3xl font-black tracking-tight text-white">
                        {product.name}
                      </h2>

                      {hasPreviousCoas && (
                        <p className="mt-2 text-xs uppercase tracking-[0.24em] text-blue-300">
                          Most Recent Batch
                        </p>
                      )}
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-3 py-1 text-xs uppercase tracking-widest ${
                        isVerified
                          ? "border-green-500/20 bg-green-500/10 text-green-300"
                          : "border-white/10 bg-white/[0.04] text-white/40"
                      }`}
                    >
                      {isVerified ? "Verified" : "Pending"}
                    </span>
                  </div>

                  <div className="mb-8 space-y-4 text-sm text-white/60">
                    <div className="flex justify-between gap-6 border-b border-white/10 pb-3">
                      <span>Batch</span>

                      <span className="text-right text-white/80">
                        {product.batch}
                      </span>
                    </div>

                    <div className="flex justify-between gap-6 border-b border-white/10 pb-3">
                      <span>Status</span>

                      <span
                        className={
                          isVerified ? "text-green-300" : "text-white/40"
                        }
                      >
                        {product.status}
                      </span>
                    </div>

                    {product.purity && (
                      <div className="flex justify-between gap-6 border-b border-white/10 pb-3">
                        <span>Purity</span>

                        <span className="text-white/80">
                          {product.purity}
                        </span>
                      </div>
                    )}

                    {product.content && (
                      <div className="flex justify-between gap-6 border-b border-white/10 pb-3">
                        <span>Net Content</span>

                        <span className="text-white/80">
                          {product.content}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {product.coa ? (
                  <div className="space-y-4">
                    {isVerified && (
                      <div className="text-center">
                        <span className="inline-flex rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-xs uppercase tracking-widest text-green-300">
                          ✓ Third-Party Verified
                        </span>
                      </div>
                    )}

                    <a
                      href={product.coa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full rounded-full border border-blue-400/30 bg-blue-500/10 py-4 text-center text-sm uppercase tracking-widest text-blue-100 transition-all hover:border-blue-300/60 hover:bg-blue-500/20"
                    >
                      {hasPreviousCoas ? "View Latest COA" : "View COA"}
                    </a>

                    {hasPreviousCoas && (
                      <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#06101f]">
                        <button
                          type="button"
                          onClick={() => togglePreviousCoas(product.name)}
                          aria-expanded={isPreviousOpen}
                          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm uppercase tracking-widest text-white/80 transition-all hover:bg-white/[0.05] hover:text-white"
                        >
                          <span>
                            {isPreviousOpen
                              ? "Hide Previous COAs"
                              : "See Previous COAs"}
                          </span>

                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className={`h-5 w-5 shrink-0 transition-transform duration-300 ${
                              isPreviousOpen ? "rotate-180" : ""
                            }`}
                          >
                            <path
                              d="m6 9 6 6 6-6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>

                        {isPreviousOpen && (
                          <div className="space-y-4 border-t border-white/10 p-4">
                            <p className="px-1 text-xs uppercase tracking-[0.24em] text-white/40">
                              Previous Test Results
                            </p>

                            {product.previousCoas?.map(
                              (previousCoa, previousIndex) => (
                                <div
                                  key={`${product.name}-${previousCoa.batch}-${previousIndex}`}
                                  className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-5"
                                >
                                  <div className="mb-5 space-y-3 text-sm">
                                    <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                                      <span className="text-white/50">
                                        Batch
                                      </span>

                                      <span className="text-right text-white/80">
                                        {previousCoa.batch}
                                      </span>
                                    </div>

                                    <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                                      <span className="text-white/50">
                                        Purity
                                      </span>

                                      <span className="text-white/80">
                                        {previousCoa.purity}
                                      </span>
                                    </div>

                                    <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                                      <span className="text-white/50">
                                        Net Content
                                      </span>

                                      <span className="text-white/80">
                                        {previousCoa.content}
                                      </span>
                                    </div>
                                  </div>

                                  <a
                                    href={previousCoa.coa}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full rounded-full border border-white/10 bg-white/[0.05] py-3 text-center text-xs uppercase tracking-widest text-white/80 transition-all hover:border-blue-400/50 hover:bg-blue-500/10 hover:text-white"
                                  >
                                    View Previous COA
                                  </a>
                                </div>
                              ),
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full cursor-not-allowed rounded-full border border-white/10 bg-white/[0.03] py-4 text-sm uppercase tracking-widest text-white/40"
                  >
                    COA Coming Soon
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}