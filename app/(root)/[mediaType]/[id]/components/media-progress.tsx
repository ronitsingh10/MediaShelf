"use client";

import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface MediaProgressProps {
  media: {
    title: string;
    type: "movie" | "book" | "tv";
    runtime?: number; // minutes for movies
    pages?: number; // for books
    seasons?: number; // for TV shows
    episodes?: number[]; // episodes per season for TV shows
  };
  userMedia: {
    progress: string; // "100" for movies (minutes), "100" for books (pages), "S1E10" for TV shows
  };
  // onSave: (progress: string) => Promise<void>;
  onSave: (progress: string, percent?: string) => Promise<void>;
  onBack: () => void;
}

const MediaProgress = ({
  media,
  userMedia,
  onSave,
  onBack,
}: MediaProgressProps) => {
  // State for different media types
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPercent, setCurrentPercent] = useState(0);
  const [currentMinute, setCurrentMinute] = useState(0);
  const [currentSeason, setCurrentSeason] = useState(1);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Parse initial progress based on media type
  useEffect(() => {
    if (!userMedia?.progress) return;

    if (media.type === "book" && media.pages) {
      const page = Number.parseInt(userMedia.progress);
      setCurrentPage(page);
      setCurrentPercent(Math.round((page / media.pages) * 100));
    } else if (media.type === "movie" && media.runtime) {
      const minute = Number.parseInt(userMedia.progress) || 0;
      setCurrentMinute(minute);
      setCurrentPercent(Math.round((minute / media.runtime) * 100));
    } else if (media.type === "tv") {
      // Parse S1E10 format
      const match = userMedia.progress.match(/S(\d+)E(\d+)/);
      if (match) {
        setCurrentSeason(Number.parseInt(match[1]));
        setCurrentEpisode(Number.parseInt(match[2]));
      }
    }
  }, [userMedia, media]);

  console.log(currentMinute, currentPage);

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    const newValue = value[0];

    if (media.type === "book" && media.pages) {
      const page = Math.round((newValue / 100) * media.pages);
      setCurrentPage(page);
      setCurrentPercent(newValue);
    } else if (media.type === "movie" && media.runtime) {
      const minute = Math.round((newValue / 100) * media.runtime);
      console.log("function me minute:", minute);
      setCurrentMinute(minute);
      setCurrentPercent(newValue);
    }
  };

  // Handle page input change
  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = Number.parseInt(e.target.value) || 0;
    if (media.pages && page >= 0 && page <= media.pages) {
      setCurrentPage(page);
      setCurrentPercent(Math.round((page / media.pages) * 100));
    }
  };

  // Handle percent input change
  const handlePercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percent = Number.parseInt(e.target.value) || 0;
    if (percent >= 0 && percent <= 100) {
      setCurrentPercent(percent);

      if (media.type === "book" && media.pages) {
        setCurrentPage(Math.round((percent / 100) * media.pages));
      } else if (media.type === "movie" && media.runtime) {
        setCurrentMinute(Math.round((percent / 100) * media.runtime));
      }
    }
  };

  // Handle minute input change
  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minute = Number.parseInt(e.target.value) || 0;
    if (media.runtime && minute >= 0 && minute <= media.runtime) {
      setCurrentMinute(minute);
      setCurrentPercent(Math.round((minute / media.runtime) * 100));
    }
  };

  // Handle season change
  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentSeason(Number.parseInt(e.target.value));
    setCurrentEpisode(1); // Reset episode when season changes
  };

  // Handle episode change
  const handleEpisodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentEpisode(Number.parseInt(e.target.value));
  };

  // Handle save progress
  const handleSaveProgress = async () => {
    setIsLoading(true);
    try {
      let progressValue = "";

      if (media.type === "book") {
        progressValue = currentPage.toString();
      } else if (media.type === "movie") {
        progressValue = currentMinute.toString();
      } else if (media.type === "tv") {
        progressValue = `S${currentSeason}E${currentEpisode}`;
      }

      await onSave(progressValue, currentPercent.toString());
    } catch (error) {
      console.error("Failed to save progress:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get max episodes for current season
  const getMaxEpisodes = () => {
    if (!media.episodes || !media.seasons) return 0;
    return media.episodes[currentSeason - 1] || 0;
  };

  return (
    <div className="w-full bg-[#1A202C] text-white p-4 rounded-lg">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          <span className="text-xl font-bold">Back</span>
        </button>
      </div>

      {/* Title with progress question */}
      <div className="mb-6">
        <h2 className="text-gray-400 text-xl">
          How far are you in{" "}
          <span className="text-white font-medium">{media.title}</span> ?
        </h2>
      </div>

      {/* Progress display */}
      {media.type === "book" && (
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <span className="text-xl mr-2">📖</span>
            <span className="text-xl">
              On page {currentPage} of {media.pages}.
            </span>
          </div>
          <Slider
            value={[currentPercent]}
            min={0}
            max={100}
            step={1}
            onValueChange={handleSliderChange}
            className="my-6"
          />

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div>
              <label className="block text-lg mb-2">Page</label>
              <Input
                type="number"
                value={currentPage}
                onChange={handlePageChange}
                min={0}
                max={media.pages}
                className="bg-[#2D3748] border-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-lg mb-2">Or Percent</label>
              <Input
                type="number"
                value={currentPercent}
                onChange={handlePercentChange}
                min={0}
                max={100}
                className="bg-[#2D3748] border-gray-700 text-white"
              />
            </div>
          </div>
        </div>
      )}

      {media.type === "movie" && (
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <span className="text-xl mr-2">🎬</span>
            <span className="text-xl">
              {currentMinute} of {media.runtime} minutes watched.
            </span>
          </div>
          <Slider
            value={[currentPercent]}
            min={0}
            max={100}
            step={1}
            onValueChange={handleSliderChange}
            className="my-6"
          />

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div>
              <label className="block text-lg mb-2">Minutes</label>
              <Input
                type="number"
                value={currentMinute}
                onChange={handleMinuteChange}
                min={0}
                max={media.runtime}
                className="bg-[#2D3748] border-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-lg mb-2">Or Percent</label>
              <Input
                type="number"
                value={currentPercent}
                onChange={handlePercentChange}
                min={0}
                max={100}
                className="bg-[#2D3748] border-gray-700 text-white"
              />
            </div>
          </div>
        </div>
      )}

      {media.type === "tv" && (
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <span className="text-xl mr-2">📺</span>
            <span className="text-xl">
              Season {currentSeason}, Episode {currentEpisode}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div>
              <label className="block text-lg mb-2">Season</label>
              <select
                value={currentSeason}
                onChange={handleSeasonChange}
                className="w-full bg-[#2D3748] border border-gray-700 rounded-md p-2 text-white"
              >
                {Array.from({ length: media.seasons || 1 }, (_, i) => (
                  <option key={i} value={i + 1}>
                    Season {i + 1}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-lg mb-2">Episode</label>
              <select
                value={currentEpisode}
                onChange={handleEpisodeChange}
                className="w-full bg-[#2D3748] border border-gray-700 rounded-md p-2 text-white"
              >
                {Array.from({ length: getMaxEpisodes() }, (_, i) => (
                  <option key={i} value={i + 1}>
                    Episode {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-lg mb-2">Season Progress</label>
            <Progress
              value={(currentEpisode / getMaxEpisodes()) * 100}
              className="h-2 bg-gray-700"
            />
            <div className="text-sm text-gray-400 mt-1">
              {currentEpisode} of {getMaxEpisodes()} episodes
            </div>
          </div>
        </div>
      )}

      {/* Save button */}
      <Button
        onClick={handleSaveProgress}
        disabled={isLoading}
        className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md text-lg"
      >
        {isLoading ? "Saving..." : "Save Progress"}
      </Button>
    </div>
  );
};

export default MediaProgress;
