import Navbar from '@/components/navbar'
// import Carousel from '@/components/carousel'
import DataJourney from '@/components/data-journey'
import Banner from '@/components/banner'
import Footer from '@/components/footer'
import BackToTop from '@/components/back-to-top'
import Link from 'next/link'

export default function Portfolio() {
  return (
    <main className="bg-[var(--gray-light)] min-h-screen">
      <Navbar />
      
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
            Sorry If You Are Reading This
          </h1>
          <p className="text-xl md:text-2xl text-slate-700">
            There is nothing here yet for I am still conjuring... 🥺
          </p>
        </div>
      </div>

      <Footer />
      <BackToTop />
    </main>
  )
}