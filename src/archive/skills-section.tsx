import React, { useEffect, useRef } from 'react';

interface SkillRef {
    element: HTMLDivElement;
    index: number;
}

const SkillSection = () => {
    const skillRefs = useRef<SkillRef[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const skillRef = skillRefs.current.find(ref => ref.element === entry.target);
                        if (skillRef) {
                            setTimeout(() => {
                                entry.target.classList.add(
                                    skillRef.index % 2 === 0 ? 'animate-slide-right' : 'animate-slide-left'
                                );
                            }, 120);
                        }
                    }
                });
            },
            { threshold: 0.3 }
        );

        skillRefs.current.forEach(({ element }) => {
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    const setRef = (el: HTMLDivElement | null, index: number) => {
        if (el) {
            skillRefs.current[index] = { element: el, index };
        }
    };
    const skillCategories = [
        {
            title: "Machine Learning",
            icon: "🧠",
            skills: ["PyTorch", "Neural Networks", "Deep Learning", "Computer Vision", "Natural Language Processing"],
            description: "Ever since I discovered ML, I've been fascinated by how neural networks work. I'm getting hands-on with PyTorch, building my first models, and learning how to make computers see and understand text. It's mind-blowing stuff!"
        },
        {
            title: "Data Science",
            icon: "📊",
            skills: ["Python", "Pandas", "NumPy", "Scikit-learn", "Data Visualization"],
            description: "Python became my best friend for crunching numbers and making sense of data. I love using tools like Pandas and NumPy to explore datasets, and there's something really satisfying about turning complex data into clear visualizations."
        },
        {
            title: "Computer Science",
            icon: "💻",
            skills: ["Algorithms", "Data Structures", "Software Engineering", "Database Systems", "Version Control"],
            description: "My uni courses gave me solid coding foundations - from figuring out clever algorithms to building efficient systems. I'm always trying to write better code and find smarter solutions to tricky problems."
        },
        {
            title: "Soft Skills",
            icon: "🤝",
            skills: ["Project Management", "Team Collaboration", "Problem Solving", "Technical Writing", "Presentation Skills"],
            description: "Through group projects and presentations, I've learned that coding is just part of the story. I enjoy breaking down complex ideas for others and working in teams to tackle challenging problems together."
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Technical Expertise</h2>
            </div>
            <div className="flex flex-col gap-8">
                {skillCategories.map((category, index) => (
                    <div
                        key={index}
                        ref={(el) => setRef(el, index)}
                        className="skill-card opacity-0 w-full bg-white rounded-lg shadow-lg p-8 transform transition-transform duration-300 hover:scale-[1.02]"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="text-4xl">{category.icon}</div>
                            <h3 className="text-2xl font-bold">{category.title}</h3>
                        </div>
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="lg:w-2/5">
                                <div className="grid grid-cols-1 gap-3">
                                    {category.skills.map((skill, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
                                            <span className="text-gray-700 font-medium">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="lg:w-3/5">
                                <p className="text-gray-600 leading-relaxed">{category.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkillSection;