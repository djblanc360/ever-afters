import { pgTable, pgEnum, primaryKey, serial, timestamp, integer, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { raves } from './rave';

export const userRoleEnum = pgEnum('user_role', ['attendee', 'host']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  userRaves: many(usersToRaves),
}));


export const usersToRaves = pgTable(
  'users_to_raves',
  {
    userId: integer('user_id').notNull().references(() => users.id),
    raveId: integer('rave_id').notNull().references(() => raves.id),
    role: userRoleEnum('role').default('attendee'),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.raveId] }),
  })
);

export const usersToRavesRelations = relations(usersToRaves, ({ one }) => ({
  rave: one(raves, {
    fields: [usersToRaves.raveId],
    references: [raves.id],
  }),
  user: one(users, {
    fields: [usersToRaves.userId],
    references: [users.id],
  }),
}));

// Zod schemas for type validation
export const insertUserSchema = createInsertSchema(users, {
  email: (schema) => schema.email(), // email validation
  passwordHash: (schema) => schema.min(6), // minimum length validation
});
// export const selectUserSchema = createSelectSchema(users); // for update

// Types
export type NewUser = z.infer<typeof insertUserSchema>;
// export type User = z.infer<typeof selectUserSchema>; // for update