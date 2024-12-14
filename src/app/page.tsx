import Navbar from '@/components/navbar'
// import Carousel from '@/components/carousel'
import DataJourney from '@/components/data-journey'
import Banner from '@/components/banner'
import Footer from '@/components/footer'
import BackToTop from '@/components/back-to-top'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="bg-[var(--gray-light)]">
      <Navbar />

      <Banner
        borderClass="border-b border-white/20" 
        shadowClass="shadow-lg"
      >
        <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">
          Hi, I am Tomáš Bui
          <br />
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-transparent bg-clip-text">
            I really like to develop things
          </span>
        </h1>

        <div className="flex justify-center gap-4 mb-6">
          <Link
            href="/portfolio"
            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-colors"
          >
            Portfolio
          </Link>
          <Link
            href="/skills"
            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-colors"
          >
            Skills
          </Link>
        </div>

        <p className="text-white/90 text-xl md:text-2xl max-w-2xl mx-auto px-4">
          ... or check out some of my recent works down below
        </p>
      </Banner>

      {/* <Carousel /> */}
      <DataJourney />

      <Footer />

      <BackToTop />
    </main>
  )
}