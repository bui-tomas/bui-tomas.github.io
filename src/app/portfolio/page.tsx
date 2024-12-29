// app/portfolio/page.tsx
'use client';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import BackToTop from '@/components/back-to-top';
import Banner from '@/components/banner'
import ProjectGrid from '@/components/project-grid';

const projects = [
    {
        id: '1',
        title: 'Heart Disease Model',
        description: 'Heart Disease Classification using ML',
        fullDescription: 'Simple Logistic Regression model used for binary classification of heart disease',
        techStack: ['Python', 'Pandas', 'Seaborn', 'scikit-learn'],
        images: ['/images/projects/heart1.png', '/images/projects/heart2.png'],
        liveUrl: 'https://example.com',
        codeUrl: 'https://github.com/example',
    },
    {
      id: '2',
      title: 'Portfolio Website',
      description: 'Personal portfolio built with Next.js and TypeScript',
      fullDescription: 'A modern, responsive portfolio website showcasing my projects and skills...',
      techStack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
      images: ['/images/projects/portfolio1.png', '/images/projects/portfolio2.png'],
      liveUrl: 'https://example.com',
      codeUrl: 'https://github.com/example',
  },
];

export default function PortfolioPage() {
    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />

            <Banner
            showParticles={false}
            background="bg-white"
            backdropClass=""
            height = "h-[60vh]"
            borderClass="border border-gray-200"
            shadowClass="shadow-lg"
            >
                <div className="banner-content flex flex-col md:flex-row items-center gap-8 max-w-7xl mx-auto">
                    <div className="w-full md:w-1/2 text-left">
                        <h1 className="text-slate-900 text-4xl md:text-6xl font-bold mb-4">
                            My Portfolio
                        </h1>
                        <p className="text-slate-700 text-lg md:text-xl mb-6">
                            Check out some of my latest works. You can find all sorts of projects 
                            mainly based on my university knowledge and personal interests.
                        </p>
                    </div>
                </div>
            </Banner>
            
            <div className="container mx-auto py-8">
              <ProjectGrid projects={projects} />
            </div>

            <BackToTop />
            
            <Footer />
        </main>
    );
}