"use client";

import Image from "next/image";
import { FC } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

type MediaCardProps = {
  id: string;
  mediaType: string;
  title: string;
  cover: string;
  author: string | null;
};

const MediaCard: FC<MediaCardProps> = ({
  id,
  mediaType,
  cover,
  title,
  author,
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/${mediaType}/${id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden group cursor-pointer"
      onClick={handleClick}
    >
      <div className="aspect-[2/3] relative overflow-hidden rounded-md">
        <Image
          src={cover}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-2 tracking-tight text-center">
        <h3 className="font-semibold line-clamp-2">{title}</h3>
        {author && <p className="text-sm text-gray-600">{author}</p>}
      </div>
    </motion.div>
  );
};

export default MediaCard;
