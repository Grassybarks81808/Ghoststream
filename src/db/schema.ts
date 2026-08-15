import { pgTable, serial, text, integer, timestamp, real } from "drizzle-orm/pg-core";

export const watchHistory = pgTable("watch_history", {
  id: serial("id").primaryKey(),
  tmdbId: integer("tmdb_id").notNull(),
  mediaType: text("media_type").notNull().default("movie"),
  title: text("title").notNull(),
  posterPath: text("poster_path"),
  backdropPath: text("backdrop_path"),
  season: integer("season"),
  episode: integer("episode"),
  progress: real("progress").default(0),
  duration: real("duration").default(0),
  overview: text("overview"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  tmdbId: integer("tmdb_id").notNull(),
  mediaType: text("media_type").notNull().default("movie"),
  title: text("title").notNull(),
  posterPath: text("poster_path"),
  backdropPath: text("backdrop_path"),
  overview: text("overview"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
