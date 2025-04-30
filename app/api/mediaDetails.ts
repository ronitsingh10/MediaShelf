// Define types for different media responses
export type MovieDetails = {
  id: string;
  title: string;
  backdrop_path: string | null;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  runtime: number;
  genres: Array<{ id: number; name: string }>;
  overview: string;
  tagline: string;
  pages: string;
};

export type BookDetails = {
  id: string;
  title: string;
  cover_i: number;
  author_name: string[];
  first_publish_year: number;
  publisher: string[];
  subtitle: string;
  // Add other book-specific fields
};

export type GameDetails = {
  id: string;
  name: string;
  background_image: string;
  released: string;
  genres: Array<{ id: number; name: string }>;
  platforms: Array<{ platform: { id: number; name: string } }>;
  // Add other game-specific fields
};

export type TVShowDetails = {
  id: string;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  first_air_date: string;
  episode_run_time: number[];
  genres: Array<{ id: number; name: string }>;
  overview: string;
  number_of_seasons: number | null;
  // Add other TV show-specific fields
};

// Unified output format for all media types
export type MediaDetails = {
  title: string;
  backdrop: string;
  poster: string;
  rating: string;
  releaseDate: string | number;
  runtime: string;
  genres: string[];
  overview: string;
  author?: string;
  publisher?: string;
  platforms?: string;
  tagline?: string;
  pages?: string;
  seasons?: number;
  episodes?: number[];
};

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const day = date.getDate();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

// Function to fetch movie details
export async function fetchMovieDetails(id: string): Promise<MediaDetails> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error("TMDB API key is not defined in environment variables");
  }

  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`,
    { next: { revalidate: 3600 } } // Cache for 1 hour
  );

  const response2 = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`,
    { next: { revalidate: 3600 } }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch movie data: ${response.status}`);
  }

  const data: MovieDetails = await response.json();
  const cast = await response2.json();

  return {
    title: data.title,
    backdrop: data.backdrop_path
      ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
      : "/placeholder.svg",
    poster: data.poster_path
      ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
      : "/placeholder.svg",
    tagline: data.tagline,
    rating: data.vote_average.toFixed(1),
    releaseDate: data.release_date ? formatDate(data.release_date) : "",
    runtime: `${data.runtime} min`,
    genres: data.genres.map((g) => g.name),
    overview: data.overview,
  };
}

export async function fetchBookDetails(id: string): Promise<MediaDetails> {
  const response = await fetch(`https://openlibrary.org/works/${id}.json`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch book data: ${response.status}`);
  }

  const data = await response.json();

  // Fetch author information if available
  let authorName = "Unknown";
  if (data.authors && data.authors[0]?.author?.key) {
    const authorKey = data.authors[0].author.key.split("/").pop();
    const authorResponse = await fetch(
      `https://openlibrary.org/authors/${authorKey}.json`,
      { next: { revalidate: 3600 } }
    );
    if (authorResponse.ok) {
      const authorData = await authorResponse.json();
      authorName = authorData.name || "Unknown";
    }
  }

  // We need to fetch the editions to get page count and more reliable publish date
  // Get the work ID from the original ID
  const workId = id;
  let pageCount = data.number_of_pages || null;
  let publishDate = data.first_publish_date || null;
  let publisher = "Unknown Publisher";

  try {
    // Make a request to get editions of this work
    const editionsResponse = await fetch(
      `https://openlibrary.org/works/${workId}/editions.json?limit=5`,
      { next: { revalidate: 3600 } }
    );

    if (editionsResponse.ok) {
      const editionsData = await editionsResponse.json();

      // If we have at least one edition
      if (editionsData.entries && editionsData.entries.length > 0) {
        // Try to find an edition with the most complete data
        let bestEdition = editionsData.entries[0];

        for (const edition of editionsData.entries) {
          // Prioritize editions with both page count and publish date
          if (
            (edition.number_of_pages && edition.publish_date) ||
            (edition.number_of_pages && !bestEdition.number_of_pages) ||
            (edition.publish_date && !bestEdition.publish_date)
          ) {
            bestEdition = edition;
          }
        }

        // Extract data from best edition
        if (!pageCount) {
          pageCount = bestEdition.number_of_pages || pageCount;
        }

        // Get publish date information
        if (publishDate == null && bestEdition.publish_date) {
          publishDate = bestEdition.publish_date;
        }

        // Get publisher information
        if (bestEdition.publishers && bestEdition.publishers.length > 0) {
          publisher = bestEdition.publishers[0];
        }

        // If we still don't have page count, try to get it from the edition's detailed data
        if (!pageCount && bestEdition.key) {
          const editionKey = bestEdition.key.split("/").pop();
          const editionResponse = await fetch(
            `https://openlibrary.org/books/${editionKey}.json`,
            { next: { revalidate: 3600 } }
          );

          if (editionResponse.ok) {
            const editionData = await editionResponse.json();
            pageCount = editionData.number_of_pages || null;
            // Update publish date if not set yet
            if (!publishDate && editionData.publish_date) {
              publishDate = editionData.publish_date;
            }
            // Update publisher if not set yet
            if (
              publisher === "Unknown Publisher" &&
              editionData.publishers &&
              editionData.publishers.length > 0
            ) {
              publisher = editionData.publishers[0];
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error fetching book edition data:", error);
    // Continue without page count if there's an error
  }

  // Format the publication date if available
  let formattedPublishDate = publishDate;
  if (publishDate) {
    try {
      // Try to parse and format the date
      // This handles various date formats from the API
      const dateObj = new Date(publishDate);
      if (!isNaN(dateObj.getTime())) {
        formattedPublishDate = formatDate(publishDate);
      }
    } catch (e) {
      // If date parsing fails, use the original string
      console.error("Error formatting publish date:", e);
    }
  }

  return {
    title: data.title || "Unknown Title",
    tagline: data.subtitle || "",
    backdrop: "", // Use a placeholder for books
    poster: data.covers?.[0]
      ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg`
      : "/placeholder.svg",
    rating: "N/A", // Books might not have ratings in this API
    releaseDate: formattedPublishDate || "Unknown",
    runtime: "N/A", // Not applicable for books
    genres: data.subjects?.slice(0, 5) || [],
    overview: data.description?.value || data.description || "",
    author: authorName,
    publisher: publisher,
    pages: pageCount, // Add the page count field
  };
}

// Function to fetch game details
export async function fetchGameDetails(id: string): Promise<MediaDetails> {
  const apiKey = process.env.RAWG_API_KEY;
  if (!apiKey) {
    throw new Error("RAWG API key is not defined in environment variables");
  }

  const response = await fetch(
    `https://api.rawg.io/api/games/${id}?key=${apiKey}`,
    { next: { revalidate: 3600 } }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch game data: ${response.status}`);
  }

  const data: GameDetails = await response.json();

  return {
    title: data.name,
    backdrop: data.background_image_additional || "/placeholder.svg",
    poster: data.background_image || "/placeholder.svg",
    rating: "N/A", // You can use metacritic score if available in the API
    releaseDate: data.released ? formatDate(data.released) : "",
    runtime: `${data.playtime} hours`, // Not applicable for games
    genres: data.genres.map((g) => g.name),
    overview: data.description_raw || "",
    platforms: data.platforms?.map((p) => p.platform.name).join(", ") || "",
  };
}

// Function to fetch TV show details
export async function fetchTVShowDetails(id: string): Promise<MediaDetails> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error("TMDB API key is not defined in environment variables");
  }

  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=en-US`,
    { next: { revalidate: 3600 } }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch TV show data: ${response.status}`);
  }

  const data: TVShowDetails = await response.json();

  const getEpisodes = () => {
    const episodes = [];

    data.seasons.forEach((season) => {
      const seasonNumber = season.season_number;
      const episodeCount = season.episode_count;

      if (seasonNumber !== 0) {
        episodes.push(episodeCount);
      }
    });

    return episodes;
  };

  return {
    title: data.name,
    tagline: data.tagline,
    backdrop: data.backdrop_path
      ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
      : "/placeholder.svg",
    poster: data.poster_path
      ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
      : "/placeholder.svg",
    rating: data.vote_average.toFixed(1),
    releaseDate: formatDate(data.first_air_date),
    runtime: data.episode_run_time?.[0]
      ? `${data.episode_run_time[0]} min`
      : "N/A",
    genres: data.genres.map((g) => g.name),
    overview: data.overview,
    seasons: data.number_of_seasons || 0,
    episodes: getEpisodes(),
  };
}

// Main function to fetch media details based on media type
export async function fetchMediaDetails(
  mediaType: string,
  id: string
): Promise<MediaDetails> {
  try {
    switch (mediaType.toLowerCase()) {
      case "movies":
        return await fetchMovieDetails(id);
      case "books":
        return await fetchBookDetails(id);
      case "games":
        return await fetchGameDetails(id);
      case "tv shows":
      case "tvshows":
      case "tv":
        return await fetchTVShowDetails(id);
      default:
        throw new Error(`Unsupported media type: ${mediaType}`);
    }
  } catch (error) {
    console.error(`Error fetching ${mediaType} details:`, error);

    // Return fallback data
    return {
      title: "Media Not Found",
      backdrop: "/placeholder.svg",
      poster: "/placeholder.svg",
      rating: "0.0",
      releaseDate: "",
      runtime: "",
      genres: [],
      overview: "Media details could not be loaded.",
    };
  }
}
