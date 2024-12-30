import Navbar from '@/components/navbar'
import Banner from '@/components/banner'
import Footer from '@/components/footer'
import BackToTop from '@/components/back-to-top'
import SkillsPieChart from '@/components/about-pie-chart'
import ProjectGrid from '@/components/project-grid';
import { Mail, Linkedin, Github } from 'lucide-react';


const projects = [
    {
        id: '1',
        title: 'Portfolio Website',
        description: 'Personal portfolio built with Next.js and TypeScript',
        fullDescription: 'A modern, responsive portfolio website showcasing my projects and skills...',
        techStack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
        images: ['/images/projects/portfolio1.png', '/images/projects/portfolio2.png'],
        liveUrl: 'https://example.com',
        codeUrl: 'https://github.com/example',
    },
];

export default function About() {
  return (
    <main className="bg-[var(--gray-light)] min-h-screen">
      <Navbar />

      <Banner
        showParticles={false}
        background="bg-white"
        backdropClass=""
        height="h-[60vh]"
        borderClass="border border-gray-200"
        shadowClass="shadow-lg"
      >
        <div className="banner-content flex flex-col md:flex-row items-center gap-8 max-w-7xl mx-auto">
          <div className="w-full md:w-1/2 text-left">
            <h1 className="text-slate-900 text-4xl md:text-6xl font-bold mb-4">
              About Me
            </h1>
            <p className="text-slate-700 text-lg md:text-xl mb-6">
              I'm a Computer Science student at FIIT STU Bratislava with a passion for AI and data science.  
              When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, 
              or sharing what I've learned with others. 
            </p>
          </div>
        </div>
      </Banner>

      <section className="w-full bg-[var(--gray-light)]">
        <div className="mx-32 pb-16 pt-32">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Skills</h2>
          <div className="flex justify-between items-start">
            {/* Left column - First list */}
            <div className="w-1/4 flex justify-between">
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>PyTorch</li>
                <li>Python</li>
                <li>Pandas</li>
                <li>Seaborn</li>
                <li>SQL</li>
              </ul>

              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>Version Control</li>
                <li>Team Collaboration</li>
                <li>Problem Solving</li>
                <li>Technical Writing</li>
                <li>Presentation Skills</li>
              </ul>
            </div>


            {/* Right column - Pie Chart */}
            <div className="w-1/2 -mt-28">
              <SkillsPieChart />
            </div>
          </div>
        </div>
      </section>

      <hr className='mx-32 border-gray-400'/>

      <section className="w-full bg-[var(--gray-light)]">
        <div className="mx-32 pb-16 pt-32">
          <div className="flex justify-between items-start">
            {/* Left column - Project Grid */}
            <div className="w-1/4 -mt-16">
              <ProjectGrid projects={projects} columnsPerRow={1} />
            </div>~


            {/* Right column - Current Projects */}
            <div className="w-1/2 mt-16">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Current Projects</h2>
              <p className="text-slate-700">
                I'm working on number of projects that combine my interests in 
                CS and my own hobbies. One of my main focuses is developing machine learning models 
                that can understand and process complex data patterns particularly in healthcare. 
                I'm also interested in intersection between 
                CS and climate change, notably through climate modelling.
              </p>
            </div>
          </div>
        </div>
      </section>

      <hr className='mx-32 border-gray-400'/>

      <section className="w-full bg-[var(--gray-light)]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
            {/* Left column - Contact */}
            <div className="w-full lg:w-1/3">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Contact</h2>
              <p className="text-slate-700 mb-8">
                You can contact me on LinkedIn or via email. I'm always open to discussing new projects and opportunities.
              </p>
              
              <div className="space-y-4">
                {/* Email Contact */}
                <a 
                  href="mailto:tomastuan.buianh@gmail.com"
                  className="flex items-center gap-3 text-slate-700 hover:text-slate-900 transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  <span>tomastuan.buianh@gmail.com</span>
                </a>

                {/* LinkedIn */}
                <a 
                  href="https://www.linkedin.com/in/tomas-bui/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-slate-700 hover:text-slate-900 transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                  <span>LinkedIn Profile</span>
                </a>

                {/* GitHub */}
                <a 
                  href="https://github.com/bui-tomas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-slate-700 hover:text-slate-900 transition-colors"
                >
                  <Github className="h-5 w-5" />
                  <span>GitHub Profile</span>
                </a>
              </div>

            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </main>
  )
}