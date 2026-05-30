export default function ProcessPage() {
  const steps = [
    {
      number: "1",
      icon: "flask",
      title: "Sourcing",
      text: "We source high-quality research materials from trusted and verified suppliers.",
    },
    {
      number: "2",
      icon: "clipboard",
      title: "Testing & Verification",
      text: "Each batch is reviewed for identity, purity, and consistency with COA documentation.",
    },
    {
      number: "3",
      icon: "shield",
      title: "Batch Tracking",
      text: "Products are organized with batch information to support traceability and consistency.",
    },
    {
      number: "4",
      icon: "vial",
      title: "Professional Packaging",
      text: "Materials are prepared in secure, professional, and tamper-conscious packaging.",
    },
    {
      number: "5",
      icon: "box",
      title: "Secure Shipping",
      text: "Orders are packaged carefully and shipped discreetly with tracking information.",
    },
    {
      number: "6",
      icon: "check",
      title: "Delivery & Support",
      text: "Customers receive delivery updates and support for order-related questions.",
    },
  ];

  const renderIcon = (icon: string) => {
    if (icon === "flask") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className="w-16 h-16 text-blue-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 2v5l-5 8a4 4 0 003.4 6h7.2A4 4 0 0019 15l-5-8V2"
          />
        </svg>
      );
    }

    if (icon === "clipboard") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className="w-16 h-16 text-blue-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 3h6l1 2h3v16H5V5h3l1-2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-5"
          />
        </svg>
      );
    }

    if (icon === "shield") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className="w-16 h-16 text-blue-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 12l3 3 5-6"
          />
        </svg>
      );
    }

    if (icon === "vial") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className="w-16 h-16 text-blue-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 2h6v4l3 5v9H6v-9l3-5V2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 15h8"
          />
        </svg>
      );
    }

    if (icon === "box") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className="w-16 h-16 text-blue-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7l9-4 9 4-9 4-9-4z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7v10l9 4 9-4V7"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 11v10"
          />
        </svg>
      );
    }

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        className="w-16 h-16 text-blue-400"
      >
        <circle cx="12" cy="12" r="9" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 12l3 3 5-6"
        />
      </svg>
    );
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-24">
      <a
        href="/"
        className="text-blue-400 uppercase tracking-widest text-sm hover:text-blue-300 transition-all"
      >
        ← Back to Home
      </a>

      <section className="max-w-7xl mx-auto mt-16 text-center">
        <p className="uppercase tracking-[0.4em] text-blue-500 text-sm mb-6">
          Apexx Biolabs
        </p>

        <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-white via-blue-300 to-blue-600 bg-clip-text text-transparent mb-6">
          Our Process
        </h1>

        <p className="text-2xl md:text-3xl font-bold tracking-[0.35em] uppercase mb-6">
          Quality.{" "}
          <span className="text-blue-400">Transparency.</span>{" "}
          Reliability.
        </p>

        <p className="text-gray-400 text-lg max-w-4xl mx-auto leading-relaxed mb-20">
          From sourcing to delivery, each step is designed to support consistency,
          traceability, secure handling, and a professional research-use
          experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative border border-blue-800 rounded-3xl p-6 bg-[#050505] shadow-[0_0_35px_rgba(37,99,235,0.16)] hover:border-blue-400 hover:shadow-[0_0_45px_rgba(37,99,235,0.28)] transition-all"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border border-blue-500 bg-blue-700 text-white flex items-center justify-center text-xl font-bold shadow-[0_0_25px_rgba(37,99,235,0.65)]">
                {step.number}
              </div>

              <div className="mt-10 flex justify-center mb-6">
                {renderIcon(step.icon)}
              </div>

              <h2 className="text-xl font-bold uppercase tracking-widest mb-5">
                {step.title}
              </h2>

              <div className="h-[1px] w-full bg-blue-800 mb-5" />

              <p className="text-gray-400 text-sm leading-relaxed">
                {step.text}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-14 border border-blue-900 rounded-3xl p-6 bg-[#050505]">
          {[
            "COA Verified",
            "Research Use Only",
            "Secure & Discreet",
            "Batch Tracked",
            "Quality Focused",
          ].map((item) => (
            <div
              key={item}
              className="text-blue-400 uppercase tracking-widest text-sm font-semibold"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="mt-12 border border-blue-900 rounded-3xl p-8 bg-[#050505]">
          <p className="text-gray-300 uppercase tracking-[0.25em] text-sm leading-relaxed">
            For laboratory research use only.
            <span className="text-blue-400">
              {" "}
              Not intended for human or veterinary use.
            </span>
          </p>
        </div>
      </section>
    </main>
  );
}