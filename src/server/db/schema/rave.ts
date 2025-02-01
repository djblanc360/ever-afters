import {  pgTable, primaryKey, serial, timestamp, integer, varchar } from 'drizzle-orm/pg-core';
import { relations  } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { usersToRaves } from './user';
import { venues } from './venue';



export const raves = pgTable('raves', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  theme: varchar('theme', { length: 100 }),
  genre: varchar('genre', { length: 50 }),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const ravesRelations = relations(raves, ({ many }) => ({
  userRaves: many(usersToRaves),
  raveVenues: many(ravesToVenues),
}));

export const ravesToVenues = pgTable(
  'raves_to_venues',
  {
    raveId: integer('rave_id').notNull().references(() => raves.id),
    venueId: integer('venue_id').notNull().references(() => venues.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.raveId, t.venueId] }),
  })
);

export const ravesToVenuesRelations = relations(ravesToVenues, ({ one }) => ({
  venue: one(venues, {
    fields: [ravesToVenues.venueId],
    references: [venues.id],
  }),
  rave: one(raves, {
    fields: [ravesToVenues.raveId],
    references: [raves.id],
  }),
}));

export const insertRaveSchema = createInsertSchema(raves);
// export const selectRaveSchema = createSelectSchema(raves);

export type NewRave = z.infer<typeof insertRaveSchema>;
// export type Rave = z.infer<typeof selectRaveSchema>;