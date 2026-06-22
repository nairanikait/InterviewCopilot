/**
 * StatCard – compact metric tile used in the Dashboard overview row.
 */
export function StatCard({ label, value, icon }) {
  return (
    <div className="card flex items-center gap-4 px-5 py-4">
      <div className="h-10 w-10 rounded-xl bg-dark-100 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-widest text-dark-400 uppercase">{label}</p>
        <p className="text-2xl font-bold text-dark-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
}
