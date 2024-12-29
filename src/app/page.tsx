import Navbar from '@/components/navbar'
import Banner from '@/components/banner'
import Footer from '@/components/footer'
import BackToTop from '@/components/back-to-top'
import Link from 'next/link'
import TypeWriter from '@/components/typewriter'
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

export default function Home() {
  return (
    <main className="bg-[var(--gray-light)]">
      <Navbar />

      <Banner
        borderClass="border-b border-white/80" 
        shadowClass="shadow-lg"
        height = "h-[80vh]"
      >
        <h1 className="text-white text-4xl md:text-6xl font-bold">
          <TypeWriter 
              texts={[
                  "Hi, I am Tomáš Bui."
              ]}
              className="text-4xl md:text-6xl font-bold text-white"
              speed={100}
          />
          <br />
          <span className="animate-fade-left pb-3 bg-gradient-to-r from-amber-500 to-orange-500 text-transparent bg-clip-text mt-1 inline-block">
            I really like to develop things
          </span>
        </h1>

        <div className="flex justify-center gap-4 mb-3">
          <Link
            href="/about"
            className="animate-fade-in px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-colors"
          >
            About
          </Link>
          <Link
            href="/portfolio"
            className="animate-fade-in px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-colors"
          >
            Portfolio
          </Link>
        </div>
        
        <div className='min-h-[2em]'>
          <TypeWriter 
            texts={[
                "Feel free to look around and explore",
                "... or check out some of my recent works down below"
            ]}
            className="text-white/90 text-xl md:text-2xl max-w-2xl mx-auto px-4"
            delay={3300}
            speed={40}
        />
        </div>
        
      </Banner>

      <div className="mt-1 pb-4 flex items-center justify-center space-x-4 pt-32 mx-48">
        <div className="flex-1 h-px bg-[#A27B5C]/20"></div>
        <p className="text-2xl font-medium"> Recent Works</p>
        <div className="flex-1 h-px bg-[#A27B5C]/20"></div>
      </div>
      
      <div className="container mx-auto pb-32">
        <ProjectGrid projects={projects} columnsPerRow={2}/>
      </div>


      <Footer />

      <BackToTop />
    </main>
  )
}