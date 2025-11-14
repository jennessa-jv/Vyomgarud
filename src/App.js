// src/App.jsx
import React from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import ProductCards from "./components/ProductCards";
import Highlights from "./components/Highlights";
import Contact from "./components/Contact";

import ParticlesBackground from "./components/ParticlesBackground";
import FloatingHeadline from "./components/FloatingHeadline";
import ParallaxSection from "./components/ParallaxSection";
import DroneShowcase from "./components/DroneShowcase";

import useScrollReveal from "./hooks/useScrollReveal";

export default function App() {
  useScrollReveal(); // enables .reveal -> .revealed on scroll

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#070708,#0b0c0d)] text-white relative overflow-x-hidden">
      {/* background/ambient */}
      <ParticlesBackground />

      {/* site chrome */}
      <Nav />

      {/* floating headline (draggable) */}
      <FloatingHeadline text="Autonomy. Precision. Trust." />

      <main>
        {/* hero with tunnel + plane */}
        <Hero />

        {/* parallax section that uses the tunnel + plane */}
        <ParallaxSection />

        {/* NEW: Drone showcase (rotating 3D drone + stat blocks) */}
        <DroneShowcase />

        {/* product cards / platforms */}
        <ProductCards />

        {/* highlights */}
        <Highlights />

        {/* example content block that reveals on scroll */}
        <section className="py-28 px-6 md:px-12 lg:px-24 reveal">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Engineering for contested environments</h2>
            <p className="text-gray-300">
              We design with redundancy, hardened communications, and safe autonomy as default — delivering
              platforms that operate reliably where it matters most.
            </p>
          </div>
        </section>
      </main>

      {/* contact / footer */}
      <Contact />
    </div>
  );
}
