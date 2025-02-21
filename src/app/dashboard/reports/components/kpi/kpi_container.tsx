export function KpiContainer({ name, value }: { name: string; value: string }) {
  return (
    <div className="w-full h-full flex flex-col gap-2">
      <p className="text-black text-opacity-50 text-sm font-inter">{name}</p>
      <p className="font-bold text-3xl font-inter">{value}</p>
    </div>
  );
}
