import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  deleteUserMedia,
  insertUserMedia,
} from "@/server/actions/media-actions";
import { toast } from "sonner";
import { FC, useState } from "react";
import { Edit, Loader2, PlusIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type SearchResultsProps = {
  mediaType: string;
  results: SearchResult[];
};

type itemStatus = "idle" | "adding" | "added" | "deleting";

const SearchResults: FC<SearchResultsProps> = ({ mediaType, results }) => {
  const [itemStatus, setItemStatus] = useState<Record<string, itemStatus>>({});
  const router = useRouter();

  const addItem = async (item: SearchResult) => {
    setItemStatus((prev) => ({
      ...prev,
      [item.id]: "adding",
    }));

    const { success, message, statusCode } = await insertUserMedia(item);

    if (!success && statusCode === 401) {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push(
              "/sign-in?redirect=" +
                encodeURIComponent(window.location.pathname)
            ); // redirect to login page
          },
        },
      });
      return;
    }

    toast[success ? "success" : "error"](message);

    setItemStatus((prev) => ({
      ...prev,
      [item.id]: success ? "added" : "idle",
    }));
  };

  const deleteItem = async (item: SearchResult) => {
    setItemStatus((prev) => ({
      ...prev,
      [item.id]: "deleting",
    }));

    const { success, message, statusCode } = await deleteUserMedia(item);

    if (!success && statusCode === 401) {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push(
              "/sign-in?redirect=" +
                encodeURIComponent(window.location.pathname)
            ); // redirect to login page
          },
        },
      });
      return;
    }

    toast[success ? "success" : "error"](message);

    setItemStatus((prev) => ({
      ...prev,
      [item.id]: success ? "idle" : "added",
    }));
  };

  return (
    <div className="max-w-auto mx-auto">
      <hr className="my-10" />
      <h1 className="text-4xl font-bold mb-8">Results</h1>
      <div className="space-y-8">
        {results.map((item) => {
          const status = itemStatus[item.id] || "idle";
          return (
            <div
              key={item.id}
              className="flex gap-6 p-6 rounded-lg shadow-sm border"
            >
              {/* Left side - Image */}
              <div className="flex-shrink-0 w-48 h-64 relative">
                <Image
                  src={item.cover}
                  alt={item.title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>

              {/* Right side - Content */}
              <div className="flex flex-col flex-grow justify-between">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">{item.title}</h2>
                  {item.author && (
                    <p className="text-lg text-gray-600">
                      Author: {item.author}
                    </p>
                  )}
                  <div className="flex gap-2 text-gray-600">
                    <span>{item.year}</span>
                    {item.publisher && (
                      <>
                        <span>•</span>
                        <span>{item.publisher}</span>
                      </>
                    )}
                  </div>
                  {item.genres && (
                    <p className="text-sm text-gray-500">
                      Genres: {item.genres}
                    </p>
                  )}
                  {item.platforms && (
                    <p className="text-sm text-gray-500">
                      Platforms: {item.platforms}
                    </p>
                  )}
                  {item.description && (
                    <p className="text-gray-700 mt-4 line-clamp-3">
                      {item.description}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {status === "added" || status === "deleting" ? (
                    <Button
                      disabled={status === "deleting"}
                      variant="destructive"
                      onClick={() => deleteItem(item)}
                      className="flex items-center gap-2"
                    >
                      {status === "deleting" ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      disabled={status === "adding"}
                      onClick={() => addItem(item)}
                      className="bg-sky-400 hover:bg-sky-500 text-white flex items-center gap-2"
                    >
                      {status === "adding" ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <PlusIcon className="mr-2 h-4 w-4" />
                          Add Item
                        </>
                      )}
                    </Button>
                  )}

                  <Link href={`/${mediaType}/${item.id}`} passHref>
                    <Button
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit/View
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchResults;
