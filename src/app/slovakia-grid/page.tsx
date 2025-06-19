import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import BackToTop from "@/components/back-to-top";
import SlovakiaMap from "@/components/map/map";
import Banner from "@/components/banner/banner";

export default function Home() {
  return (
    <main className="bg-[var(--gray-light)]">
      <Navbar />

      <Banner
        borderClass="border-b border-white/80"
        shadowClass="shadow-lg"
        height="h-[28vh]"
        backdropClass=""
        showParticles={false}
        background="bg-white"
      >
        <h1 className="text-black text-6xl font-bold">
          Slovakia - Electrical Grid Overview
        </h1>

        <div>Home &gt; Grid &gt; Slovakia </div>
      </Banner>

      <div className="w-full px-12 py-12">
        <div className="grid grid-cols-5 gap-4 items-start max-w-full">
          {/* Left: Table of Contents - 20% */}
          <div className="col-span-1 mx-12">
            <div className="sticky top-8">
              <h3 className="text-2xl font-bold mb-4 border-b pb-4">Contents</h3>

              <nav className="space-y-2 bg-[var(--gray-light)]">
                <a href="#overview" className="block text-sm">
                  Overview
                </a>
                <a href="#transmission" className="block text-sm">
                  Transmission network
                </a>
                <a href="#generation" className="block text-sm">
                  Power generation
                </a>
                <a href="#substations" className="block text-sm">
                  Substations
                </a>
                <a href="#interconnections" className="block text-sm">
                  Cross-border connections
                </a>
                <a href="#grid-code" className="block text-sm">
                  Grid code and standards
                </a>
                <a href="#future" className="block text-sm">
                  Future development
                </a>
              </nav>
            </div>
          </div>

          {/* Right: Map - 80% */}
          <div className="col-span-4">
            <div
              id="about"
              className="flex items-center justify-center space-x-4 py-8 mx-48"
            >
              <div className="flex-1 h-px bg-[#A27B5C]/20"></div>
              <p className="text-2xl font-bold">Grid Map</p>
              <div className="flex-1 h-px bg-[#A27B5C]/20"></div>
            </div>

            <div>
              <SlovakiaMap className="w-full shadow-lg rounded-lg" />
            </div>

            <div
              id="about"
              className="flex items-center justify-center space-x-4 py-16 mx-48"
            >
              <div className="flex-1 h-px bg-[#A27B5C]/20"></div>
              <p className="text-2xl font-medium">Graph - Lorem Ipsum </p>
              <div className="flex-1 h-px bg-[#A27B5C]/20"></div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <BackToTop />
    </main>
  );
}
