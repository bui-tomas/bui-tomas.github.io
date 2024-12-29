'use client'

import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import Banner from '@/components/banner'
import SkillSection from '@/components/skills-section'
import BackToTop from '@/components/back-to-top'

export default function Skills() {
    return (
        <main className="bg-[var(--gray-light)]">
            <Navbar />

            <Banner
                showParticles={false}
                background="bg-white"
                backdropClass=""
                height="h-[50vh]"
                borderClass="border border-gray-200"
                shadowClass="shadow-lg"
            >
                <div className="relative w-full h-full">
                    {/* Content */}
                    <div className="relative h-full">
                        <div className="banner-content animate-fade-in flex flex-col justify-center h-full max-w-7xl mx-auto px-4">
                            <div className="w-full lg:w-[60%] text-left">
                                <h1 className="text-slate-900 text-4xl md:text-6xl font-bold mb-4">
                                    My Skills
                                </h1>
                                <p className="text-slate-700 text-lg md:text-xl mb-6">
                                    Hey there! At FIIT STU Bratislava, I've been diving into all sorts of cool tech stuff. 
                                    Started with the basics of programming, worked my way through data structures and algorithms, 
                                    and now I'm absolutely hooked on Machine Learning. These days, you'll find me tinkering 
                                    with PyTorch and getting excited about every new AI concept I learn.
                                </p>
                                <p className="text-slate-600 text-base md:text-lg">
                                    Ready? Here's what I got!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Banner>

            <SkillSection />
            <Footer />
            <BackToTop />
        </main>
    )
}