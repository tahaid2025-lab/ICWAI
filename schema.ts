import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const creations = pgTable("creations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // 'drawing', 'lego', 'playground'
  title: text("title"),
  prompt: text("prompt").notNull(),
  imageUrl: text("image_url").notNull(),
  metadata: jsonb("metadata"), // stores additional data like style, colors, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCreationSchema = createInsertSchema(creations).omit({
  id: true,
  createdAt: true,
});

export type InsertCreation = z.infer<typeof insertCreationSchema>;
export type Creation = typeof creations.$inferSelect;
