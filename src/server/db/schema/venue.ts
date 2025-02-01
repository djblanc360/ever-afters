import { pgTable, integer, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { ravesToVenues } from './rave';

export const venues = pgTable('venues', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  address: varchar('address', { length: 255 }).notNull(),
  capacity: integer('capacity'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const venuesRelations = relations(venues, ({ many }) => ({
  raveVenues: many(ravesToVenues),
}));

export const insertVenueSchema = createInsertSchema(venues);
// export const selectVenueSchema = createSelectSchema(venues); // for update

export type NewVenue = z.infer<typeof insertVenueSchema>;
// export type Venue = z.infer<typeof selectVenueSchema>;
