import { motion } from "framer-motion";

const products = [
  {
    title: "Autonomous Surveillance UAV",
    desc: "Long-range, persistent ISR platform with modular payloads and hardened comms.",
    tag: "ISR"
  },
  {
    title: "Tactical Recon Drone",
    desc: "Lightweight, rapid-deploy drone for tactical units — rugged and low-noise.",
    tag: "Tactical"
  },
  {
    title: "Payload & Integration",
    desc: "Custom payload integration (EO/IR, LIDAR, SIGINT) for mission-specific needs.",
    tag: "Integration"
  }
];

export default function ProductCards() {
  return (
    <section className="px-6 md:px-12 lg:px-24 pb-20" id="products">
      <div className="max-w-6xl">
        <h3 className="text-orange font-semibold">Capabilities</h3>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <motion.div
              key={p.title}
              whileHover={{ y: -6 }}
              className="bg-[#0f1114] border border-gray-800 p-6 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-400">{p.tag}</div>
                  <h4 className="font-bold mt-2">{p.title}</h4>
                </div>
                <div className="text-orange font-semibold">→</div>
              </div>

              <p className="mt-4 text-gray-300 text-sm">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
