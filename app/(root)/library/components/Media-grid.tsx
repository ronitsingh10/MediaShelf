import { useMedia } from "@/hooks/useMedia";
import { motion } from "framer-motion";
import MediaCard from "./MediaCard";
import MediaSkeleton from "./MediaSkeleton";

const MediaGrid = ({ selectedTab, selectedLetter }) => {
  const { medias, loading, error } = useMedia(selectedTab, selectedLetter);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-7">
        {Array.from({ length: 16 }).map((_, index) => (
          <MediaSkeleton key={index} />
        ))}
      </div>
    );
  }

  const groupedMedia = medias.reduce((groups, media) => {
    let firstLetter = media.title.charAt(0).toUpperCase();
    if (!/^[A-Z]$/.test(firstLetter)) {
      firstLetter = "#";
    }
    if (!groups[firstLetter]) {
      groups[firstLetter] = [];
    }
    groups[firstLetter].push(media);
    return groups;
  }, {});

  const sortedLetters = Object.keys(groupedMedia).sort();

  Object.keys(groupedMedia).forEach((key) => {
    groupedMedia[key].sort((a, b) => a.title.localeCompare(b.title));
  });

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  // Child animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <div className="space-y-8">
      {sortedLetters.map((letter) => (
        <div key={letter}>
          <motion.h2
            className="text-3xl font-light text-primary"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {letter}
          </motion.h2>
          <motion.hr
            className="mb-8"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.7 }}
          />
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-7"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {groupedMedia[letter].map((media, index) => (
              <motion.div key={media.mediaId} variants={itemVariants}>
                <MediaCard
                  id={media.mediaId}
                  mediaType={selectedTab}
                  cover={media.cover}
                  title={media.title}
                  author={media.author}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      ))}
    </div>
  );
};

export default MediaGrid;
