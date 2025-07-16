import Image from 'next/image';
import { Project } from '@/types/project/project';

interface ProjectModalProps {
    project: Project;
    onClose: () => void;
}

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-3xl font-bold">{project.title}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <span className="sr-only">Close</span>
                            ×
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {project.images.map((image, index) => (
                            <div key={index} className="relative h-64">
                                <Image
                                    src={image}
                                    alt={`${project.title} preview ${index + 1}`}
                                    fill
                                    className="object-contain rounded-lg"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="prose max-w-none mb-8">
                        <h3 className="text-xl font-semibold mb-4">Overview</h3>
                        <p>{project.fullDescription}</p>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Tech Stack</h3>
                        <div className="flex flex-wrap gap-2">
                            {project.techStack.map((tech) => (
                                <span
                                    key={tech}
                                    className="px-4 py-2 bg-gray-100 rounded-full"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        {/* <h3 className="text-xl font-semibold mb-4">
                            Challenges & Solutions
                        </h3>
                        <div className="space-y-6">
                            {project.challenges.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-50 rounded-lg p-6"
                                >
                                    <h4 className="font-semibold mb-2">
                                        Challenge {index + 1}
                                    </h4>
                                    <p className="text-gray-700 mb-4">
                                        {item.challenge}
                                    </p>
                                    <h4 className="font-semibold mb-2">
                                        Solution
                                    </h4>
                                    <p className="text-gray-700">
                                        {item.solution}
                                    </p>
                                </div>
                            ))}
                        </div> */}
                    </div>

                    <div className="flex gap-4 mt-8">
                        {project.codeUrl && (
                            <a
                                href={project.codeUrl}
                                className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-colors"
                                >
                                View Source Code
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectModal;

