"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import MediaTabs from "../../app/(root)/library/components/MediaTabs";
import AlphabetFilter from "../../app/(root)/library/components/AlphabetFilter";
import { mediaTypes } from "@/lib/constants";
import MediaGrid from "../../app/(root)/library/components/Media-grid";

const Library = () => {
  const [selectedLetter, setSelectedLetter] = useState("ALL");
  const [selectedTab, setSelectedTab] = useState("books");

  const currentTabLabel =
    mediaTypes.find((e) => e.key === selectedTab)?.label || "Media";

  return (
    <div className="space-y-6 mx-7">
      <div className="flex justify-between mt-8">
        <h1 className="text-3xl font-bold">My {currentTabLabel}</h1>{" "}
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
        <MediaTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
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
