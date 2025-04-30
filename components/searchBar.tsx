"use client";

import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import { Input } from "./ui/input";
import Results from "./results";
import HoverTabs from "./HoverTabs";
import { searchTypes } from "@/lib/constants";

let searchControl = {
  openSearchCallback: null,
};

// Create a function to expose the search control
export function getSearchControl() {
  return searchControl;
}

export function SearchBar({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("books");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState<Record<string, SearchResult[]>>({
    books: [],
    movies: [],
    "TV Shows": [],
    games: [],
    users: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Function to open search with a specific tab
    const openSearch = (tab = "books") => {
      setActiveTab(tab);
      setOpen(true);
    };

    // Register the function with the global control
    searchControl.openSearchCallback = openSearch;

    // Clean up on unmount
    return () => {
      searchControl.openSearchCallback = null;
    };
  }, []);

  // Handle clicks outside the search modal to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [open]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Focus the input when the search modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    const searchMedia = async () => {
      if (!debouncedQuery.trim()) {
        setResults((prev) => ({
          ...prev,
          [activeTab]: [],
        }));
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search?type=${encodeURIComponent(
            activeTab
          )}&query=${encodeURIComponent(debouncedQuery)}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch ${activeTab} search results`);
        }

        const data = await response.json();
        setResults((prev) => ({
          ...prev,
          [activeTab]: data.results,
        }));
      } catch (error) {
        console.error("Error searching media:", error);
        setResults((prev) => ({
          ...prev,
          [activeTab]: [],
        }));
      } finally {
        setIsLoading(false);
      }
    };

    searchMedia();
  }, [debouncedQuery, activeTab]);

  const getResults = () => {
    return results[activeTab] || [];
  };

  return (
    <div>
      <Button
        variant="outline"
        className={cn(
          "relative h-10 w-full justify-start rounded-lg border bg-background px-3 text-sm font-normal text-muted-foreground shadow-none sm:px-4",
          className
        )}
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4 shrink-0" />
        <span className="line-clamp-1">Search for a user, book, movie...</span>
        <kbd className="pointer-events-none absolute right-2 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {open && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center pt-16 px-4">
          <div
            ref={searchRef}
            className="w-full max-w-3xl bg-white rounded-lg border border-slate-700 shadow-xl overflow-hidden"
            style={{ maxHeight: "calc(100vh - 100px)" }}
          >
            {/* Search input */}
            <div className="px-4 pt-4 pb-1 flex items-center">
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin text-indigo-600" />
              ) : (
                <Search className="mr-2 h-5 w-5 text-indigo-600" />
              )}
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search for a book, author or series..."
                className="flex-1 bg-transparent border-indigo-600 text-lg focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-800"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button
                variant="ghost"
                className="text-indigo-600"
                onClick={() => setOpen(false)}
              >
                ESC
              </Button>
            </div>
            <div className="flex justify-center">
              <HoverTabs
                className="mt-1 mb-3"
                tabsContent={searchTypes}
                selectedTab={activeTab}
                setSelectedTab={setActiveTab}
                forceLightMode={true}
              />
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: "750px" }}>
              {query && getResults().length > 0 && (
                <div className="p-4">
                  <div className="space-y-1">
                    {getResults().map((result) => (
                      <div key={result.id}>
                        <Results
                          id={result.id}
                          title={result.title}
                          coverUrl={result.cover}
                          year={result.year}
                          author={result.author}
                          mediaType={activeTab}
                          description={result.description}
                          name={result.name}
                          username={result.userName}
                          image={result.image}
                          followers={result.followers}
                          following={result.following}
                        />
                        <hr className="dark:bg-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {isLoading && (
              <div className="max-h-[650px] overflow-y-auto">
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className="p-4">
                    <div className="flex items-start gap-6 max-w-2xl p-4 rounded-lg">
                      {/* Image skeleton */}
                      <div className="shrink-0 w-24 h-36 bg-gray-200 rounded animate-pulse" />

                      <div className="flex flex-col w-full">
                        {/* Title skeleton */}
                        <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />

                        {/* Metadata skeleton */}
                        <div className="flex items-center gap-4 mt-3">
                          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                          <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
                          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                        </div>
                      </div>
                    </div>
                    <hr />
                  </div>
                ))}
              </div>
            )}

            {!isLoading && debouncedQuery && getResults().length === 0 && (
              <div className="p-6 text-center text-slate-400">
                <p>No results found for "{query}"</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
