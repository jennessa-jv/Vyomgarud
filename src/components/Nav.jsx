export default function Nav() {
  return (
    <header className="w-full flex items-center justify-between py-6 px-6 md:px-12 lg:px-24">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-md bg-orange flex items-center justify-center text-black font-bold">
          VG
        </div>
        <div className="text-sm font-semibold tracking-wide">VyomGarud</div>
      </div>
      <nav className="hidden md:flex gap-8 items-center text-sm text-gray-300">
        <a href="#about">About</a>
        <a href="#products">Products</a>
        <a href="#contact">Contact</a>
        <button className="ml-4 px-4 py-2 border border-orange text-orange rounded">
          Request Demo
        </button>
      </nav>
    </header>
  );
}
