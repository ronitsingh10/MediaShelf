"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import Image from "next/image";
import { mediaTypes, statusMap } from "@/lib/constants";
import Link from "next/link";
import HoverTabs from "@/components/HoverTabs";

type Media = {
  mediaId: string;
  mediaType: string;
  title: string;
  cover: string;
  year?: string;
  status?: string;
  rating?: number;
  notes?: string;
  description?: string;
  author?: string;
  publisher?: string;
  genres?: string;
  platforms?: string;
};

const statusColors = [
  "",
  "bg-slate-800 text-white",
  "bg-orange-400 text-white",
  "bg-teal-500 text-white",
  "bg-amber-400 text-slate-900",
];

const getMediaByTypeAndStatus = (mediaList: Media[]) => {
  const categorized: Record<string, Record<string, Media[]>> = {};

  for (const media of mediaList) {
    const type = media.mediaType;
    const status = media.status || "Unknown";

    if (!categorized[type]) {
      categorized[type] = {};
    }

    if (!categorized[type][status]) {
      categorized[type][status] = [];
    }

    categorized[type][status].push(media);
  }

  return categorized;
};

const MediaTracker = ({ username, media }) => {
  const [activeStatus, setActiveStatus] = useState(1); // Default to "Want to Read/Watch/Play"
  const [activeTab, setActiveTab] = useState("books");

  const categorized = getMediaByTypeAndStatus(media);

  console.log("Media Type:", categorized);

  // Get the appropriate status map based on mediaType
  const statuses = Object.entries(statusMap[activeTab] || statusMap.books).map(
    ([id, status]) => ({
      id: parseInt(id),
      name: status.label,
      icon: status.icon,
      color: statusColors[parseInt(id)],
      active: parseInt(id) === activeStatus,
      count: categorized[activeTab]?.[id]?.length || 0, // Placeholder count for demo purposes
    })
  );

  const getTitle = () => {
    const firstName =
      username.split(" ")[0].charAt(0).toUpperCase() +
      username.split(" ")[0].slice(1);
    switch (activeTab) {
      case "movies":
        return `${firstName}'s Movies by Status`;
      case "games":
        return `${firstName}'s Games by Status`;
      case "TV Shows":
        return `${firstName}'s TV Shows by Status`;
      default:
        return `${firstName}'s Books by Status`;
    }
  };

  return (
    <div className="w-full max-w-10xl mx-auto text-slate-800 p-3 rounded-lg">
      <div className="flex justify-center">
        <HoverTabs
          className="mb-3"
          tabsContent={mediaTypes}
          selectedTab={activeTab}
          setSelectedTab={setActiveTab}
          forceLightMode={true}
        />
      </div>
      <div className="flex items-center gap-2 mb-3">
        <Bookmark className="h-5 w-5 text-teal-600" />
        <h1 className="text-xl font-semibold">{getTitle()}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
        {/* Status sidebar */}
        <div className="md:col-span-3 space-y-1">
          {statuses.map((status) => {
            if (status.id === 0) return null;

            let buttonClasses =
              "w-full flex justify-between items-center p-3 rounded-lg transition-colors ";

            if (status.active) {
              buttonClasses += `${status.color}`;
            } else {
              buttonClasses += "bg-slate-100 hover:bg-slate-200 text-slate-700";
            }

            return (
              <button
                key={status.id}
                onClick={() => setActiveStatus(status.id)}
                className={buttonClasses}
              >
                <span>{status.name}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-sm ${
                    status.active ? "bg-white/20" : "bg-slate-200"
                  }`}
                >
                  {status.count.toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>

        {/* Books display */}
        <div className="md:col-span-9 bg-slate-50 rounded-lg p-3 border border-slate-100">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium capitalize">
              {categorized[activeTab]?.[activeStatus]?.length > 0 &&
                `${categorized[activeTab][activeStatus].length} ${activeTab}`}
            </h2>
          </div>

          <div className="overflow-x-auto pb-2 -mx-3 px-3">
            <div className="flex gap-3 min-w-max">
              {categorized[activeTab]?.[activeStatus]?.length > 0 ? (
                <>
                  {" "}
                  {categorized[activeTab][activeStatus].map((media) => (
                    <div
                      key={media.mediaId}
                      className="flex flex-col w-[100px] flex-shrink-0"
                    >
                      <Link
                        href={`/${activeTab}/${media.mediaId}`}
                        className="relative aspect-[2/3] overflow-hidden rounded-md group shadow-sm block"
                      >
                        {/* <Link href={`/${activeTab}/${media.mediaId}`} passHref> */}
                        <Image
                          src={media.cover || "/placeholder.svg"}
                          alt={media.title}
                          fill
                          className="object-cover"
                        />
                        {/* </Link> */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-800/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2">
                          <p className="text-xs font-medium text-white line-clamp-2">
                            {media.title}
                          </p>
                          <p className="text-xs text-slate-300">
                            {media.author}
                          </p>
                        </div>
                      </Link>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-slate-400 text-center pt-0 py-8">
                  No {activeTab.toLowerCase()} found for this status.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaTracker;
