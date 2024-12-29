import Image from 'next/image';
import { motion } from 'framer-motion';
import { Project } from '@/types/project';


interface ProjectCardProps {
    project: Project;
    onClick: () => void;
}

const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
    return (
        <motion.div
            className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            layout
        >
            <div className="relative h-48">
                <Image
                    src={project.images[0]}
                    alt={project.title}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.map((tech) => (
                        <span
                            key={tech}
                            className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
                <p className="text-gray-600 mb-4">{project.description}</p>
                {/* <div className="flex gap-4">
                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            className="text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                        >
                            Live Demo
                        </a>
                    )}
                    {project.codeUrl && (
                        <a
                            href={project.codeUrl}
                            className="text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                        >
                            View Code
                        </a>
                    )}
                </div> */}
            </div>
        </motion.div>
    );
};

export default ProjectCard;