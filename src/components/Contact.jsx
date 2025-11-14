export default function Contact() {
  return (
    <footer className="px-6 md:px-12 lg:px-24 py-12" id="contact">
      <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-2xl font-bold">Let’s talk</h3>
          <p className="mt-3 text-gray-300">
            For partnerships, demos, and procurement inquiries — reach out and
            we’ll respond within one business day.
          </p>

          <div className="mt-6 text-sm text-gray-400">
            <div>email: contact@vyomgarud.example</div>
            <div>phone: +91 88814 44693</div>
          </div>
        </div>

        <form className="flex flex-col gap-3">
          <input
            className="bg-[#0b0c0d] border border-gray-800 px-4 py-3 rounded text-sm"
            placeholder="Name"
          />
          <input
            className="bg-[#0b0c0d] border border-gray-800 px-4 py-3 rounded text-sm"
            placeholder="Email"
          />
          <textarea
            rows="4"
            className="bg-[#0b0c0d] border border-gray-800 px-4 py-3 rounded text-sm"
            placeholder="Message"
          />

          <button className="mt-2 bg-orange text-black px-4 py-3 rounded font-semibold">
            Send
          </button>
        </form>
      </div>

      <div className="mt-10 text-gray-600 text-sm">
        © {new Date().getFullYear()} VyomGarud — All rights reserved
      </div>
    </footer>
  );
}
