import Image from "next/image";
import { MoreHorizontal, Book, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mediaTypes, statusMap } from "@/lib/constants";
import { useState } from "react";
import Link from "next/link";
import StarDisplay from "./starDisplay";

// Helper function to get media type icon
const getMediaTypeIcon = (mediaType: string) => {
  const mediaTypeObj = mediaTypes.find((type) => type.key === mediaType);
  if (!mediaTypeObj) return Book;
  return mediaTypeObj.icon;
};

// Helper function to get status text based on media type and status code
const getStatusText = (
  mediaType: string,
  statusCode: number,
  progress?: string,
  rating?: number,
  review?: string
) => {
  if (rating) {
    return `Rated ${rating} stars`;
  }

  if (review) {
    return `Added a review`;
  }

  if (!statusMap[mediaType as keyof typeof statusMap]) return "";

  const status =
    statusMap[mediaType as keyof typeof statusMap][
      statusCode as keyof (typeof statusMap)[keyof typeof statusMap]
    ];
  if (!status) return "";

  switch (statusCode) {
    case 1:
      return `Wants to ${
        mediaType === "books"
          ? "Read"
          : mediaType === "games"
          ? "Play"
          : "Watch"
      }`;
    case 2:
      if (progress) {
        return `Is ${progress}% done with`;
      }
      return mediaType === "books"
        ? "Currently Reading"
        : mediaType === "games"
        ? "Playing"
        : "Watching";
    case 3:
      return mediaType === "books"
        ? "Has Read"
        : mediaType === "games"
        ? "Completed"
        : "Has Watched";
    case 4:
      return "Did Not Finish";
    default:
      return status.label;
  }
};

// Helper function to get the creator label based on media type
const getCreatorLabel = (mediaType: string) => {
  switch (mediaType) {
    case "books":
      return "by";
    case "movies":
      return "directed by";
    case "games":
      return "developed by";
    case "TV Shows":
      return "created by";
    default:
      return "by";
  }
};

interface MediaUpdateCardProps {
  user: {
    userName: string;
    name: string;
    avatar: string;
    timeAgo: string;
  };
  media: {
    id: string;
    title: string;
    creator?: string;
    cover: string;
    mediaType: string;
    statusCode: number;
    progress?: string;
    rating?: number;
    review?: string;
  };
  liked?: boolean;
}

const FeedCard = ({ user, media }: MediaUpdateCardProps) => {
  console.log("FeedCard Props:", user, media);
  const [isHovered, setIsHovered] = useState(false);
  const MediaIcon = getMediaTypeIcon(media.mediaType);
  const statusText = getStatusText(
    media.mediaType,
    media.statusCode,
    media.progress,
    media.rating,
    media.review
  );
  const creatorLabel = getCreatorLabel(media.mediaType);

  // Get the status button configuration
  // const statusConfig =
  //   statusMap[media.mediaType as keyof typeof statusMap]?.[
  //     media.statusCode as keyof (typeof statusMap)[keyof typeof statusMap]
  //   ];

  // const StatusIcon = statusConfig?.icon || Plus;
  // const statusColor = statusConfig?.color || "bg-[#F7D44C] text-[#6B4D1A]";
  // const statusLabel = statusConfig?.label || "Add to Library";

  return (
    <div
      className="p-6 transition-all duration-200 border-t border-transparent"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <Link
              href={`/profile/${user.userName}`}
              passHref
              className="hover:underline capitalize"
            >
              {user.name}
            </Link>
            <span className="text-gray-500 mx-2">•</span>
            <span className="text-gray-500">{user.timeAgo}</span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="">Hide post</DropdownMenuItem>
            <DropdownMenuItem className="">Report</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex gap-4">
        <div
          className={`flex-shrink-0 w-28 h-40 relative overflow-hidden rounded-xl shadow-md transition-transform duration-300 ${
            isHovered ? "scale-105" : ""
          }`}
        >
          <Image
            src={media.cover || "/placeholder.svg"}
            alt={`${media.title} cover`}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col">
          <div className="mb-1 flex items-center gap-1">
            <MediaIcon className="h-4 w-4" />
            <span>{statusText}</span>
          </div>
          <h3 className="text-xl font-bold  mb-1">{media.title}</h3>
          {media.creator && (
            <div className="">
              {creatorLabel} {media.creator}
              {/* {media.rating && <StarDisplay rating={media.rating} />} */}
            </div>
          )}
          {media.rating && <StarDisplay rating={media.rating} />}

          {media.review && (
            <div className="mb-4 mt-2">
              <p className="line-clamp-3">{`“${media.review}”`}</p>
            </div>
          )}

          <div className="mt-auto">
            <Link href={`/${media.mediaType}/${media.id}`} passHref>
              <Button className={`flex items-center gap-2`}>
                <Info className="h-4 w-4" />
                Get Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
