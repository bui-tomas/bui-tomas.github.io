'use client'

import { ReactNode } from 'react'
import Background from './banner-background'

interface BannerProps {
    children: ReactNode
    showParticles?: boolean
    height?: string
    background?: string
    backdropClass?: string
    borderClass?: string
    shadowClass?: string
}

const Banner = ({
    children,
    showParticles = true,
    height = "h-[55vh]",
    background = "bg-slate-900",
    backdropClass = "backdrop-blur-sm bg-black/10",
    borderClass = "",
    shadowClass = ""
}: BannerProps) => {
    return (
        <div className={`relative w-full ${height} ${background} ${borderClass} ${shadowClass} overflow-hidden`}>
            {showParticles && <Background />}

            <div className="absolute inset-0 flex items-center justify-center">
                <div className={`text-center z-10 ${backdropClass} p-8 rounded-xl`}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Banner