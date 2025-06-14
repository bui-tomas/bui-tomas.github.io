import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import BackToTop from '@/components/back-to-top'
import SlovakiaMap from '@/components/map'


export default function Home() {
  return (
    <main className="bg-[var(--gray-light)]">
      <Navbar />

      <div className="relative w-full pb-32">
        {/* Full-width map */}
        <div className="w-full">
          <SlovakiaMap className="w-full" />
        </div>
        
        {/* Top-left card */}
        <div className="absolute top-8 left-8 bg-white rounded-xl shadow-lg p-6 z-[1000]">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Slovakia - Grid Map</h3>
        </div>
      </div>
      
      <Footer />
      
      <BackToTop />
    </main>
  )
}