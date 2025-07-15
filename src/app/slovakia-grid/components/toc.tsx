'use client'

import { useState, useEffect } from "react";

function useActiveSection() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = document.querySelectorAll(
      '#map, #overview, #sector-structure, #capital-formation, #generation, #electricity-generation, #electricity-share, #installed-capacity, #fossil-fuel-share, #transmission, #transmission-lines, #substations, #import-export'
    );
    
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return activeSection;
}

function ContentLink({ href, children, isBold = false, addTopMargin = false, isActive = false }: {   
  href: string;   
  children: React.ReactNode;   
  isBold?: boolean;  
  addTopMargin?: boolean;
  isActive?: boolean;
}) {   
  return (     
    <a       
      href={href}       
      className={`block text-sm transition-colors duration-200 px-[4rem] py-1 ${
        isActive 
          ? 'bg-gray-200 underline font-medium' 
          : 'hover:bg-gray-200'
      } ${addTopMargin ? 'mt-4' : ''}`}     
    >       
      {isBold ? <strong>{children}</strong> : children}     
    </a>   
  ); 
}
export function Contents() {
  const activeSection = useActiveSection();

  return (
    <div className="col-span-1 bg-[var(--gray-light)]">
      <div className="sticky top-8 max-h-[calc(100vh-8rem)] overflow-y-auto">
        <h3 className="text-2xl font-bold mb-4 border-b pb-4 mx-[4rem]">
          Contents
        </h3>
        <div>
          <ContentLink isActive={activeSection === '#map'} href="#map" isBold>
            Map
          </ContentLink>
          <ContentLink isActive={activeSection === '#overview'} href="#overview" isBold>
            Overview
          </ContentLink>
          <ContentLink isActive={activeSection === '#sector-structure'} href="#sector-structure">
            Energy sector structure
          </ContentLink>
          <ContentLink isActive={activeSection === '#capital-formation'} href="#capital-formation">
            Capital formation in the energy sector
          </ContentLink>
          <ContentLink isActive={activeSection === '#generation'} href="#generation" isBold addTopMargin>
            Generation
          </ContentLink>
          <ContentLink isActive={activeSection === '#electricity-generation'} href="#electricity-generation">
            Electricity generation
          </ContentLink>
          <ContentLink isActive={activeSection === '#electricity-share'} href="#electricity-share">
            Electricity generation by source
          </ContentLink>
          <ContentLink isActive={activeSection === '#installed-capacity'} href="#installed-capacity">
            Installed capacity
          </ContentLink>
          <ContentLink isActive={activeSection === '#fossil-fuel-share'} href="#fossil-fuel-share">
            Share of electricity from fossil fuels
          </ContentLink>
          <ContentLink isActive={activeSection === '#transmission'} href="#transmission" isBold addTopMargin>
            Transmission
          </ContentLink>
          <ContentLink isActive={activeSection === '#transmission-lines'} href="#transmission-lines">
            Transmission lines
          </ContentLink>
          {/* <ContentLink isActive={activeSection === '#substations'} href="#substations">Substations</ContentLink> */}
          <ContentLink isActive={activeSection === '#import-export'} href="#import-export">
            Electricity trade balance
          </ContentLink>
        </div>
      </div>
    </div>
  );
}
