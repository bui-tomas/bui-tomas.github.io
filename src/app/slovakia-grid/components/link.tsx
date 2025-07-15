import React, { ReactNode } from "react";

interface LinkProps {
  href?: string;
  children: ReactNode;
}

export function Link({ href, children }: LinkProps) {
    console.log("Link rendered with href:", href);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline hover:text-amber-500 transition-colors duration-200 px-0 rounded-sm"
    >
      {children}
    </a>
  );
}
