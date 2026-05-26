export default function GroupDetailsLoading() {
  return (
    <div>
      <section className="bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="aspect-[4/3] rounded-lg border border-[#dfe8d8] bg-[#dfe8d8]" />
          <div>
            <div className="h-4 w-28 rounded bg-[#dfe8d8]" />
            <div className="mt-4 h-12 max-w-xl rounded bg-[#dfe8d8]" />
            <div className="mt-5 h-24 max-w-2xl rounded bg-[#edf2e8]" />
            <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-md">
              <div className="h-24 rounded-lg bg-[#f8faf7]" />
              <div className="h-24 rounded-lg bg-[#f8faf7]" />
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[340px_1fr]">
          <div className="space-y-5">
            <div className="h-56 rounded-lg border border-[#dfe8d8] bg-white" />
            <div className="h-72 rounded-lg border border-[#dfe8d8] bg-white" />
          </div>
          <div className="space-y-4">
            <div className="h-10 max-w-sm rounded bg-[#dfe8d8]" />
            <div className="h-40 rounded-lg border border-[#dfe8d8] bg-white" />
            <div className="h-40 rounded-lg border border-[#dfe8d8] bg-white" />
          </div>
        </div>
      </section>
    </div>
  );
}
