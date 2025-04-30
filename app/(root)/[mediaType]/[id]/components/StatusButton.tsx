"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  Trash,
  MessageCircle,
  ChevronRight,
  Loader2,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import StarRating from "./StarRating";
import { toast } from "sonner";
import {
  deleteUserMedia,
  insertUserMedia,
  updateUserMedia,
} from "@/server/actions/media-actions";
import { statusMap } from "@/lib/constants";
import MediaProgress from "./media-progress";

const StatusButton = ({ id, media, userMedia, mediaType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [statusCode, setStatusCode] = useState(Number(userMedia?.status) || 0);
  const [rating, setRating] = useState(userMedia?.rating || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // const [activeView, setActiveView] = useState<"main" | "progress">("main");
  const [activeView, setActiveView] = useState<"main" | "progress" | "review">(
    "main"
  );
  const [review, setReview] = useState(userMedia?.notes || "");

  const { status, Icon } = useMemo(() => {
    return {
      status: statusMap[mediaType][statusCode],
      Icon: statusMap[mediaType][statusCode].icon,
    };
  }, [statusCode]);

  console.log(status);

  // console.log(userMedia, mediaType, statusMap[mediaType][statusCode]);

  // const status = statusMap[mediaType]

  const toggleDropdown = async () => {
    if (statusCode === 0) {
      setIsLoading(true);
      const insertPayload = {
        id: id,
        type: mediaType,
        title: media.title,
        cover: media.poster,
        year: media.releaseDate,
        description: media.overview,
        author: media.author,
        publisher: media.publisher,
        genres: media.genres,
        platforms: media.platforms,
      };
      const { success, message } = await insertUserMedia(insertPayload);
      toast[success ? "success" : "error"](message);

      if (success) {
        setStatusCode(1);
      }
      setIsLoading(false);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const selectStatus = async (newStatus: number) => {
    console.log(statusCode, newStatus);
    // if (statusCode === 0) {

    // }
    setLoadingStatus(newStatus);

    if (newStatus === 0) {
      setIsOpen(false);

      setIsDeleting(true);

      const deletePayload = {
        id: id,
        type: mediaType,
      };
      const { success, message } = await deleteUserMedia(deletePayload);
      toast[success ? "success" : "error"](message);

      if (success) {
        setStatusCode(newStatus);
      }

      setIsDeleting(false);
    } else {
      try {
        await updateUserMedia(id, mediaType, {
          status: newStatus.toString(),
        });
        setStatusCode(newStatus);
        toast.success(
          `Status updated to ${statusMap[mediaType][newStatus].label}`,
          {
            position: "top-right",
          }
        );
      } catch (error) {
        toast.error("Failed to update status", {
          position: "top-right",
        });
      }
    }

    setLoadingStatus(null);
    // setIsOpen(false);
  };

  const handleRating = async (value: number) => {
    try {
      await updateUserMedia(id, mediaType, {
        rating: value,
      });
      setRating(value);

      toast.success(`Rating updated to ${value} stars`, {
        position: "top-right",
      });
    } catch (error) {
      toast.error("Failed to update rating", {
        position: "top-right",
      });
    }
  };

  const handleReviewSubmit = async () => {
    try {
      await updateUserMedia(id, mediaType, {
        notes: review,
      });

      toast.success("Review saved successfully", {
        position: "top-right",
      });

      // Return to main view after saving
      setActiveView("main");
    } catch (error) {
      toast.error("Failed to save review", {
        position: "top-right",
      });
    }
  };

  const handleProgressUpdate = async (progress: string, percent?: string) => {
    try {
      // await updateUserMedia(id, mediaType, {
      //   progress,
      // });

      await updateUserMedia(id, mediaType, { status: "2", progress }, percent);

      toast.success("Progress updated successfully", {
        position: "top-right",
      });

      // Return to main view after saving
      setActiveView("main");
    } catch (error) {
      toast.error("Failed to update progress", {
        position: "top-right",
      });
    }
  };

  // Prepare media object for progress component
  const prepareMediaForProgress = () => {
    const progressMedia = {
      title: media.title,
      type:
        mediaType === "books"
          ? "book"
          : mediaType === "movies"
          ? "movie"
          : "tv",
    };

    if (mediaType === "books") {
      progressMedia.pages = media.pages || 0;
    } else if (mediaType === "movies") {
      progressMedia.runtime = parseInt(media.runtime.split(" ")[0]) || 0;
    } else if (mediaType === "TV Shows") {
      progressMedia.seasons = media.seasons || 0;
      progressMedia.episodes = media.episodes || [];
    }

    return progressMedia;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setActiveView("main");
      }
    };

    // Add event listener when dropdown is open
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative text-sm" ref={dropdownRef}>
      {/* Main Button */}
      <button
        onClick={toggleDropdown}
        className={cn(
          "flex items-center gap-2 bg-[#F7D44C] text-[#6B4D1A] font-semibold py-3 px-4 rounded-full border-2 border-white shadow-md",
          status.color,
          isDeleting &&
            "bg-red-400 text-red-900 hover:bg-red-500 border-red-950"
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : isDeleting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin " />
            Removing...
          </>
        ) : (
          <>
            <Icon className="h-4 w-4" />
            <span>{status.label}</span>
            {statusCode !== 0 && (
              <ChevronDown
                className={cn("h-4 w-4 ml-1", isOpen && "rotate-180")}
              />
            )}
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {statusCode !== 0 && isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-[#1A202C] border border-gray-700 rounded-lg shadow-lg z-10">
          {activeView === "main" ? (
            <>
              {statusCode === 2 && mediaType !== "games" && (
                <div className="p-2 border-b border-gray-700">
                  <button
                    // onClick={toggleProgressModal}
                    onClick={() => setActiveView("progress")}
                    className="flex items-center justify-center gap-2 w-full font-medium py-2 px-3 rounded-md hover:scale-105 transition-transform duration-200 ease-in-out"
                  >
                    Update progress
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Reading Status Options */}
              <div className="p-2">
                {Object.entries(statusMap[mediaType])
                  .filter(([code]) => code !== "0") // Filter out "Add to Library"
                  .map(([code, statusInfo]) => {
                    const StatusIcon = statusInfo.icon;
                    const isSelected = Number(code) === statusCode;
                    const isLoading = loadingStatus === Number(code);

                    return (
                      <button
                        key={code}
                        onClick={() => selectStatus(Number(code))}
                        className="flex items-center gap-3 w-full text-left px-3 py-2 text-white hover:bg-gray-700 rounded-md"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <StatusIcon
                              className={cn(
                                "h-4 w-4",
                                isSelected && "text-[#F7D44C]"
                              )}
                            />
                            <span
                              className={isSelected ? "text-[#F7D44C]" : ""}
                            >
                              {statusInfo.label}
                            </span>
                          </>
                        )}
                      </button>
                    );
                  })}

                <button
                  onClick={() => selectStatus(0)}
                  className="flex items-center gap-3 w-full text-left px-3 py-2 text-red-400 hover:text-red-300 rounded-md"
                >
                  <Trash className="h-4 w-4 text-red-400 hover:text-red-300e" />
                  <span>Remove</span>
                </button>
              </div>

              {/* Rating Section */}
              <div className="border-t border-gray-700 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white">Your Rating</span>
                  <StarRating rating={rating} onRatingChange={handleRating} />
                </div>

                <button
                  onClick={() => setActiveView("review")}
                  className="flex items-center gap-3 w-full text-left px-3 py-2 text-white hover:bg-gray-700 rounded-md"
                >
                  <MessageCircle className="h-4 w-4 text-gray-400" />
                  <span>
                    {userMedia?.review ? "Edit review..." : "Write a review..."}
                  </span>
                </button>
              </div>
            </>
          ) : activeView === "progress" ? (
            <MediaProgress
              media={prepareMediaForProgress()}
              userMedia={{ progress: userMedia?.progress || "" }}
              onSave={(progress, percent) =>
                handleProgressUpdate(progress, percent)
              }
              onBack={() => setActiveView("main")}
            />
          ) : (
            <>
              {/* Review View */}
              <div className="p-2 border-b border-gray-700">
                <button
                  onClick={() => setActiveView("main")}
                  className="flex items-center gap-2 font-medium py-2 px-3 rounded-md hover:scale-105 transition-transform duration-200 ease-in-out"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-medium mb-3">
                  {userMedia?.review ? "Edit Review" : "Write a Review"}
                </h3>

                <div className="space-y-4">
                  <div>
                    <textarea
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 min-h-[150px] text-white"
                      placeholder="Share your thoughts about this title..."
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleReviewSubmit}
                      className="w-full bg-[#F7D44C] text-[#6B4D1A] font-medium py-2 rounded-md hover:bg-[#f8da62] transition-colors"
                    >
                      Save Review
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default StatusButton;
