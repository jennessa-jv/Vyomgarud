export default function Highlights() {
  const items = [
    "Mil-Spec reliability & testing",
    "Encrypted comms & anti-jam design",
    "Rapid integration & modular payloads",
  ];

  return (
    <section className="px-6 md:px-12 lg:px-24 py-16 bg-transparent" id="highlights">
      <div className="max-w-5xl">
        {/* Header */}
        <h3 className="text-orange font-semibold text-xl tracking-wide">Highlights</h3>
        <p className="mt-1 text-gray-400 text-base">Key capabilities engineered for mission‑critical performance</p>

        {/* Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((text) => (
            <div
              key={text}
              className="bg-[#0f1114] border border-gray-800 rounded-xl p-5 text-base text-gray-300 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-orange/40"
            >
              <div className="flex items-start gap-3">
                {/* Small bullet icon */}
                <span className="mt-1 h-2 w-2 rounded-full bg-orange" />
                {text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
