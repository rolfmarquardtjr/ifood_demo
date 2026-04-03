import { pgTable, serial, text, boolean, timestamp, integer, jsonb } from "drizzle-orm/pg-core";

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(), // 'seguranca' | 'prevencao' | 'conscientizacao'
  imageUrl: text("image_url"),
  imageSource: text("image_source"), // 'gemini' | 'pixabay' | 'manual'
  audioUrl: text("audio_url"),
  sources: jsonb("sources").notNull().$type<Array<{ url: string; title: string; site: string }>>(),
  status: text("status").notNull().default("published"), // 'published' | 'draft' | 'unpublished'
  aiModel: text("ai_model"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const podcasts = pgTable("podcasts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  audioUrl: text("audio_url").notNull(),
  durationSeconds: integer("duration_seconds"),
  script: jsonb("script").$type<Array<{ speaker: string; text: string }>>(),
  articleIds: jsonb("article_ids").$type<number[]>(),
  status: text("status").notNull().default("published"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sources = pgTable("sources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  category: text("category").notNull(), // 'seguranca' | 'prevencao' | 'conscientizacao' | 'geral'
  selector: text("selector"), // CSS selector for scraping
  active: boolean("active").default(true).notNull(),
  lastScrapedAt: timestamp("last_scraped_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pendingArticles = pgTable("pending_articles", {
  id: serial("id").primaryKey(),
  sourceId: integer("source_id").references(() => sources.id),
  originalTitle: text("original_title").notNull(),
  originalUrl: text("original_url").notNull(),
  originalSummary: text("original_summary"),
  category: text("category").notNull(),
  selected: boolean("selected").default(false).notNull(),
  processed: boolean("processed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribed_at"),
});

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
