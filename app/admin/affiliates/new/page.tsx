export default function NewAffiliatePage() {
  return (
    <main className="min-h-screen bg-[#081526] text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-4">
            Apexx Admin
          </p>

          <h1 className="text-5xl md:text-6xl font-black">
            Add Affiliate
          </h1>

          <p className="text-white/60 mt-4">
            Create an invite-only affiliate account.
          </p>
        </div>

        <form
          action="/api/admin/affiliates/invite"
          method="POST"
          className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 space-y-6"
        >
          <div>
            <label className="block text-sm uppercase tracking-widest text-white/50 mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              required
              className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 text-white outline-none focus:border-blue-400/50"
              placeholder="Ashley Smith"
            />
          </div>

          <div>
            <label className="block text-sm uppercase tracking-widest text-white/50 mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              required
              className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 text-white outline-none focus:border-blue-400/50"
              placeholder="ashley@email.com"
            />
          </div>

          <div>
            <label className="block text-sm uppercase tracking-widest text-white/50 mb-2">
              Affiliate Code
            </label>

            <input
              type="text"
              name="code"
              required
              className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 text-white uppercase outline-none focus:border-blue-400/50"
              placeholder="ASHLEY15"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm uppercase tracking-widest text-white/50 mb-2">
                Customer Discount %
              </label>

              <input
                type="number"
                name="discount"
                min="0"
                max="100"
                step="0.01"
                defaultValue="15"
                required
                className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 text-white outline-none focus:border-blue-400/50"
              />
            </div>

            <div>
              <label className="block text-sm uppercase tracking-widest text-white/50 mb-2">
                Commission %
              </label>

              <input
                type="number"
                name="commission"
                min="0"
                max="100"
                step="0.01"
                defaultValue="15"
                required
                className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 text-white outline-none focus:border-blue-400/50"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              className="rounded-full bg-blue-500 px-7 py-4 font-bold uppercase tracking-widest text-sm hover:bg-blue-400 transition-all"
            >
              Send Affiliate Invite
            </button>

            <a
              href="/admin/affiliates"
              className="rounded-full border border-white/10 bg-white/[0.04] px-7 py-4 text-center text-white/70 uppercase tracking-widest text-sm hover:bg-white/[0.08] transition-all"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}