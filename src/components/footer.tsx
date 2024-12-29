'use client'

import Link from 'next/link'
import { Github, Linkedin, Mail, Instagram, Newspaper } from 'lucide-react'

const socialLinks = [
    { href: "https://github.com/bui-tomas", icon: Github },
    { href: "https://www.linkedin.com/in/tomas-bui/", icon: Linkedin },
    { href: "https://instagram.com", icon: Instagram },
    { href: "https://wordpress.com", icon: Newspaper },
    { href: "mailto:tomastuan.buianh@gmail.com", icon: Mail }
]

const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-gray-dark text-[#DCD7C9]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-4">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div>
                        <Link href="/">
                            <img src="/logo.png" alt="TB Logo" className="h-16" />
                        </Link>
                    </div>

                    <div className="hidden md:flex ml-auto space-x-4">
                        {socialLinks.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#DCD7C9] hover:text-amber-500"
                            >
                                <link.icon size={24} />
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="mt-1 pb-4 flex items-center justify-center space-x-4 text-sm">
                    <div className="flex-1 h-px bg-[#A27B5C]/20"></div>
                    <p>&copy; {currentYear} Tomáš Bui</p>
                    <div className="flex-1 h-px bg-[#A27B5C]/20"></div>
                </div>
            </div>
        </footer>
    )
}

export default Footer