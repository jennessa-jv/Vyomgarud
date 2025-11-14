export default function Highlights() {
  const items = [
    "Mil-Spec reliability & testing",
    "Encrypted comms & anti-jam design",
    "Rapid integration & modular payloads"
  ];

  return (
    <section className="px-6 md:px-12 lg:px-24 py-12">
      <div className="max-w-4xl">
        <h3 className="text-orange font-semibold">Highlights</h3>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((text) => (
            <div
              key={text}
              className="bg-[#0f1114] border border-gray-800 rounded p-4 text-sm text-gray-300"
            >
              {text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
