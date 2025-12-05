import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const serviceStatus = pgTable("service_status", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  serviceName: text("service_name").notNull(),
  serviceUrl: text("service_url").notNull(),
  status: text("status").notNull(), // 'online', 'down', 'degraded'
  responseTime: integer("response_time"), // in milliseconds
  uptime: real("uptime"), // percentage
  checkedAt: timestamp("checked_at").notNull().defaultNow(),
});

export const insertServiceStatusSchema = createInsertSchema(serviceStatus).omit({
  id: true,
  checkedAt: true,
});

export type InsertServiceStatus = z.infer<typeof insertServiceStatusSchema>;
export type ServiceStatus = typeof serviceStatus.$inferSelect;
