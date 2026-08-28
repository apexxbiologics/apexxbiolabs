"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  Clock3,
  FileText,
  Search,
  ShieldCheck,
} from "lucide-react";

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
  totalContent?: string;
  coa?: string;
  previousCoas?: PreviousCOA[];
};

type StatusFilter = "All" | "Verified" | "Pending";

export default function COAsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [openProduct, setOpenProduct] = useState<string | null>(null);
  const [openPreviousCoas, setOpenPreviousCoas] = useState<string | null>(
    null,
  );

  const products: ProductCOA[] = [
    {
      name: "APX-2 30mg",
      batch: "Pending",
      status: "Awaiting Testing",
    },
    {
      name: "MITO-X 120mg",
      batch: "Pending",
      status: "Awaiting Testing",
    },
    {
      name: "NEURO-X 48mg",
      batch: "Pending",
      status: "Awaiting Testing",
    },
    {
      name: "Glutathione 1500mg",
      batch: "Pending",
      status: "Awaiting Testing",
    },
    {
      name: "SS-31 10mg",
      batch: "Pending",
      status: "Awaiting Testing",
    },
    {
      name: "APX-3 10mg",
      batch: "Blue Cap-1",
      status: "Verified",
      purity: "99.89%",
      content: "13.24 mg",
      coa: "/images/coas/apx3-10mg-blue-cap-1-coa.pdf",
    },
    {
      name: "APX-3 20mg",
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
      coa: "/images/coas/bpc157coa7-10-26.pdf",
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
      coa: "/images/coas/tb500.pdf",
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
      coa: "/images/coas/motsccoa.pdf",
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
      batch: "Black Cap-1",
      status: "Verified",
      purity: "99.21%",
      content: "13.71 mg",
      coa: "/images/coas/adamaxcoa7-20-26.pdf",
    },
    {
      name: "CJC/IPA without DAC",
      batch: "CJCIPA504292026-09",
      status: "Verified",
      purity: "99.42%",
      content: "5 mg CJC / 5 mg IPA",
      totalContent: "10 mg",
      coa: "/images/coas/cjc-ipa-no-dac-coa.pdf",
    },
    {
      name: "Tesamorelin 10mg",
      batch: "TESA2608-01",
      status: "Verified",
      purity: "99.99%",
      content: "9.968 mg",
      coa: "/images/coas/tesamorelin-10mg-8-26-26.pdf",
      previousCoas: [
        {
          batch: "Red Cap-1",
          purity: "99.89%",
          content: "5.48 mg",
          coa: "/images/coas/tesamorelincoa7-10-26.pdf",
        },
      ],
    },
    {
      name: "NAD+",
      batch: "Black Cap-1",
      status: "Verified",
      purity: "99.95%",
      content: "1119.71 mg",
      coa: "/images/coas/nadcoa7-20-26.pdf",
    },
    {
      name: "AOD-9604",
      batch: "RED CAP -1",
      status: "Verified",
      purity: "99.27%",
      content: "15.32 mg",
      coa: "/images/coas/8-16-aod9604-coa.pdf",
    },
    {
      name: "PT-141",
      batch: "Pending",
      status: "Awaiting Testing",
    },
    {
      name: "5-Amino-1MQ",
      batch: "Orange Cap",
      status: "Verified",
      purity: "99.90%",
      content: "59.02 mg",
      coa: "/images/coas/7-31-5-amino-1mq-coa.pdf",
    },
    {
      name: "Kisspeptin-10",
      batch: "Pending",
      status: "Awaiting Testing",
    },
    {
      name: "KLOW",
      batch: "Dark Blue Cap",
      status: "Verified",
      purity: "99.82%",
      content:
        "57.66 mg GHK-Cu / 11.53 mg KPV / 12.36 mg BPC-157 / 12.93 mg TB-4",
      totalContent: "94.48 mg",
      coa: "/images/coas/7-31-klow-coa.pdf",
    },
    {
      name: "Wolverine",
      batch: "Clear Cap / Blue Crimp",
      status: "Verified",
      purity: "99.34%",
      content: "11.84 mg BPC-157 / 12.93 mg Thymosin Beta-4",
      totalContent: "24.77 mg",
      coa: "/images/coas/7-31-wolverine-coa.pdf",
    },
  ];

  const verifiedCount = products.filter(
    (product) => product.status === "Verified",
  ).length;

  const pendingCount = products.filter(
    (product) => product.status === "Awaiting Testing",
  ).length;

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products
      .filter((product) => {
        const matchesSearch =
          !normalizedSearch ||
          product.name.toLowerCase().includes(normalizedSearch) ||
          product.batch.toLowerCase().includes(normalizedSearch);

        const matchesStatus =
          statusFilter === "All" ||
          (statusFilter === "Verified" && product.status === "Verified") ||
          (statusFilter === "Pending" &&
            product.status === "Awaiting Testing");

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (a.status !== b.status) {
          return a.status === "Verified" ? -1 : 1;
        }

        return a.name.localeCompare(b.name);
      });
  }, [search, statusFilter]);

  function toggleProduct(productName: string) {
    setOpenProduct((current) =>
      current === productName ? null : productName,
    );

    if (openProduct === productName) {
      setOpenPreviousCoas(null);
    }
  }

  function togglePreviousCoas(productName: string) {
    setOpenPreviousCoas((current) =>
      current === productName ? null : productName,
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#081526] text-white">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10 px-6 pb-16 pt-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.15),transparent_52%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent" />

        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-blue-400/20 bg-blue-500/10 px-5 py-3">
            <ShieldCheck size={16} className="text-blue-300" />
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-blue-200">
              Quality Assurance
            </span>
          </div>

          <h1 className="mb-7 text-5xl font-black tracking-tight text-white md:text-7xl">
            Certificates of Analysis
          </h1>

          <p className="mx-auto max-w-3xl text-base leading-relaxed text-white/60 md:text-lg">
            Browse current third-party analytical results, batch information,
            purity data, content verification, and previous test records.
          </p>

          <p className="mt-6 text-xs uppercase tracking-[0.22em] text-white/35">
            Last Updated August 28, 2026
          </p>

          {/* SUMMARY */}
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-3 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm">
            <div className="border-r border-white/10 px-4 py-5">
              <p className="text-2xl font-black text-white">
                {products.length}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/40">
                Products
              </p>
            </div>

            <div className="border-r border-white/10 px-4 py-5">
              <p className="text-2xl font-black text-green-300">
                {verifiedCount}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/40">
                Verified
              </p>
            </div>

            <div className="px-4 py-5">
              <p className="text-2xl font-black text-white/70">
                {pendingCount}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/40">
                Pending
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH + FILTERS */}
      <section className="relative border-b border-white/10 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xl">
            <Search
              size={18}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-white/35"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search product or batch..."
              className="w-full rounded-full border border-white/10 bg-white/[0.04] py-4 pl-13 pr-5 text-sm text-white outline-none transition-all placeholder:text-white/30 focus:border-blue-400/50 focus:bg-white/[0.06]"
              style={{ paddingLeft: "3.25rem" }}
            />
          </div>

          <div className="flex w-full gap-2 overflow-x-auto lg:w-auto">
            {(["All", "Verified", "Pending"] as StatusFilter[]).map(
              (filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setStatusFilter(filter)}
                  className={`whitespace-nowrap rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] transition-all ${
                    statusFilter === filter
                      ? "bg-white text-[#081526]"
                      : "border border-white/10 bg-white/[0.04] text-white/50 hover:border-blue-400/40 hover:text-white"
                  }`}
                >
                  {filter}
                </button>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ACCORDION LIST */}
      <section className="relative px-6 py-14 md:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.06),transparent_60%)]" />

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="text-xs uppercase tracking-[0.24em] text-white/35">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "Result" : "Results"}
            </p>

            <p className="hidden text-xs text-white/30 sm:block">
              Select a product to view test details
            </p>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025] shadow-[0_30px_100px_rgba(0,0,0,0.20)]">
            {filteredProducts.map((product, index) => {
              const isVerified = product.status === "Verified";
              const isOpen = openProduct === product.name;
              const hasPreviousCoas =
                Array.isArray(product.previousCoas) &&
                product.previousCoas.length > 0;
              const isPreviousOpen =
                openPreviousCoas === product.name;

              return (
                <article
                  key={product.name}
                  className={
                    index !== filteredProducts.length - 1
                      ? "border-b border-white/10"
                      : ""
                  }
                >
                  {/* COLLAPSED ROW */}
                  <button
                    type="button"
                    onClick={() => toggleProduct(product.name)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-center gap-4 px-5 py-5 text-left transition-all hover:bg-white/[0.045] sm:px-7 sm:py-6"
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${
                        isVerified
                          ? "border-green-500/20 bg-green-500/10"
                          : "border-white/10 bg-white/[0.04]"
                      }`}
                    >
                      {isVerified ? (
                        <ShieldCheck
                          size={19}
                          className="text-green-300"
                        />
                      ) : (
                        <Clock3
                          size={19}
                          className="text-white/35"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                        <h2 className="truncate text-lg font-bold text-white sm:text-xl">
                          {product.name}
                        </h2>

                        <span
                          className={`w-fit rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] ${
                            isVerified
                              ? "border-green-500/20 bg-green-500/10 text-green-300"
                              : "border-white/10 bg-white/[0.04] text-white/35"
                          }`}
                        >
                          {isVerified ? "Verified" : "Pending"}
                        </span>
                      </div>

                      <p className="mt-1 truncate text-xs text-white/35">
                        {isVerified
                          ? `Batch ${product.batch}${
                              product.purity
                                ? ` • ${product.purity} purity`
                                : ""
                            }`
                          : "Third-party testing pending"}
                      </p>
                    </div>

                    {isVerified && product.purity && (
                      <div className="hidden text-right md:block">
                        <p className="text-lg font-bold text-white">
                          {product.purity}
                        </p>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                          Purity
                        </p>
                      </div>
                    )}

                    <ChevronDown
                      size={20}
                      className={`shrink-0 text-white/35 transition-transform duration-300 group-hover:text-white/70 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* EXPANDED CONTENT */}
                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-white/10 bg-[#06111f]/55 px-5 py-6 sm:px-7 sm:py-7">
                        {isVerified ? (
                          <>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                                <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-white/30">
                                  Batch
                                </p>
                                <p className="text-sm font-semibold text-white/85">
                                  {product.batch}
                                </p>
                              </div>

                              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                                <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-white/30">
                                  Status
                                </p>
                                <p className="text-sm font-semibold text-green-300">
                                  Third-Party Verified
                                </p>
                              </div>

                              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                                <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-white/30">
                                  Purity
                                </p>
                                <p className="text-sm font-semibold text-white/85">
                                  {product.purity || "—"}
                                </p>
                              </div>

                              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                                <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-white/30">
                                  Total mg Content
                                </p>
                                <p className="text-sm font-semibold text-blue-200">
                                  {product.totalContent ||
                                    product.content ||
                                    "—"}
                                </p>
                              </div>
                            </div>

                            {product.totalContent && product.content && (
                              <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                                <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-white/30">
                                  Component Content
                                </p>
                                <p className="text-sm leading-relaxed text-white/65">
                                  {product.content}
                                </p>
                              </div>
                            )}

                            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                              {product.coa && (
                                <a
                                  href={product.coa}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(event) =>
                                    event.stopPropagation()
                                  }
                                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-5 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-[#081526] transition-all hover:bg-blue-100"
                                >
                                  <FileText size={16} />
                                  {hasPreviousCoas
                                    ? "View Latest COA"
                                    : "View COA"}
                                </a>
                              )}

                              {hasPreviousCoas && (
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    togglePreviousCoas(
                                      product.name,
                                    );
                                  }}
                                  aria-expanded={
                                    isPreviousOpen
                                  }
                                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white/70 transition-all hover:border-blue-400/40 hover:bg-white/[0.07] hover:text-white"
                                >
                                  {isPreviousOpen
                                    ? "Hide Previous COAs"
                                    : `Previous COAs (${product.previousCoas?.length || 0})`}
                                  <ChevronDown
                                    size={16}
                                    className={`transition-transform duration-300 ${
                                      isPreviousOpen
                                        ? "rotate-180"
                                        : ""
                                    }`}
                                  />
                                </button>
                              )}
                            </div>

                            {hasPreviousCoas && (
                              <div
                                className={`grid transition-all duration-300 ${
                                  isPreviousOpen
                                    ? "mt-5 grid-rows-[1fr] opacity-100"
                                    : "grid-rows-[0fr] opacity-0"
                                }`}
                              >
                                <div className="overflow-hidden">
                                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.025] p-4 sm:p-5">
                                    <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">
                                      Previous Test Results
                                    </p>

                                    <div className="space-y-3">
                                      {product.previousCoas?.map(
                                        (
                                          previousCoa,
                                          previousIndex,
                                        ) => (
                                          <div
                                            key={`${product.name}-${previousCoa.batch}-${previousIndex}`}
                                            className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#081526]/65 p-4 sm:flex-row sm:items-center sm:justify-between"
                                          >
                                            <div className="grid flex-1 grid-cols-3 gap-4">
                                              <div>
                                                <p className="mb-1 text-[9px] uppercase tracking-[0.18em] text-white/30">
                                                  Batch
                                                </p>
                                                <p className="text-xs text-white/75">
                                                  {
                                                    previousCoa.batch
                                                  }
                                                </p>
                                              </div>

                                              <div>
                                                <p className="mb-1 text-[9px] uppercase tracking-[0.18em] text-white/30">
                                                  Purity
                                                </p>
                                                <p className="text-xs text-white/75">
                                                  {
                                                    previousCoa.purity
                                                  }
                                                </p>
                                              </div>

                                              <div>
                                                <p className="mb-1 text-[9px] uppercase tracking-[0.18em] text-white/30">
                                                  Total mg
                                                </p>
                                                <p className="text-xs text-white/75">
                                                  {
                                                    previousCoa.content
                                                  }
                                                </p>
                                              </div>
                                            </div>

                                            <a
                                              href={
                                                previousCoa.coa
                                              }
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              onClick={(event) =>
                                                event.stopPropagation()
                                              }
                                              className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-white/60 transition-all hover:border-blue-400/40 hover:text-white"
                                            >
                                              View
                                            </a>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] px-6 py-9 text-center">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                              <Clock3
                                size={20}
                                className="text-white/35"
                              />
                            </div>

                            <h3 className="text-base font-bold text-white/80">
                              COA Coming Soon
                            </h3>

                            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/35">
                              Third-party analytical testing is
                              pending. Results will be published here
                              when available.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-14 text-center">
              <Search
                size={26}
                className="mx-auto mb-4 text-white/25"
              />
              <p className="text-lg font-semibold text-white/70">
                No COAs found
              </p>
              <p className="mt-2 text-sm text-white/35">
                Try another product name, batch, or status filter.
              </p>
            </div>
          )}

          <div className="mt-10 rounded-[1.5rem] border border-white/10 bg-white/[0.025] px-6 py-5 text-center">
            <p className="text-xs leading-relaxed text-white/35">
              Certificates are displayed for research transparency and
              quality documentation. Testing status and batch records may
              be updated as new analytical results become available.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}