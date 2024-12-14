'use client'

import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function CV() {
    return (
        <main className="bg-[var(--gray-light)]">
            <Navbar />
            <div className="min-h-screen py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl font-bold text-[#2C3639] mb-8">My CV</h1>
                    <iframe
                        src="/cv.pdf"
                        className="w-full h-[800px] border-none rounded-lg shadow-lg"
                    />
                </div>
            </div>
            <Footer />
        </main>
    )
}