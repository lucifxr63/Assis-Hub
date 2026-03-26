"use client"

import { ReactNode } from "react"

interface MobileFrameProps {
  children: ReactNode
}

export function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className="relative">
      {/* Phone Frame */}
      <div className="relative w-[375px] h-[812px] bg-foreground rounded-[3rem] p-3 shadow-2xl">
        {/* Screen */}
        <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden relative">
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 z-50 h-11 px-6 flex items-center justify-between text-foreground bg-background/80 backdrop-blur-sm">
            <span className="text-xs font-medium">9:41</span>
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-32 h-7 bg-foreground rounded-b-2xl" />
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 17h2v4H2v-4zm5-5h2v9H7v-9zm5-5h2v14h-2V7zm5-4h2v18h-2V3z"/>
              </svg>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
              </svg>
              <svg className="w-6 h-4" viewBox="0 0 28 14" fill="currentColor">
                <rect x="0" y="2" width="22" height="10" rx="2" stroke="currentColor" strokeWidth="1" fill="none"/>
                <rect x="2" y="4" width="16" height="6" rx="1" fill="currentColor"/>
                <rect x="23" y="5" width="2" height="4" rx="0.5" fill="currentColor"/>
              </svg>
            </div>
          </div>

          {/* App Content */}
          <div className="h-full pt-11 pb-0">
            {children}
          </div>
        </div>
      </div>

      {/* Side Buttons */}
      <div className="absolute left-0 top-28 w-1 h-8 bg-foreground rounded-l-sm" />
      <div className="absolute left-0 top-40 w-1 h-14 bg-foreground rounded-l-sm" />
      <div className="absolute left-0 top-56 w-1 h-14 bg-foreground rounded-l-sm" />
      <div className="absolute right-0 top-36 w-1 h-16 bg-foreground rounded-r-sm" />
    </div>
  )
}
