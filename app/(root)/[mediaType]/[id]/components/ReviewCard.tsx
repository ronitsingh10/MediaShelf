import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface ReviewCardProps {
  review: {
    user: {
      id: string;
      name: string;
      image?: string | null;
      userName?: string;
    };
    user_media: {
      mediaId: string;
      mediaType: string;
      notes?: string;
      progress?: string;
      rating?: number;
      status: string;
    };
    createdAt: Date;
  };
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const initials = review.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10 border border-slate-600">
          <AvatarImage
            src={review.user.image || "/placeholder.svg"}
            alt={review.user.name}
          />
          <AvatarFallback className="bg-slate-700 text-slate-200">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <h4 className="font-medium text-slate-200">
              {review.user.name}{" "}
              {review.user.userName && (
                <span className="text-slate-400 text-sm">
                  @{review.user.userName}
                </span>
              )}
            </h4>
            {/* <span className="text-xs text-slate-400">
              {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
            </span> */}
          </div>
          <div className="flex items-center mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < (review.user_media.rating || 0)
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-600"
                }`}
              />
            ))}
          </div>
          {review.user_media.notes && (
            <p className="text-slate-300 text-sm">{review.user_media.notes}</p>
          )}
          {review.user_media.progress && (
            <div className="mt-2 text-xs text-slate-400">
              Progress: {review.user_media.progress}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
