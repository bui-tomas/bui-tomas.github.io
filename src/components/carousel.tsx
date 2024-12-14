'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProjectCard from './card'

const projects = [
    {
        component: ProjectCard,
        title: "Linear Programming Optimizer"
    },
    // Add other projects here
]

const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0)

    const prevSlide = () => {
        setCurrentIndex((currentIndex - 1 + projects.length) % projects.length)
    }

    const nextSlide = () => {
        setCurrentIndex((currentIndex + 1) % projects.length)
    }

    return (
        <div className="relative w-full max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-lg">
                {projects.map((Project, index) => (
                    <div
                        key={index}
                        className={`transition-transform duration-500 ease-in-out ${index === currentIndex ? 'translate-x-0' :
                            index < currentIndex ? '-translate-x-full' : 'translate-x-full'
                            }`}
                    >
                        <Project.component />
                    </div>
                ))}
            </div>

            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#EFF4F0]/80 text-[#384640] p-2 rounded-full hover:bg-[#EFF4F0]"
            >
                <ChevronLeft size={24} />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#EFF4F0]/80 text-[#384640] p-2 rounded-full hover:bg-[#EFF4F0]"
            >
                <ChevronRight size={24} />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {projects.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-[#EFF4F0]' : 'bg-[#EFF4F0]/50'
                            }`}
                    />
                ))}
            </div>
        </div>
    )
}

export default Carousel