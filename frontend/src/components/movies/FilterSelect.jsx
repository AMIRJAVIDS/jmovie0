import { ChevronDown } from "../icons";

export default function FilterSelect({ label, value, options = [] }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="whitespace-nowrap text-sm text-white/60">{label}</span>
      <div className="relative">
        <select
          defaultValue={value}
          className="w-full appearance-none rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-9 pr-4
                     text-sm text-white/80 outline-none backdrop-blur transition
                     hover:border-white/20 focus:border-fuchsia-500/60 focus:ring-2 focus:ring-fuchsia-500/20"
        >
          <option value={value}>{value}</option>
          {options.map((o) => (
            <option key={o} value={o} className="bg-[#0b1024]">{o}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
      </div>
    </div>
  );
}
