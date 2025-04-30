import Image from "next/image";
import Link from "next/link";
import { CircleUser } from "lucide-react";

interface MediaDetailsProps {
  id: string;
  title: string;
  mediaType: string;
  year: string;
  author: string;
  coverUrl: string;
  description?: string;
  name?: string;
}

const Results = ({
  id,
  title,
  mediaType,
  year,
  author,
  coverUrl,
  description,
  name,
  image,
  username,
  followers,
  following,
}: MediaDetailsProps) => {
  if (mediaType === "users") {
    return (
      <Link
        href={`/profile/${username}`}
        className="flex items-start p-3 gap-6 max-w-3xl rounded-lg transition-colors duration-300 hover:bg-indigo-500 group"
      >
        <div className="shrink-0 w-12 h-12 rounded-full overflow-hidden bg-gray-100 shadow-sm flex items-center justify-center group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
          {image ? (
            <Image
              src={coverUrl || "/placeholder.svg"}
              alt={`Cover for ${title}`}
              width={96}
              height={144}
              className="w-full h-full object-cover"
            />
          ) : (
            <CircleUser className="w-full h-full font-light bg-transparent text-gray-400" />
          )}
        </div>
        <div className="flex flex-col capitalize">
          <h2 className="text-lg font-medium text-gray-900 group-hover:text-white transition-colors">
            {`@${username} • ${name}`}
          </h2>
          <div className="flex text-sm items-center gap-2 mt-1 text-gray-500 group-hover:text-white transition-colors">
            <span>{`Followers: ${followers} • Following: ${following}`}</span>
            {author && (
              <div>
                <span className="text-gray-400 group-hover:text-white/70 transition-colors mr-2">
                  •
                </span>
                <span>{author}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/${mediaType}/${id}`}
      className="flex items-start p-3 gap-6 max-w-3xl rounded-lg transition-colors duration-300 hover:bg-indigo-500 group"
    >
      <div className="shrink-0 w-24 h-36 rounded overflow-hidden bg-gray-100 shadow-sm flex items-center justify-center group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
        <Image
          src={coverUrl || "/placeholder.svg"}
          alt={`Cover for ${title}`}
          width={96}
          height={144}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col">
        <h2 className="text-lg font-medium text-gray-900 group-hover:text-white transition-colors">
          {title}
        </h2>
        <div className="flex text-sm items-center gap-2 mt-1 text-gray-500 group-hover:text-white transition-colors">
          <span>{year}</span>
          {author && (
            <div>
              <span className="text-gray-400 group-hover:text-white/70 transition-colors mr-2">
                •
              </span>
              <span>{author}</span>
            </div>
          )}
        </div>
        {/* <div>{description}</div> */}
        <div className="flex justify-end">
          <p className="text-sm mt-1 text-gray-700 line-clamp-2 tracking-tight group-hover:text-white ">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Results;
