export default function Badge({ label, dot = true, className = '' }) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 border border-neutral-200/90 shadow-2xs text-neutral-800 text-xs tracking-wider transition-all duration-300 hover:border-pink-300 hover:bg-white ${className}`}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ec4899] opacity-60"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ec4899]"></span>
        </span>
      )}
      <span className="font-sans text-[11px] font-semibold tracking-widest uppercase text-neutral-700">
        {label}
      </span>
    </div>
  )
}
