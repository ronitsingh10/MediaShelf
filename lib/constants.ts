import {
  Book,
  BookMarked,
  CheckCircle,
  Circle,
  Clapperboard,
  Eye,
  Gamepad2,
  PlayCircle,
  Plus,
  Tv,
  UserSearch,
} from "lucide-react";

export const mediaTypes = [
  { key: "books", label: "Books", icon: Book },
  { key: "movies", label: "Movies", icon: Clapperboard },
  { key: "games", label: "Games", icon: Gamepad2 },
  { key: "TV Shows", label: "TV Shows", icon: Tv },
];

export const searchTypes = [
  { key: "books", label: "Books", icon: Book },
  { key: "movies", label: "Movies", icon: Clapperboard },
  { key: "games", label: "Games", icon: Gamepad2 },
  { key: "TV Shows", label: "TV Shows", icon: Tv },
  { key: "users", label: "Users", icon: UserSearch },
];

export const statusMap = {
  books: {
    0: {
      label: "Add to Library",
      icon: Plus,
      color: "bg-[#F7D44C] text-[#6B4D1A]",
    },
    1: {
      label: "Want to Read",
      icon: BookMarked,
      color: "bg-[#F7D44C] text-[#6B4D1A]",
    },
    2: {
      label: "Currently Reading",
      icon: Book,
      color: "bg-blue-400 text-blue-900 hover:bg-blue-500 border-blue-950",
    },
    3: {
      label: "Read",
      icon: CheckCircle,
      color: "bg-green-400 text-green-900 hover:bg-green-500 border-green-950",
    },
    4: {
      label: "Did Not Finish",
      icon: Circle,
      color: "bg-gray-700 text-gray-300 border-gray-950 hover:bg-gray-600",
    },
  },
  movies: {
    0: {
      label: "Add to Library",
      icon: Plus,
      color: "bg-[#F7D44C] text-[#6B4D1A]",
    },
    1: {
      label: "Want to Watch",
      icon: Eye,
      color: "bg-[#F7D44C] text-[#6B4D1A]",
    },
    2: {
      label: "Watching",
      icon: PlayCircle,
      color: "bg-blue-400 text-blue-900 hover:bg-blue-500 border-blue-950",
    },
    3: {
      label: "Watched",
      icon: CheckCircle,
      color: "bg-green-400 text-green-900 hover:bg-green-500 border-green-950",
    },
    4: {
      label: "Did Not Finish",
      icon: Circle,
      color: "bg-gray-700 text-gray-300 border-gray-950 hover:bg-gray-600",
    },
  },
  games: {
    0: {
      label: "Add to Library",
      icon: Plus,
      color: "bg-[#F7D44C] text-[#6B4D1A]",
    },
    1: {
      label: "Want to Play",
      icon: Gamepad2,
      color: "bg-[#F7D44C] text-[#6B4D1A]",
    },
    2: {
      label: "Playing",
      icon: PlayCircle,
      color: "bg-blue-400 text-blue-900 hover:bg-blue-500 border-blue-950",
    },
    3: {
      label: "Completed",
      icon: CheckCircle,
      color: "bg-green-400 text-green-900 hover:bg-green-500 border-green-950",
    },
    4: {
      label: "Dropped",
      icon: Circle,
      color: "bg-gray-700 text-gray-300 border-gray-950 hover:bg-gray-600",
    },
  },
  "TV Shows": {
    0: {
      label: "Add to Library",
      icon: Plus,
      color: "bg-[#F7D44C] text-[#6B4D1A]",
    },
    1: {
      label: "Want to Watch",
      icon: Eye,
      color: "bg-[#F7D44C] text-[#6B4D1A]",
    },
    2: {
      label: "Watching",
      icon: PlayCircle,
      color: "bg-blue-400 text-blue-900 hover:bg-blue-500 border-blue-950",
    },
    3: {
      label: "Watched",
      icon: CheckCircle,
      color: "bg-green-400 text-green-900 hover:bg-green-500 border-green-950",
    },
    4: {
      label: "Did Not Finish",
      icon: Circle,
      color: "bg-gray-700 text-gray-300 border-gray-950 hover:bg-gray-600",
    },
  },
};
