import Image from "next/image";
import { Clock, BookOpenText } from "lucide-react";
import { fetchMediaDetails } from "@/app/api/mediaDetails";
import ScaleInWrapper from "./components/ScaleInWrapper";
import BackButton from "./components/BackButton";
import Overview from "./components/Overview";
import StatusButton from "./components/StatusButton";
import {
  getMediaReviews,
  getUserMediaDetails,
} from "@/server/actions/media-actions";
import Reviews from "./components/Reviews";

const MediaDetailPage = async ({
  params,
}: {
  params: { mediaType: string; id: string };
}) => {
  const { mediaType, id } = params;
  // Decode the mediaType (for cases like "TV%20Shows")
  const decodedMediaType = decodeURIComponent(mediaType);
  // Fetch media details based on type

  const [media, userMedia, reviews] = await Promise.all([
    fetchMediaDetails(decodedMediaType, id),
    getUserMediaDetails(id, decodedMediaType),
    getMediaReviews(id, decodedMediaType),
  ]);

  return (
    <ScaleInWrapper>
      <div className="min-h-screen bg-slate-900 text-slate-200 pb-12">
        {/* Backdrop image with gradient overlay */}

        <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden">
          {media.backdrop && (
            <Image
              src={media.backdrop}
              alt="Movie backdrop"
              width={1920}
              height={1080}
              className="object-cover w-full h-full"
              sizes="100vw"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-900/80 to-slate-900"></div>
          <div className="absolute top-4 left-4 z-20">
            <BackButton />
          </div>
        </div>
        <div className="container mx-auto px-8 -mt-72 pb-12 relative z-10">
          <div className="grid md:grid-cols-[300px_1fr] gap-8 items-start relative">
            {/* Movie poster */}
            <div className="relative z-10 mx-auto md:mx-0">
              <Image
                src={media.poster || "/placeholder.svg"}
                alt="Movie poster"
                width={300}
                height={450}
                className="rounded-lg shadow-xl border-4 border-slate-800 mt-14 sm:mt-0"
              />
            </div>

            {/* Movie details */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                {media.title}
              </h1>
              <p className="text-xl text-slate-300 mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                {media.tagline}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div>
                  <p className="text-slate-400 text-sm">Release Year</p>
                  <p className="text-white font-medium">{media.releaseDate}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">
                    {decodedMediaType === "books" ? "Pages" : "Runtime"}
                  </p>
                  <div className="flex items-center">
                    {decodedMediaType === "books" ? (
                      <BookOpenText className="h-4 w-4 mr-1 text-slate-400" />
                    ) : (
                      <Clock className="h-4 w-4 mr-1 text-slate-400" />
                    )}
                    <p className="text-white font-medium">
                      {decodedMediaType === "books"
                        ? media.pages
                        : decodedMediaType === "TV Shows"
                        ? `${media.seasons} Seasons`
                        : media.runtime}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Rating</p>
                  <p className="text-white font-medium">PG-13</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Genre</p>
                  <p className="text-white font-medium">
                    {media.genres.join(", ")}
                  </p>
                </div>
              </div>

              {/* <p className="text-lg leading-relaxed mb-6">{media.overview}</p> */}
              <Overview text={media.overview} />

              <div className="flex flex-wrap gap-4 mb-8">
                <StatusButton
                  id={id}
                  media={media}
                  userMedia={userMedia.data}
                  mediaType={decodedMediaType}
                />
              </div>
            </div>
          </div>
          <Reviews
            mediaId={id}
            mediaType={decodedMediaType}
            userMediaData={reviews}
          />
        </div>
      </div>
    </ScaleInWrapper>
  );
};

export default MediaDetailPage;
