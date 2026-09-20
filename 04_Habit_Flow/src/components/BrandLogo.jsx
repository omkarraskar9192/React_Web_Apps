export default function BrandLogo({ size = 'md', showText = true, className = '' }) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  }

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Modern geometric continuous habit loop logo */}
      <div
        className={`${iconSizes[size] || iconSizes.md} rounded-xl bg-gradient-to-tr from-[#0284c7] via-[#06b6d4] to-[#00e5ff] p-0.5 shadow-md shadow-[#06b6d4]/30 flex items-center justify-center`}
      >
        <div className="w-full h-full rounded-[10px] bg-[#071d28]/40 backdrop-blur-xs flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-5 h-5 text-white drop-shadow-sm"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Elegant double continuous loop representing habits and daily cycles */}
            <circle cx="12" cy="12" r="7" strokeDasharray="32 10" />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
            <path d="M12 2v3M22 12h-3" stroke="white" strokeWidth="2.5" />
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-serif font-black tracking-tight text-[#082836] dark:text-[#f0f9ff] leading-none ${
              textSizes[size] || textSizes.md
            }`}
          >
            Habit<span className="text-[#0284c7] dark:text-[#00e5ff]">Flow</span>
          </span>
          <span className="text-[9px] font-extrabold tracking-widest uppercase text-[#528499] dark:text-[#7eb6cc] mt-0.5">
            Relentless Rhythm
          </span>
        </div>
      )}
    </div>
  )
}

