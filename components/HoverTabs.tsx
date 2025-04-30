"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "lucide-react";
import { cn } from "@/lib/utils";

type TabsProps = {
  tabsContent: {
    key: string;
    label: string;
    icon?: typeof Icon;
  }[];
  selectedTab: string;
  setSelectedTab: (value: string) => void;
  className?: string;
  forceLightMode?: boolean;
};

const HoverTabs = ({
  tabsContent,
  selectedTab,
  setSelectedTab,
  className,
  forceLightMode = false,
}: TabsProps) => {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const tabsContainerRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [hoverStyle, setHoverStyle] = useState({});
  const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" });

  // Helper function to calculate positions safely
  const updateTabPosition = (
    key: string | null,
    styleSetterFn: (style: any) => void
  ) => {
    if (!key || !tabsContainerRef.current || !tabRefs.current[key]) return;

    const element = tabRefs.current[key];
    if (!element) return;

    // Get positions relative to the parent container to avoid Safari issues
    const containerRect = tabsContainerRef.current.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    const left = elementRect.left - containerRect.left;
    const width = elementRect.width;

    styleSetterFn({
      left: `${left}px`,
      width: `${width}px`,
    });
  };

  // Update hover indicator position
  useEffect(() => {
    updateTabPosition(hoveredKey, setHoverStyle);
  }, [hoveredKey]);

  // Update active indicator position
  useEffect(() => {
    updateTabPosition(selectedTab, setActiveStyle);
  }, [selectedTab]);

  // Initial position calculation with a safety delay for Safari
  useEffect(() => {
    // Small delay to ensure DOM is fully rendered in Safari
    const timer = setTimeout(() => {
      updateTabPosition(selectedTab, setActiveStyle);
    }, 100);

    // Handle window resize to recalculate positions
    const handleResize = () => {
      updateTabPosition(selectedTab, setActiveStyle);
      if (hoveredKey) {
        updateTabPosition(hoveredKey, setHoverStyle);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [selectedTab]);

  return (
    <div className={cn("relative", className)} ref={tabsContainerRef}>
      {/* Hover Highlight - Using transform instead of left/width for better Safari support */}
      <div
        className={cn(
          "absolute h-[30px] transition-all duration-300 ease-out bg-[#0e0f1114] rounded-[6px] flex items-center",
          !forceLightMode && "dark:bg-[#ffffff1a]"
        )}
        style={{
          ...hoverStyle,
          opacity: hoveredKey ? 1 : 0,
          // Adding transform for smoother Safari animations
          transform: "translateZ(0)",
        }}
      />

      {/* Active Indicator - Using transform instead of left/width for better Safari support */}
      <div
        className={cn(
          "absolute bottom-[-6px] h-[2px] bg-[#0e0f11] transition-all duration-300 ease-out",
          !forceLightMode && "dark:bg-white"
        )}
        style={{
          ...activeStyle,
          // Adding transform for smoother Safari animations
          transform: "translateZ(0)",
        }}
      />

      {/* Tabs */}
      <div className="relative flex space-x-[6px] items-center">
        {tabsContent.map(({ key, label, icon: Icon }, index) => (
          <div
            key={key}
            ref={(el) => (tabRefs.current[key] = el)}
            className={cn(
              "px-3 py-2 cursor-pointer transition-colors duration-300 h-[30px]",
              forceLightMode
                ? key === selectedTab
                  ? "text-[#0e0e10]"
                  : "text-[#0e0f1199]"
                : key === selectedTab
                ? "text-[#0e0e10] dark:text-white"
                : "text-[#0e0f1199] dark:text-[#ffffff99]"
            )}
            onMouseEnter={() => setHoveredKey(key)}
            onMouseLeave={() => setHoveredKey(null)}
            onClick={() => setSelectedTab(key)}
          >
            <div className="text-sm font-medium leading-5 whitespace-nowrap flex items-center justify-center h-full space-x-3">
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HoverTabs;
