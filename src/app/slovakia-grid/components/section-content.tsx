import React from "react";

interface SectionContentProps {
  id?: string;
  title?: string;
  padding?: string;
  gap?: string;
  margin_right?: string;
  equal?: boolean;
  left: React.ReactNode;
  right: React.ReactNode;
}

export function SectionContent({
  id,
  title,
  padding = "",
  equal = false,
  left,
  right,
  gap,
  margin_right,
}: SectionContentProps) {
  return (
    <>
      {title && (
        <div
          id={id}
          className="flex items-center justify-center space-x-4 py-16 mx-12 sm:mx-48"
        >
          <div className="flex-1 h-px bg-[#A27B5C]/20"></div>
          <p className="text-2xl font-medium">{title}</p>
          <div className="flex-1 h-px bg-[#A27B5C]/20"></div>
        </div>
      )}

      <div
        className={`grid grid-cols-1 ${
          equal ? "xl:grid-cols-2" : "xl:grid-cols-9"
        } min-h-96 mr-12 max-2xl:mx-4 max-2xl:px-4 sm:max-2xl:mx-8 sm:max-2xl:px-6 md:max-2xl:mx-12 md:max-2xl:px-8 ${padding} ${gap}`}
      >
        <div
          className={`col-span-1 ${equal ? "xl:col-span-1" : "xl:col-span-5"}`}
        >
          {left}
        </div>
        <div
          className={`col-span-1 ${
            equal ? "xl:col-span-1" : "xl:col-span-4"
          } ${margin_right}`}
        >
          {right}
        </div>
      </div>
    </>
  );
}
