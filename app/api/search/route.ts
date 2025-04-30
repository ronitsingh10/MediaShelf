import { getUsers } from "@/server/actions/user-actions";
import { NextResponse } from "next/server";
import { z } from "zod";

const querySchema = z.object({
  query: z.string().min(1, "Query is required"),
  type: z.enum(["books", "movies", "games", "TV Shows", "users"], {
    errorMap: () => ({
      message: "Type must be one of: books, movies, games, tv or users",
    }),
  }),
});

// Mapping for movie genre IDs to names
const movieGenreMap: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

const tvshowGenreMap: Record<number, string> = {
  10759: "Action & Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  10762: "Kids",
  9648: "Mystery",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
  37: "Western",
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const type = searchParams.get("type");

  console.log("1 ", query, type);

  // Validate query parameters
  const parsed = querySchema.safeParse({ query, type });
  console.log(parsed);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors.map((err) => err.message) },
      { status: 400 }
    );
  }

  console.log("2 ", query, type);

  const encodedQuery = encodeURIComponent(query);
  let apiUrl = "";

  if (type === "books") {
    apiUrl = `https://openlibrary.org/search.json?title=${encodedQuery}&fields=key,title,first_publish_year,cover_i,author_name,publisher,subtitle`;
  } else if (type === "movies") {
    const tmdbApiKey = process.env.TMDB_API_KEY;
    if (!tmdbApiKey) {
      return NextResponse.json(
        { error: "TMDB API key not set" },
        { status: 500 }
      );
    }
    apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${encodedQuery}`;
  } else if (type === "games") {
    const rawgApiKey = process.env.RAWG_API_KEY;
    if (!rawgApiKey) {
      return NextResponse.json(
        { error: "RAWG API key not set" },
        { status: 500 }
      );
    }
    apiUrl = `https://api.rawg.io/api/games?key=${rawgApiKey}&search=${encodedQuery}`;
  } else if (type === "TV Shows") {
    const tmdbApiKey = process.env.TMDB_API_KEY;
    if (!tmdbApiKey) {
      return NextResponse.json(
        { error: "TMDB API key not set" },
        { status: 500 }
      );
    }
    apiUrl = `https://api.themoviedb.org/3/search/tv?api_key=${tmdbApiKey}&query=${encodedQuery}`;
  } else if (type === "users") {
    const result = await getUsers(encodedQuery);
    console.log(result);

    return NextResponse.json({ results: result });
  } else {
    return NextResponse.json(
      { error: "Unsupported media type" },
      { status: 400 }
    );
  }

  console.log(apiUrl);

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      return NextResponse.json(
        { error: "Error fetching data" },
        { status: response.status }
      );
    }
    const data = await response.json();

    console.log(data);

    let transformedResults = [];

    if (type === "books") {
      transformedResults = (data.docs || [])
        .filter((book: any) => book.cover_i)
        .slice(0, 20)
        .map((book: any) => ({
          id: book.key.split("/").pop(),
          type: type,
          cover: book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}.jpg`
            : "/placeholder.svg",
          title: book.title || "No Title",
          author: book.author_name ? book.author_name.join(", ") : "Unknown",
          year: book.first_publish_year || "Unknown",
          publisher: book.publisher ? book.publisher[0] : "",
          description: book.subtitle || "",
        }));
    } else if (type === "movies") {
      transformedResults = (data.results || [])
        .filter((movie: any) => movie.poster_path)
        .slice(0, 20)
        .map((movie: any) => ({
          id: movie.id,
          type: type,
          cover: movie.poster_path
            ? `https://image.tmdb.org/t/p/original/${movie.poster_path}`
            : "/placeholder.svg",
          title: movie.title || "No Title",
          year: movie.release_date
            ? Number(movie.release_date.split("-")[0])
            : 0,
          description: movie.overview || "",
          genres: movie.genre_ids
            ? movie.genre_ids.map((id: number) => movieGenreMap[id]).join(", ")
            : "",
        }));
    } else if (type === "games") {
      transformedResults = (data.results || [])
        .filter((game: any) => game.background_image)
        .slice(0, 20)
        .map((game: any) => ({
          id: game.id,
          type: type,
          cover: game.background_image || "/placeholder.svg",
          title: game.name || "No Title",
          year: game.released ? Number(game.released.split("-")[0]) : "Unknown",
          genres: game.genres
            ? game.genres.map((g: any) => g.name).join(", ")
            : "",
          platforms: game.platforms
            ? game.platforms.map((p: any) => p.platform.name).join(", ")
            : "",
        }));
    } else if (type === "TV Shows") {
      console.log("TV shows ke andar hu me bc!!!!!!!!!!!!!", data.results);
      transformedResults = (data.results || [])
        .filter((tvShow: any) => tvShow.poster_path)
        .slice(0, 20)
        .map((tvShow: any) => ({
          id: tvShow.id,
          type: type,
          cover: tvShow.poster_path
            ? `https://image.tmdb.org/t/p/original/${tvShow.poster_path}`
            : "/placeholder.svg",
          title: tvShow.name || "No Title",
          year: tvShow.first_air_date
            ? Number(tvShow.first_air_date.split("-")[0])
            : 0,
          description: tvShow.overview || "",
          genres: tvShow.genre_ids
            ? tvShow.genre_ids
                .map((id: number) => tvshowGenreMap[id])
                .join(", ")
            : "",
        }));
      console.log("TV shows khatam ho gya bc!!!!!!!!!!!!!");
    }

    console.log(transformedResults);

    return NextResponse.json({ results: transformedResults });
    // return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
