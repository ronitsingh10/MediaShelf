// "use client";

// import type React from "react";

// import { useEffect, useRef, useState } from "react";
// import { ChevronLeft, Book, Tv, Film } from "lucide-react";

// export type MediaType = "books" | "tv" | "movies";

// export interface MediaItem {
//   id: string;
//   title: string;
//   type: MediaType;
//   // Book properties
//   totalPages?: number;
//   // TV show properties
//   totalSeasons?: number;
//   totalEpisodes?: number;
//   // Movie properties
//   totalMinutes?: number;
// }

// // Progress is now a string in different formats based on media type
// export type ProgressString = string; // "100" for books/movies, "S1E10" for TV shows

// interface ProgressTrackerProps {
//   mediaType: MediaType;
//   media: MediaItem;
//   progress: ProgressString;
//   onProgressChange: (progress: ProgressString) => void;
//   onSave: () => void;
//   onBack: () => void;
// }

// // Helper functions to parse and format progress strings
// const parseProgress = (
//   mediaType: MediaType,
//   progressStr: string
// ): {
//   currentPage?: number;
//   currentMinute?: number;
//   currentSeason?: number;
//   currentEpisode?: number;
// } => {
//   if (mediaType === "books") {
//     return { currentPage: Number.parseInt(progressStr) || 0 };
//   } else if (mediaType === "movies") {
//     return { currentMinute: Number.parseInt(progressStr) || 0 };
//   } else if (mediaType === "tv") {
//     // Parse "S1E10" format
//     const match = progressStr.match(/S(\d+)E(\d+)/i);
//     if (match) {
//       return {
//         currentSeason: Number.parseInt(match[1]) || 1,
//         currentEpisode: Number.parseInt(match[2]) || 0,
//       };
//     }
//     return { currentSeason: 1, currentEpisode: 0 };
//   }
//   return {};
// };

// const formatProgress = (
//   mediaType: MediaType,
//   progress: {
//     currentPage?: number;
//     currentMinute?: number;
//     currentSeason?: number;
//     currentEpisode?: number;
//   }
// ): string => {
//   if (mediaType === "books") {
//     return `${progress.currentPage || 0}`;
//   } else if (mediaType === "movies") {
//     return `${progress.currentMinute || 0}`;
//   } else if (mediaType === "tv") {
//     return `S${progress.currentSeason || 1}E${progress.currentEpisode || 0}`;
//   }
//   return "";
// };

// const ProgressSlider = ({
//   value,
//   onChange,
//   label,
//   max = 100,
//   showLabel = true,
// }: {
//   value: number;
//   onChange: (value: number) => void;
//   label?: string;
//   max?: number;
//   showLabel?: boolean;
// }) => {
//   const sliderRef = useRef<HTMLDivElement>(null);
//   const isDraggingRef = useRef(false);

//   // Calculate percent based on value and max
//   const percent = Math.min(100, Math.max(0, (value / max) * 100));

//   // Handle slider drag
//   const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (!sliderRef.current) return;

//     const rect = sliderRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const percentValue = (x / rect.width) * 100;
//     onChange(Math.round((percentValue / 100) * max));
//   };

//   const handleMouseDown = () => {
//     isDraggingRef.current = true;
//   };

//   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (!isDraggingRef.current || !sliderRef.current) return;

//     const rect = sliderRef.current.getBoundingClientRect();
//     const x = Math.min(rect.width, Math.max(0, e.clientX - rect.left));
//     const percentValue = (x / rect.width) * 100;
//     onChange(Math.round((percentValue / 100) * max));
//   };

//   const handleMouseUp = () => {
//     isDraggingRef.current = false;
//   };

//   useEffect(() => {
//     const handleGlobalMouseUp = () => {
//       isDraggingRef.current = false;
//     };

//     window.addEventListener("mouseup", handleGlobalMouseUp);
//     return () => {
//       window.removeEventListener("mouseup", handleGlobalMouseUp);
//     };
//   }, []);

//   return (
//     <div className={`${showLabel ? "mb-6" : "mb-2"}`}>
//       {showLabel && label && (
//         <div className="flex justify-between items-center mb-2">
//           <span className="text-sm text-gray-300">{label}</span>
//           <span className="text-sm text-gray-300">
//             {value} / {max}
//           </span>
//         </div>
//       )}
//       <div
//         ref={sliderRef}
//         className="relative h-2 bg-gray-700 rounded-full cursor-pointer"
//         onClick={handleSliderClick}
//         onMouseDown={handleMouseDown}
//         onMouseMove={handleMouseMove}
//         onMouseUp={handleMouseUp}
//       >
//         <div
//           className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-green-500 z-10 cursor-grab active:cursor-grabbing transition-all duration-150 ease-out"
//           style={{ left: `${percent}%` }}
//           onMouseDown={(e) => {
//             e.stopPropagation();
//             handleMouseDown();
//           }}
//         />
//         <div
//           className="absolute left-0 top-0 h-full bg-green-500/30 rounded-full transition-all duration-150 ease-out"
//           style={{ width: `${percent}%` }}
//         />
//       </div>
//     </div>
//   );
// };

// export default function ProgressTracker({
//   mediaType,
//   media,
//   progress,
//   onProgressChange,
//   onSave,
//   onBack,
// }: ProgressTrackerProps) {
//   // Parse the progress string into numeric values
//   const [parsedProgress, setParsedProgress] = useState(
//     parseProgress(mediaType, progress)
//   );

//   // Calculate overall progress percentage
//   const [percent, setPercent] = useState(0);

//   // Update parsed progress when progress string changes
//   useEffect(() => {
//     setParsedProgress(parseProgress(mediaType, progress));
//   }, [progress, mediaType]);

//   // Calculate percent whenever progress changes
//   useEffect(() => {
//     if (mediaType === "books" && media.totalPages) {
//       setPercent(
//         Math.round(((parsedProgress.currentPage || 0) / media.totalPages) * 100)
//       );
//     } else if (
//       mediaType === "tv" &&
//       media.totalSeasons &&
//       media.totalEpisodes
//     ) {
//       const totalProgress =
//         ((parsedProgress.currentSeason || 1) - 1) * (media.totalEpisodes || 0) +
//         (parsedProgress.currentEpisode || 0);
//       const totalPossible =
//         (media.totalSeasons || 0) * (media.totalEpisodes || 0);
//       setPercent(Math.round((totalProgress / totalPossible) * 100));
//     } else if (mediaType === "movies" && media.totalMinutes) {
//       setPercent(
//         Math.round(
//           ((parsedProgress.currentMinute || 0) / media.totalMinutes) * 100
//         )
//       );
//     }
//   }, [parsedProgress, mediaType, media]);

//   // Update progress when percent changes
//   const handlePercentChange = (value: number) => {
//     // Clamp value between 0 and 100
//     const clampedValue = Math.max(0, Math.min(100, value));
//     setPercent(clampedValue);

//     let newProgress = { ...parsedProgress };

//     if (mediaType === "books" && media.totalPages) {
//       newProgress = {
//         ...newProgress,
//         currentPage: Math.round((clampedValue * media.totalPages) / 100),
//       };
//     } else if (
//       mediaType === "tv" &&
//       media.totalSeasons &&
//       media.totalEpisodes
//     ) {
//       const totalEpisodes =
//         (media.totalSeasons || 0) * (media.totalEpisodes || 0);
//       const currentTotalEpisodes = Math.round(
//         (clampedValue * totalEpisodes) / 100
//       );
//       const currentSeason =
//         Math.floor(currentTotalEpisodes / (media.totalEpisodes || 1)) + 1;
//       const currentEpisode = currentTotalEpisodes % (media.totalEpisodes || 1);

//       newProgress = {
//         ...newProgress,
//         currentSeason: currentSeason,
//         currentEpisode: currentEpisode,
//       };
//     } else if (mediaType === "movies" && media.totalMinutes) {
//       newProgress = {
//         ...newProgress,
//         currentMinute: Math.round((clampedValue * media.totalMinutes) / 100),
//       };
//     }

//     // Format the new progress back to a string and call the callback
//     onProgressChange(formatProgress(mediaType, newProgress));
//   };

//   // Update specific progress values
//   const updateProgress = (newValues: {
//     currentPage?: number;
//     currentMinute?: number;
//     currentSeason?: number;
//     currentEpisode?: number;
//   }) => {
//     const updatedProgress = { ...parsedProgress, ...newValues };
//     onProgressChange(formatProgress(mediaType, updatedProgress));
//   };

//   const formatTime = (minutes: number): string => {
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     if (hours > 0) {
//       return `${hours}h ${mins}m`;
//     }
//     return `${mins}m`;
//   };

//   const getProgressText = () => {
//     if (mediaType === "books") {
//       return `On page ${parsedProgress.currentPage} of ${media.totalPages}.`;
//     } else if (mediaType === "tv") {
//       return `On S${parsedProgress.currentSeason} E${parsedProgress.currentEpisode} of ${media.totalSeasons} seasons.`;
//     } else if (mediaType === "movies") {
//       return `At ${formatTime(
//         parsedProgress.currentMinute || 0
//       )} of ${formatTime(media.totalMinutes || 0)}.`;
//     }
//     return "";
//   };

//   const getIcon = () => {
//     if (mediaType === "books") return <Book className="w-5 h-5" />;
//     if (mediaType === "tv") return <Tv className="w-5 h-5" />;
//     return <Film className="w-5 h-5" />;
//   };

//   return (
//     <div className="bg-[#0f1729] min-h-screen text-white p-4">
//       <div className="max-w-md mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <button
//             className="flex items-center gap-2 text-xl font-medium"
//             onClick={onBack}
//           >
//             <ChevronLeft className="h-6 w-6" />
//             Back
//           </button>
//         </div>

//         {/* Title */}
//         <h1 className="text-2xl text-gray-300 mb-6">
//           How far are you in{" "}
//           <span className="text-white font-semibold">{media.title}</span> ?
//         </h1>

//         {/* Progress Display */}
//         <div className="flex items-center gap-3 mb-2">
//           {getIcon()}
//           <span className="text-xl">{getProgressText()}</span>
//         </div>

//         {/* Overall Progress Bar */}
//         <ProgressSlider
//           value={percent}
//           onChange={handlePercentChange}
//           showLabel={false}
//         />

//         {/* Media-specific sliders and inputs */}
//         {mediaType === "books" && (
//           <>
//             <div className="mt-6 mb-4">
//               <ProgressSlider
//                 value={parsedProgress.currentPage || 0}
//                 onChange={(value) => updateProgress({ currentPage: value })}
//                 max={media.totalPages || 100}
//                 label="Pages"
//               />
//             </div>
//             <div className="grid grid-cols-[1fr,2fr] items-center mb-4">
//               <label className="text-xl">Page</label>
//               <input
//                 type="number"
//                 className="bg-[#1a2235] border border-gray-700 rounded-md px-4 py-3 text-xl"
//                 value={parsedProgress.currentPage}
//                 onChange={(e) =>
//                   updateProgress({
//                     currentPage: Number.parseInt(e.target.value) || 0,
//                   })
//                 }
//               />
//             </div>
//             <div className="grid grid-cols-[1fr,2fr] items-center mb-8">
//               <label className="text-xl">Or Percent</label>
//               <input
//                 type="number"
//                 className="bg-[#1a2235] border border-gray-700 rounded-md px-4 py-3 text-xl"
//                 value={percent}
//                 onChange={(e) =>
//                   handlePercentChange(Number.parseInt(e.target.value) || 0)
//                 }
//               />
//             </div>
//           </>
//         )}

//         {mediaType === "tv" && (
//           <>
//             <div className="mt-6 mb-4">
//               <ProgressSlider
//                 value={parsedProgress.currentSeason || 1}
//                 onChange={(value) =>
//                   updateProgress({ currentSeason: Math.max(1, value) })
//                 }
//                 max={media.totalSeasons || 1}
//                 label="Seasons"
//               />

//               <ProgressSlider
//                 value={parsedProgress.currentEpisode || 0}
//                 onChange={(value) => updateProgress({ currentEpisode: value })}
//                 max={media.totalEpisodes || 10}
//                 label="Episodes"
//               />
//             </div>
//             <div className="grid grid-cols-[1fr,2fr] items-center mb-4">
//               <label className="text-xl">Season</label>
//               <input
//                 type="number"
//                 className="bg-[#1a2235] border border-gray-700 rounded-md px-4 py-3 text-xl"
//                 value={parsedProgress.currentSeason}
//                 min={1}
//                 max={media.totalSeasons}
//                 onChange={(e) =>
//                   updateProgress({
//                     currentSeason: Math.max(
//                       1,
//                       Number.parseInt(e.target.value) || 1
//                     ),
//                   })
//                 }
//               />
//             </div>
//             <div className="grid grid-cols-[1fr,2fr] items-center mb-4">
//               <label className="text-xl">Episode</label>
//               <input
//                 type="number"
//                 className="bg-[#1a2235] border border-gray-700 rounded-md px-4 py-3 text-xl"
//                 value={parsedProgress.currentEpisode}
//                 min={0}
//                 max={media.totalEpisodes}
//                 onChange={(e) =>
//                   updateProgress({
//                     currentEpisode: Number.parseInt(e.target.value) || 0,
//                   })
//                 }
//               />
//             </div>
//             <div className="grid grid-cols-[1fr,2fr] items-center mb-8">
//               <label className="text-xl">Current Progress</label>
//               <div className="bg-[#1a2235] border border-gray-700 rounded-md px-4 py-3 text-xl">
//                 {progress}
//               </div>
//             </div>
//           </>
//         )}

//         {mediaType === "movies" && (
//           <>
//             <div className="mt-6 mb-4">
//               <ProgressSlider
//                 value={parsedProgress.currentMinute || 0}
//                 onChange={(value) => updateProgress({ currentMinute: value })}
//                 max={media.totalMinutes || 120}
//                 label="Minutes"
//               />
//             </div>
//             <div className="grid grid-cols-[1fr,2fr] items-center mb-4">
//               <label className="text-xl">Minutes</label>
//               <input
//                 type="number"
//                 className="bg-[#1a2235] border border-gray-700 rounded-md px-4 py-3 text-xl"
//                 value={parsedProgress.currentMinute}
//                 onChange={(e) =>
//                   updateProgress({
//                     currentMinute: Number.parseInt(e.target.value) || 0,
//                   })
//                 }
//               />
//             </div>
//             <div className="grid grid-cols-[1fr,2fr] items-center mb-8">
//               <label className="text-xl">Or Percent</label>
//               <input
//                 type="number"
//                 className="bg-[#1a2235] border border-gray-700 rounded-md px-4 py-3 text-xl"
//                 value={percent}
//                 onChange={(e) =>
//                   handlePercentChange(Number.parseInt(e.target.value) || 0)
//                 }
//               />
//             </div>
//           </>
//         )}

//         {/* Save Button */}
//         <button
//           className="w-full bg-[#5D5FEF] text-white font-medium py-4 rounded-md hover:bg-[#4b4ddb] transition-colors text-xl"
//           onClick={onSave}
//         >
//           Save Progress
//         </button>
//       </div>
//     </div>
//   );
// }
