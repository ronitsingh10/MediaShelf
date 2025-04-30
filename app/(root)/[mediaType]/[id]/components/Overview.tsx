"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const Overview = ({ text }: { text: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  // Check if text is truncated (exceeds 4 lines)
  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        const element = textRef.current;
        // If the scroll height is greater than the client height, text is truncated
        setIsTruncated(element.scrollHeight > element.clientHeight);
      }
    };

    // Initial check
    checkTruncation();

    // Check on window resize
    window.addEventListener("resize", checkTruncation);

    // Clean up
    return () => {
      window.removeEventListener("resize", checkTruncation);
    };
  }, [text]);

  return (
    <div className="relative mb-6">
      <p
        ref={textRef}
        className={cn(
          "text-lg leading-relaxed mb-0 tracking-tighter",
          !isExpanded && "line-clamp-4"
        )}
      >
        {text}
      </p>
      {isTruncated && (
        <div className="flex justify-end w-full mt-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-amber-400 hover:text-amber-300 hover:bg-slate-800/50 flex items-center"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Read less" : "Read more"}
            <ChevronDown
              className={cn(
                "ml-1 h-4 w-4 transition-transform duration-200",
                isExpanded && "rotate-180"
              )}
            />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Overview;
