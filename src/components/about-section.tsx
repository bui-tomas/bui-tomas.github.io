import React from 'react';

const About = () => {
    return (
        <div className="bg-[var(--gray-light)] flex">
            {/* Text Content */}
            <div className="w-2/3 ml-16">
                <section className="w-full">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-5">
                        <p className="text-slate-700 text-lg leading-relaxed">
                            The intersection of artificial intelligence and real-world problem-solving has always captivated me,
                            ever since I first began exploring the possibilities of technology. My journey started with the
                            fundamentals of computer science at FIIT STU Bratislava, but quickly evolved into a passionate pursuit
                            of AI and data science applications that could make a meaningful impact.
                        </p>
                    </div>
                </section>
                
                <section className="w-full">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-5">
                        <p className="text-slate-700 text-lg leading-relaxed">
                            Fast forward to today, and I've immersed myself in a diverse range of technologies and tools -
                            from PyTorch and Python for deep learning to data analysis with Pandas and Seaborn.
                            I've particularly focused on healthcare applications and climate modeling,
                            believing that technology can be a powerful force for addressing some of our world's most pressing challenges.
                        </p>
                    </div>
                </section>
                
                <section className="w-full">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <p className="text-slate-700 text-lg leading-relaxed">
                            What drives me most is the potential to create solutions that bridge the gap
                            between complex computational systems and real-world impact.
                            It goes beyond just writing code or building models - it's about understanding patterns in healthcare data
                            that could improve patient outcomes, or developing climate models that could help us better understand
                            and address environmental challenges.
                        </p>
                    </div>
                </section>
            </div>

            {/* Image */}
            <div className="w-1/3 p-8 flex items-center justify-center">
                <div className="w-80 h-80 rounded-full overflow-hidden">
                    <img 
                        src="/images/profile.jpg" 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default About;