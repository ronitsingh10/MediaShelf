import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  primaryKey,
  unique,
  foreignKey,
  real,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean().notNull(),
  image: text(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp().notNull(),
  userName: text().unique(),
});

export const session = pgTable("session", {
  id: text().primaryKey(),
  expiresAt: timestamp().notNull(),
  token: text().notNull().unique(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp().notNull(),
  ipAddress: text(),
  userAgent: text(),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text().primaryKey(),
  accountId: text().notNull(),
  providerId: text().notNull(),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text(),
  refreshToken: text(),
  idToken: text(),
  accessTokenExpiresAt: timestamp(),
  refreshTokenExpiresAt: timestamp(),
  scope: text(),
  password: text(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp().notNull(),
});

export const verification = pgTable("verification", {
  id: text().primaryKey(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp().notNull(),
  createdAt: timestamp(),
  updatedAt: timestamp(),
});

export const media = pgTable(
  "media",
  {
    id: text().notNull(),
    mediaType: text().notNull(),
    title: text().notNull(),
    cover: text().notNull(),
    year: text(),
    description: text(),
    author: text(),
    publisher: text(),
    genres: text(),
    platforms: text(),
  },
  (table) => [primaryKey({ columns: [table.id, table.mediaType] })]
);

export const userMedia = pgTable(
  "user_media",
  {
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    mediaId: text().notNull(),
    mediaType: text().notNull(),
    status: text(),
    rating: real(),
    notes: text(),
    progress: text(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.mediaId, table.mediaType] }),
    foreignKey({
      columns: [table.mediaId, table.mediaType],
      foreignColumns: [media.id, media.mediaType],
    }).onDelete("cascade"),
  ]
);

export const follows = pgTable(
  "follows",
  {
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    followsId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp().notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.followsId] })]
);
