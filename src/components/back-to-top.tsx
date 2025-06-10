'use client'

import { useEffect, useState } from 'react'
import { ChevronUp } from 'lucide-react'

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 300)
        }

        window.addEventListener('scroll', toggleVisibility)
        return () => window.removeEventListener('scroll', toggleVisibility)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-8 right-8 p-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full shadow-lg transition-opacity duration-300 hover:from-amber-600 hover:to-orange-600 z-50 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
        >
            <ChevronUp size={24} />
        </button>
    )
}

export default BackToTop