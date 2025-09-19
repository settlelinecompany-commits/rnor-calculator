export default function Book() {
  return (
    <main className="min-h-screen bg-[#f6f0e8] p-8">
      <div className="mx-auto max-w-3xl bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-semibold mb-2">Book a Free 15-min Call</h1>
        <p className="text-neutral-600 mb-6">Pick a time that works for you.</p>

        {/* Replace the link below with your real HubSpot meeting URL when ready */}
        <a
          href="https://meetings.hubspot.com/"
          className="inline-block bg-black text-white px-4 py-2 rounded-lg"
        >
          Open my calendar
        </a>
      </div>
    </main>
  );
}
