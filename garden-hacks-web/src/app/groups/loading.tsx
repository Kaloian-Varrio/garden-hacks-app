export default function GroupsLoading() {
  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="h-4 w-28 rounded bg-[#dfe8d8]" />
        <div className="mt-4 h-10 w-72 rounded bg-[#dfe8d8]" />
        <div className="mt-3 h-5 max-w-2xl rounded bg-[#edf2e8]" />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-lg border border-[#dfe8d8] bg-white shadow-sm"
            >
              <div className="aspect-[16/10] bg-[#dfe8d8]" />
              <div className="space-y-3 p-5">
                <div className="h-6 w-2/3 rounded bg-[#dfe8d8]" />
                <div className="h-16 rounded bg-[#edf2e8]" />
                <div className="h-10 rounded bg-[#edf2e8]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
