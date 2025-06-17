'use client';

import { useState } from 'react';
import ProjectCard from './project-card';
import ProjectModal from './project-modal';
import { Project } from '@/types/project/project';

interface ProjectGridProps {
    projects: Project[];
    columnsPerRow?: 1 | 2 | 3 | 4;
}

const ProjectGrid = ({ projects, columnsPerRow = 4 }: ProjectGridProps) => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const flexBasis = {
        1: "w-full",
        2: "w-full md:w-[calc(50%-1.5rem)]",
        3: "w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)]",
        4: "w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] xl:w-[calc(25%-1.5rem)]"
    };

    return (
        <div className="">
            <div className="flex flex-wrap gap-14 justify-center">
                {projects.map((project) => (
                    <div key={project.id} className={`${flexBasis[columnsPerRow]} max-w-xs`}>
                        <ProjectCard
                            project={project}
                            onClick={() => setSelectedProject(project)}
                        />
                    </div>
                ))}
            </div>

            {selectedProject && (
                <ProjectModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </div>
    );
};

export default ProjectGrid;