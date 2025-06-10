'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Github, Linkedin, Mail, Instagram, Newspaper } from 'lucide-react'
import { usePathname } from 'next/navigation'

type NavigationItem = {
    name: string;
    href: string;
}

type SocialLink = {
    href: string;
    icon: React.ElementType;
}

const navigation: NavigationItem[] = [
    { name: 'About', href: '/#about' },
    { name: 'Portfolio', href: '/#portfolio' },
    { name: 'CV', href: '/cv' }
]

const socialLinks: SocialLink[] = [
    { href: "https://github.com/bui-tomas", icon: Github },
    { href: "https://www.linkedin.com/in/tomas-bui/", icon: Linkedin },
    { href: "https://instagram.com", icon: Instagram },
    { href: "https://wordpress.com", icon: Newspaper },
    { href: "mailto:tomastuan.buianh@gmail.com", icon: Mail }
]

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        // Only handle hash navigation on home page
        if (pathname !== '/' && href.startsWith('/#')) {
            e.preventDefault()
            window.location.href = href
        }
    }

    return (
        <nav className="shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center">
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="text-[#DCD7C9] text-xl font-bold">
                            <img src="/logo.png" alt="TB Logo" className="h-16" />
                        </Link>

                        <div className="hidden md:flex space-x-4">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-[#DCD7C9] px-3 py-2 rounded-md text-base font-medium hover:text-amber-500"
                                    onClick={(e) => handleNavClick(e, item.href)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
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
                                <link.icon size={30} />
                            </Link>
                        ))}
                    </div>

                    <div className="md:hidden ml-auto">
                        <button
                            type="button"
                            className="p-2 rounded-md text-[#DCD7C9] hover:text-amber-500"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="md:hidden bg-[#2C3639]">
                    <div className="space-y-1 px-2 pb-3 pt-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="block text-[#DCD7C9] px-3 py-2 rounded-md text-base font-medium hover:text-amber-500"
                                onClick={(e) => {
                                    setIsMobileMenuOpen(false)
                                    handleNavClick(e, item.href)
                                }}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="flex justify-center space-x-6 pt-4">
                            {socialLinks.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#DCD7C9] hover:text-amber-500"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <link.icon size={24} />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar