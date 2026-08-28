import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function formatDate(date?: string | null) {
  if (!date) return "Never";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type CustomersPageProps = {
  searchParams?: Promise<{
    search?: string;
    status?: string;
  }>;
};

export default async function CustomersPage({
  searchParams,
}: CustomersPageProps) {
  const params = (await searchParams) || {};

  const search = String(params.search || "")
    .trim()
    .toLowerCase();

  const status = String(
    params.status || "all"
  ).toLowerCase();

  const {
    data: { users },
    error,
  } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (error) {
    return (
      <main className="min-h-screen bg-[#081526] px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <a
            href="/admin"
            className="mb-8 inline-block text-sm text-blue-300 hover:text-blue-200"
          >
            ← Back to Dashboard
          </a>

          <h1 className="text-4xl font-black">
            Customers
          </h1>

          <div className="mt-8 rounded-[28px] border border-red-400/20 bg-red-500/10 p-6 text-red-200">
            Unable to load customers:{" "}
            {error.message}
          </div>
        </div>
      </main>
    );
  }

  const customers = users || [];

  const verifiedCustomers =
    customers.filter(
      (user) => !!user.email_confirmed_at
    ).length;

  const unverifiedCustomers =
    customers.length - verifiedCustomers;

  const filteredCustomers =
    customers.filter((user) => {
      const verified =
        !!user.email_confirmed_at;

      const firstName =
        user.user_metadata?.first_name || "";

      const lastName =
        user.user_metadata?.last_name || "";

      const fullName =
        firstName || lastName
          ? `${firstName} ${lastName}`.trim()
          : user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            "";

      const email =
        user.email || "";

      const matchesSearch =
        !search ||
        email
          .toLowerCase()
          .includes(search) ||
        fullName
          .toLowerCase()
          .includes(search);

      let matchesStatus = true;

      if (status === "verified") {
        matchesStatus = verified;
      }

      if (status === "unverified") {
        matchesStatus = !verified;
      }

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  return (
    <main className="min-h-screen bg-[#081526] px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-10">
          <a
            href="/admin"
            className="mb-6 inline-block text-sm text-blue-300 transition hover:text-blue-200"
          >
            ← Back to Dashboard
          </a>

          <p className="mb-3 text-sm uppercase tracking-[0.35em] text-blue-300">
            Apexx Admin
          </p>

          <h1 className="text-5xl font-black">
            Customers
          </h1>

          <p className="mt-3 text-white/50">
            Manage customer accounts,
            verification status, and
            account activity.
          </p>
        </div>

        {/* STATS */}

        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">

          <div className="rounded-[28px] border border-blue-400/15 bg-white/[0.04] p-6">
            <p className="text-sm uppercase tracking-widest text-white/50">
              Total Accounts
            </p>

            <p className="mt-3 text-4xl font-black">
              {customers.length}
            </p>
          </div>

          <div className="rounded-[28px] border border-green-400/20 bg-green-500/[0.06] p-6">
            <p className="text-sm uppercase tracking-widest text-green-200/70">
              Verified
            </p>

            <p className="mt-3 text-4xl font-black text-green-200">
              {verifiedCustomers}
            </p>
          </div>

          <div className="rounded-[28px] border border-yellow-400/20 bg-yellow-500/[0.07] p-6">
            <p className="text-sm uppercase tracking-widest text-yellow-200/70">
              Awaiting Verification
            </p>

            <p className="mt-3 text-4xl font-black text-yellow-200">
              {unverifiedCustomers}
            </p>
          </div>

        </div>

        {/* SEARCH + FILTERS */}

        <div className="mb-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-5">

          <form
            method="GET"
            className="flex flex-col gap-4 lg:flex-row lg:items-center"
          >

            <div className="flex-1">
              <input
                type="text"
                name="search"
                defaultValue={
                  params.search || ""
                }
                placeholder="Search by customer name or email..."
                className="w-full rounded-2xl border border-white/10 bg-[#0c1d31] px-5 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-blue-400/50"
              />
            </div>

            <select
              name="status"
              defaultValue={status}
              className="rounded-2xl border border-white/10 bg-[#0c1d31] px-5 py-4 text-white outline-none transition focus:border-blue-400/50"
            >
              <option value="all">
                All Accounts
              </option>

              <option value="verified">
                Verified
              </option>

              <option value="unverified">
                Awaiting Verification
              </option>
            </select>

            <button
              type="submit"
              className="rounded-2xl bg-blue-500 px-7 py-4 font-bold text-white transition hover:bg-blue-400"
            >
              Search
            </button>

            {(search ||
              status !== "all") && (
              <a
                href="/admin/customers"
                className="rounded-2xl border border-white/10 px-7 py-4 text-center font-semibold text-white/70 transition hover:bg-white/[0.05] hover:text-white"
              >
                Clear
              </a>
            )}

          </form>

        </div>

        {/* RESULTS COUNT */}

        <div className="mb-4 flex items-center justify-between gap-4">

          <p className="text-sm text-white/40">
            Showing{" "}
            <span className="font-semibold text-white/70">
              {
                filteredCustomers.length
              }
            </span>{" "}
            customer
            {filteredCustomers.length === 1
              ? ""
              : "s"}
          </p>

        </div>

        {/* CUSTOMER TABLE */}

        <div className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04]">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1150px] text-left">

              <thead className="border-b border-white/10 bg-white/[0.03]">

                <tr>

                  <th className="px-6 py-5 text-xs uppercase tracking-widest text-white/40">
                    Customer
                  </th>

                  <th className="px-6 py-5 text-xs uppercase tracking-widest text-white/40">
                    Email
                  </th>

                  <th className="px-6 py-5 text-xs uppercase tracking-widest text-white/40">
                    Status
                  </th>

                  <th className="px-6 py-5 text-xs uppercase tracking-widest text-white/40">
                    Joined
                  </th>

                  <th className="px-6 py-5 text-xs uppercase tracking-widest text-white/40">
                    Last Sign In
                  </th>

                  <th className="px-6 py-5 text-right text-xs uppercase tracking-widest text-white/40">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredCustomers.map(
                  (user) => {
                    const verified =
                      !!user.email_confirmed_at;

                    const firstName =
                      user.user_metadata
                        ?.first_name;

                    const lastName =
                      user.user_metadata
                        ?.last_name;

                    const fullName =
                      firstName || lastName
                        ? `${
                            firstName || ""
                          } ${
                            lastName || ""
                          }`.trim()
                        : user
                            .user_metadata
                            ?.full_name ||
                          user
                            .user_metadata
                            ?.name ||
                          "—";

                    return (
                      <tr
                        key={user.id}
                        className="border-b border-white/[0.06] transition hover:bg-white/[0.03]"
                      >

                        <td className="px-6 py-5">
                          <div className="font-semibold text-white">
                            {fullName}
                          </div>
                        </td>

                        <td className="px-6 py-5 text-white/70">
                          {user.email ||
                            "—"}
                        </td>

                        <td className="px-6 py-5">

                          {verified ? (
                            <span className="inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-200">

                              <span className="h-1.5 w-1.5 rounded-full bg-green-300" />

                              Verified

                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-500/10 px-3 py-1.5 text-xs font-semibold text-yellow-200">

                              <span className="h-1.5 w-1.5 rounded-full bg-yellow-300" />

                              Awaiting
                              Verification

                            </span>
                          )}

                        </td>

                        <td className="px-6 py-5 text-white/60">
                          {formatDate(
                            user.created_at
                          )}
                        </td>

                        <td className="px-6 py-5 text-white/60">

                          {user.last_sign_in_at ? (
                            formatDate(
                              user.last_sign_in_at
                            )
                          ) : (
                            <span className="text-white/30">
                              Never
                            </span>
                          )}

                        </td>

                        <td className="px-6 py-5 text-right">

                          <a
                            href={`/admin/customers/${user.id}`}
                            className="inline-flex items-center gap-2 rounded-xl border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200 transition hover:border-blue-400/40 hover:bg-blue-500/20"
                          >
                            View Customer
                            <span>
                              →
                            </span>
                          </a>

                        </td>

                      </tr>
                    );
                  }
                )}

                {filteredCustomers.length ===
                  0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-16 text-center"
                    >
                      <p className="text-lg font-semibold text-white/60">
                        No customers found
                      </p>

                      <p className="mt-2 text-sm text-white/30">
                        Try changing your
                        search or filter.
                      </p>
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </main>
  );
}