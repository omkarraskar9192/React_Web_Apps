export default function HankoSeal({ text = 'DEV', subtext = '2026', size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-[9px]',
    md: 'w-10 h-10 text-[10px]',
    lg: 'w-12 h-12 text-xs',
    xl: 'w-16 h-16 text-sm'
  }

  return (
    <div
      className={`inline-flex flex-col items-center justify-center border border-[#ec4899] text-[#ec4899] font-mono rounded select-none p-0.5 relative group ${sizeClasses[size] || sizeClasses.md} ${className}`}
      title="Studio Seal"
    >
      <div className="leading-tight font-bold tracking-wider text-center">
        <div>{text}</div>
        {subtext && <div className="text-[0.7em] opacity-80">{subtext}</div>}
      </div>
      <div className="absolute inset-0 bg-[#ec4899]/5 pointer-events-none rounded" />
    </div>
  )
}
