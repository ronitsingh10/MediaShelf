"use client";

import { useState, useEffect } from "react";
import { getUserMedia } from "@/server/actions/media-actions";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export const useMedia = (selectedTab, selectedLetter) => {
  const [medias, setMedias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getUserMedia();

        if (!result.success) {
          if (result.statusCode === 401) {
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

          throw new Error(result.message || "Failed to fetch media");
        }

        const mediaData = result.data;

        // Filter by media type if needed
        const filteredByType =
          selectedTab === "all"
            ? mediaData
            : mediaData.filter((item) => item.mediaType === selectedTab);

        // Filter by first letter if not "ALL"
        const filteredData =
          selectedLetter === "ALL"
            ? filteredByType
            : selectedLetter === "#"
            ? filteredByType.filter(
                (item) => !/^[A-Z]/i.test(item.title.charAt(0))
              )
            : filteredByType.filter(
                (item) => item.title.charAt(0).toUpperCase() === selectedLetter
              );

        setMedias(filteredData);
      } catch (error) {
        console.error("Error fetching media:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [selectedTab, selectedLetter, router]);

  return { medias, loading, error };
};
