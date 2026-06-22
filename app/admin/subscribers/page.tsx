import { supabase } from "@/lib/supabase";

export default async function SubscribersPage() {
  const { data: subscribers, error } = await supabase
    .from("promo_subscribers")
    .select("email, first_name, last_name, source, marketing_consent, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-[#081526] text-white p-10">
        <p>Error loading subscribers.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#081526] text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <a
          href="/admin"
          className="inline-flex mb-8 text-blue-300 hover:text-white text-sm uppercase tracking-widest transition-all"
        >
          ← Back to Dashboard
        </a>

        <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-4">
          Admin
        </p>

        <h1 className="text-5xl font-black mb-4">Promo Subscribers</h1>

        <p className="text-white/60 mb-10">
          Total Subscribers: {subscribers?.length || 0}
        </p>

        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-white/[0.05] text-blue-300 uppercase tracking-widest text-xs">
              <tr>
                <th className="p-5">Email</th>
                <th className="p-5">First Name</th>
                <th className="p-5">Last Name</th>
                <th className="p-5">Source</th>
                <th className="p-5">Consent</th>
                <th className="p-5">Joined</th>
              </tr>
            </thead>

            <tbody>
              {subscribers?.map((subscriber) => (
                <tr
                  key={subscriber.email}
                  className="border-t border-white/10 text-white/70"
                >
                  <td className="p-5">{subscriber.email}</td>
                  <td className="p-5">{subscriber.first_name || "—"}</td>
                  <td className="p-5">{subscriber.last_name || "—"}</td>
                  <td className="p-5">{subscriber.source || "—"}</td>
                  <td className="p-5">
                    {subscriber.marketing_consent ? "Yes" : "No"}
                  </td>
                  <td className="p-5">
                    {new Date(subscriber.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}