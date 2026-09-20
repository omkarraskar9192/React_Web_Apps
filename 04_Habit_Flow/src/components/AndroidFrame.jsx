import { useSelector, useDispatch } from 'react-redux'
import { toggleAndroidPreview } from '../store/uiSlice'
import { Smartphone, Monitor, Wifi, Battery, Signal } from 'lucide-react'

export default function AndroidFrame({ children }) {
  const dispatch = useDispatch()
  const androidPreview = useSelector((state) => state.ui.androidPreview)

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  })

  return (
    <div className="min-h-screen bg-[#ece8de] dark:bg-[#0a0f0c] transition-colors flex flex-col items-center">
      {/* Top Floating Control Bar for Android Toggle */}
      <div className="w-full flex items-center justify-between px-4 sm:px-6 py-2.5 bg-[#faf8f4]/90 dark:bg-[#111a14]/90 border-b border-[#e2ddd1] dark:border-[#1e2c22] backdrop-blur-md text-xs font-semibold text-[#546257] dark:text-[#a0b2a3] z-40">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#48a368]" />
          <span>HabitFlow Mobile & Web Edition</span>
        </div>

        <button
          type="button"
          onClick={() => dispatch(toggleAndroidPreview())}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
            androidPreview
              ? 'bg-[#273a2d] text-white border-[#273a2d] dark:bg-[#78c794] dark:text-[#111a14] shadow-xs'
              : 'bg-[#f4f1ea] hover:bg-[#e9e4d9] dark:bg-[#1c2920] dark:hover:bg-[#25362c] text-[#344237] dark:text-[#d3e3d6] border-[#dad4c7] dark:border-[#2a3c30]'
          }`}
          title="Toggle Android Phone Frame"
        >
          {androidPreview ? (
            <>
              <Monitor className="w-3.5 h-3.5" />
              <span>Full Screen</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android Preview (9:19.5)</span>
            </>
          )}
        </button>
      </div>

      {/* Frame Container */}
      {androidPreview ? (
        <div className="flex-1 w-full flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          {/* Android Device Shell (Pixel / Galaxy 9:19.5 Ratio) */}
          <div className="relative w-full max-w-[393px] h-[840px] max-h-[92vh] rounded-[48px] bg-[#1a1f1c] p-3 shadow-2xl border-[6px] border-[#29322c] flex flex-col overflow-hidden ring-1 ring-black/10">
            {/* Screen Inner Bezel */}
            <div className="relative flex-1 w-full rounded-[38px] bg-[#faf8f5] dark:bg-[#111a14] flex flex-col overflow-hidden">
              {/* Android Status Bar with Camera Punchhole */}
              <div className="h-9 px-6 flex items-center justify-between text-[11px] font-bold text-[#324036] dark:text-[#cbe0d0] select-none shrink-0 bg-[#faf8f5] dark:bg-[#111a14] border-b border-[#eae5da]/40 dark:border-[#223026]/40 z-30">
                <span>{currentTime}</span>

                {/* Camera Punchhole Notch */}
                <div className="w-3.5 h-3.5 rounded-full bg-black border border-[#2d3a31]/50 shadow-inner" />

                <div className="flex items-center gap-1.5 opacity-80">
                  <Signal className="w-3 h-3" />
                  <Wifi className="w-3 h-3" />
                  <Battery className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* App Content */}
              <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                {children}
              </div>

              {/* Android Bottom Gesture Navigation Pill */}
              <div className="h-4 shrink-0 flex items-center justify-center bg-[#faf8f5] dark:bg-[#111a14] safe-area-pb">
                <div className="w-32 h-1 rounded-full bg-[#3c4a40]/30 dark:bg-white/30" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex-1 flex flex-col">{children}</div>
      )}
    </div>
  )
}

