"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import AlphabetFilter from "../components/AlphabetFilter";
import MediaGrid from "../components/Media-grid";
import { mediaTypes } from "@/lib/constants";
import HoverTabs from "@/components/HoverTabs";

const Library = () => {
  const params = useParams();
  const router = useRouter();

  // const decodedMediaType = decodeURIComponent(mediaType);

  // Extract mediaType from URL or default to 'books'
  const mediaTypeParam = decodeURIComponent(
    Array.isArray(params.mediaType) ? params.mediaType[0] : params.mediaType
  );

  const selectedTab = mediaTypeParam || "books";
  const [selectedLetter, setSelectedLetter] = useState("ALL");

  // Validate mediaType and redirect if invalid
  useEffect(() => {
    const isValidMediaType = mediaTypes.some(
      (type) => type.key === selectedTab
    );
    if (!isValidMediaType) {
      router.push("/library/books");
    }
    // If we're at /library without a media type, redirect to /library/books
    else if (!mediaTypeParam) {
      router.push("/library/books");
    }
  }, [selectedTab, router, mediaTypeParam]);

  // Get the label for the current media type
  const currentTabLabel =
    mediaTypes.find((e) => e.key === selectedTab)?.label || "Media";

  // Handle tab changes
  const handleTabChange = (tab: string) => {
    router.push(`/library/${tab}`);
  };

  return (
    <div className="space-y-6 mx-7">
      <div className="flex justify-between mt-8">
        <h1 className="text-3xl font-bold">My {currentTabLabel}</h1>
        <Link href={`/add-media?type=${selectedTab}`}>
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add{" "}
            {currentTabLabel.endsWith("s")
              ? currentTabLabel.slice(0, -1)
              : currentTabLabel}
          </Button>
        </Link>
      </div>
      <div className="flex justify-between">
        <HoverTabs
          tabsContent={mediaTypes}
          selectedTab={selectedTab}
          setSelectedTab={handleTabChange}
        />
      </div>

      <AlphabetFilter
        selectedLetter={selectedLetter}
        setSelectedLetter={setSelectedLetter}
      />

      <MediaGrid selectedTab={selectedTab} selectedLetter={selectedLetter} />
    </div>
  );
};

export default Library;
