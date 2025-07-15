"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import BackToTop from "@/components/back-to-top";
import Banner from "@/components/banner/banner";
import { Contents } from "./components";
import MainContent from "./main-content";

export default function Home() {
  const [isTocOpen, setIsTocOpen] = useState(false);

  return (
    <main className="bg-[var(--gray-light)]">
      <Navbar />

      <Banner
        borderClass="border-b border-white/80"
        shadowClass="shadow-lg"
        height="h-[14vh]"
        backdropClass=""
        showParticles={false}
        background="bg-white"
      >
        <h1 className="text-black text-3xl md:text-6xl font-bold">
          Slovakia - Energy Sector Overview
        </h1>
      </Banner>

      <div className="w-full pb-[300px]">
        {/* Mobile TOC Button - Shows on screens ≤1535px */}
        {!isTocOpen && (
          <div className="2xl:hidden fixed top-24 left-4 z-50">
            <button
              onClick={() => setIsTocOpen(!isTocOpen)}
              className="p-3 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50"
            >
              <Menu size={20} />
            </button>
          </div>
        )}

        {/* Mobile/Tablet TOC Sidebar Overlay */}
        {isTocOpen && (
          <div className="2xl:hidden fixed inset-0 z-40">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setIsTocOpen(false)}
            />

            {/* Sidebar - Match the gray background */}
            <div className="absolute left-0 top-0 h-full w-80 bg-[var(--gray-light)] shadow-xl overflow-y-auto">
              {/* Simple header */}
              <div className="flex items-center justify-between p-4 border-b">
                <button
                  onClick={() => setIsTocOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X size={20} />
                </button>
              </div>
              <Contents />
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 2xl:grid-cols-5 gap-4 max-w-full">
          {/* Desktop TOC - Only shows on 2xl screens (1536px+) */}
          <div className="hidden 2xl:block sticky top-6 self-start pt-12">
            <Contents />
          </div>

          {/* Content */}
          <div className="col-span-1 2xl:col-span-4">
            <MainContent />
          </div>
        </div>
      </div>

      <Footer />
      <BackToTop />
    </main>
  );
}
