import { DriverBottomNav } from "@/components/DriverBottomNav";
import { ReactNode } from "react";

export default function DriverLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 
        This wrapper ensures that the content can push to the bottom but leaves 
        a safe area padding (pb-24) to prevent content being hidden under the 
        fixed bottom navigation bar on mobile.
      */}
      <div className="flex-1 pb-24 md:pb-0">
        {children}
      </div>
      
      {/* 
        The bottom navigation bar is primarily visible on mobile devices.
        On large screens (md:), you might hide it and rely on a sidebar, 
        but for tracking context we display it uniformly or style it using Tailwind 'md:hidden'.
        Here we make it universally available or hide via classes inside the component.
      */}
      <div className="block md:hidden">
        <DriverBottomNav />
      </div>
    </div>
  );
}
