export interface Project {
    id: string;
    title: string;
    description: string;
    fullDescription: string;
    techStack: string[];
    images: string[];
    codeUrl?: string;
    // challenges: {
    //     challenge: string;
    //     solution: string;
    // }[];
}