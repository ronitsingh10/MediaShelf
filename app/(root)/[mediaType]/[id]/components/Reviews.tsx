import { MessageSquare } from "lucide-react";
import ReviewCard from "./ReviewCard";
import SlideInWrapper from "./SlideInWrapper";

interface ReviewsProps {
  mediaId: string;
  mediaType: string;
  userMediaData: {
    success: boolean;
    data: Array<{
      user: {
        id: string;
        name: string;
        email: string;
        image: string | null;
        userName?: string;
        createdAt: Date;
      };
      user_media: {
        mediaId: string;
        mediaType: string;
        notes?: string;
        progress?: string;
        rating?: number;
        status: string;
        userId: string;
      };
    }>;
  };
}

const Reviews = ({ mediaId, mediaType, userMediaData }: ReviewsProps) => {
  const reviews = userMediaData?.data || [];

  return (
    <div className="mt-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <MessageSquare className="mr-2 h-5 w-5" />
          Reviews
          <span className="ml-2 text-sm bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
            {reviews.length}
          </span>
        </h2>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/30 rounded-lg border border-slate-700">
          <MessageSquare className="h-12 w-12 mx-auto text-slate-600 mb-3" />
          <h3 className="text-xl font-medium text-slate-400 mb-2">
            No reviews yet
          </h3>
          <p className="text-slate-500 mb-4">
            Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reviews.map((review, index) => (
            <SlideInWrapper key={review.user.id} delay={index * 0.1}>
              <ReviewCard review={review} />
            </SlideInWrapper>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
