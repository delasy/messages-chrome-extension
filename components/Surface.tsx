import React from "react";

interface SurfaceProps {
  children: React.ReactNode;
}

export default function Surface({ children }: SurfaceProps): React.ReactNode {
  return (
    <div className="w-[400px] h-[400px] bg-alabaster dark:bg-black">
      {children}
    </div>
  );
}
